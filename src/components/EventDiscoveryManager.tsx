
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEventDiscovery } from "@/hooks/useEventDiscovery";
import { useWebsiteManagement } from "@/hooks/useWebsiteManagement";
import { 
  Activity, 
  DollarSign, 
  ChevronDown, 
  ChevronRight,
  Search,
  Eye,
  TrendingUp,
  RefreshCw,
  Code,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export const EventDiscoveryManager = () => {
  const { websites } = useWebsiteManagement();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
  const { 
    discoveredEvents, 
    updateConversionEvent, 
    triggerEventDiscovery,
    isLoading, 
    isUpdating,
    isTriggering 
  } = useEventDiscovery(selectedWebsiteId);
  
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [revenueConfig, setRevenueConfig] = useState({
    enabled: false,
    revenue_field: '',
    fallback_value: 0
  });

  // Mock data for development
  const mockEvents = selectedWebsiteId ? [
    {
      id: '1',
      website_id: selectedWebsiteId,
      event_type: 'page_view',
      event_schema: { url: 'string', timestamp: 'number' },
      sample_payload: { url: '/home', timestamp: 1649876543210, user_id: 'user123' },
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      occurrence_count: 145,
      is_conversion_event: false,
      revenue_mapping: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      website_id: selectedWebsiteId,
      event_type: 'button_click',
      event_schema: { element: 'string', page: 'string' },
      sample_payload: { element: 'cta-button', page: '/pricing', timestamp: 1649876543210 },
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      occurrence_count: 87,
      is_conversion_event: false,
      revenue_mapping: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      website_id: selectedWebsiteId,
      event_type: 'purchase',
      event_schema: { amount: 'number', currency: 'string', product_id: 'string' },
      sample_payload: { amount: 99.99, currency: 'USD', product_id: 'prod_123', user_id: 'user456' },
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      occurrence_count: 23,
      is_conversion_event: true,
      revenue_mapping: { enabled: true, revenue_field: 'amount', fallback_value: 0 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] : [];

  const eventsToShow = discoveredEvents.length > 0 ? discoveredEvents : mockEvents;
  const filteredEvents = eventsToShow.filter(event =>
    event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(event.sample_payload).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleConversionToggle = (event: any, isConversion: boolean) => {
    if (isConversion) {
      setSelectedEvent(event);
      setRevenueConfig(event.revenue_mapping || {
        enabled: false,
        revenue_field: '',
        fallback_value: 0
      });
    } else {
      updateConversionEvent({
        eventId: event.id,
        isConversion: false
      });
    }
  };

  const handleSaveRevenueConfig = () => {
    if (!selectedEvent) return;

    updateConversionEvent({
      eventId: selectedEvent.id,
      isConversion: true,
      revenueMapping: revenueConfig.enabled ? revenueConfig : undefined
    });

    setSelectedEvent(null);
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'page_view':
        return <Eye className="w-4 h-4" />;
      case 'button_click':
      case 'click':
        return <Zap className="w-4 h-4" />;
      case 'conversion':
      case 'purchase':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const extractFieldsFromPayload = (payload: any) => {
    const fields: Array<{key: string, type: string, value: any}> = [];
    
    const traverse = (obj: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          traverse(value, fullKey);
        } else {
          fields.push({
            key: fullKey,
            type: typeof value,
            value: value
          });
        }
      }
    };
    
    traverse(payload);
    return fields;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            Event Discovery & Management
          </h1>
          <p className="text-slate-600 mt-2">
            Auto-discover events from your websites and configure conversion tracking
          </p>
        </div>
      </div>

      {/* Website Selection & Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Label htmlFor="website">Select Website</Label>
              <Select value={selectedWebsiteId} onValueChange={setSelectedWebsiteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a website to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((website) => (
                    <SelectItem key={website.id} value={website.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${website.tracking_enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {website.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => selectedWebsiteId && triggerEventDiscovery(selectedWebsiteId)}
                disabled={!selectedWebsiteId || isTriggering}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
                {isTriggering ? 'Discovering...' : 'Refresh Events'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedWebsiteId && (
        <>
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search events by type or payload data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading discovered events...</p>
                </CardContent>
              </Card>
            ) : filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Events Discovered</h3>
                  <p className="text-slate-500 mb-4">
                    {discoveredEvents.length === 0 
                      ? "No events have been discovered yet. Make sure your website beacon is active and receiving traffic."
                      : "No events match your search criteria."
                    }
                  </p>
                  {discoveredEvents.length === 0 && (
                    <Button 
                      onClick={() => triggerEventDiscovery(selectedWebsiteId)}
                      disabled={isTriggering}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Discover Events
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{event.event_type}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {event.occurrence_count.toLocaleString()} occurrences
                            </span>
                            <span>Last seen: {new Date(event.last_seen).toLocaleString()}</span>
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {event.is_conversion_event && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Conversion Event
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`conversion-${event.id}`} className="text-sm">
                            Conversion Event
                          </Label>
                          <Switch
                            id={`conversion-${event.id}`}
                            checked={event.is_conversion_event}
                            onCheckedChange={(checked) => handleConversionToggle(event, checked)}
                            disabled={isUpdating}
                          />
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(event.id)}
                        >
                          {expandedEvents.has(event.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Collapsible open={expandedEvents.has(event.id)}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Event Schema */}
                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Event Schema
                            </h4>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                                {JSON.stringify(event.event_schema, null, 2)}
                              </pre>
                            </div>
                          </div>
                          
                          {/* Sample Payload */}
                          <div>
                            <h4 className="font-medium mb-3">Sample Payload</h4>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                                {JSON.stringify(event.sample_payload, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                        
                        {/* Available Fields for Triggering */}
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Available Fields for Campaign Triggers</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {extractFieldsFromPayload(event.sample_payload).map((field, index) => (
                              <Badge key={index} variant="outline" className="justify-start">
                                <span className="font-mono text-xs">{field.key}</span>
                                <span className="ml-1 text-xs text-slate-500">({field.type})</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* Revenue Configuration Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Configure Revenue Tracking
            </DialogTitle>
            <DialogDescription>
              Set up revenue tracking for the "{selectedEvent?.event_type}" conversion event
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-revenue"
                checked={revenueConfig.enabled}
                onCheckedChange={(checked) => setRevenueConfig(prev => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="enable-revenue">Enable Revenue Tracking</Label>
            </div>
            
            {revenueConfig.enabled && (
              <>
                <div>
                  <Label htmlFor="revenue-field">Revenue Field Path</Label>
                  <Select value={revenueConfig.revenue_field} onValueChange={(value) => 
                    setRevenueConfig(prev => ({ ...prev, revenue_field: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue field from payload" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedEvent && extractFieldsFromPayload(selectedEvent.sample_payload)
                        .filter(field => field.type === 'number')
                        .map((field, index) => (
                          <SelectItem key={index} value={field.key}>
                            {field.key} (current: {field.value})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fallback-value">Fallback Revenue Value</Label>
                  <Input
                    id="fallback-value"
                    type="number"
                    step="0.01"
                    value={revenueConfig.fallback_value}
                    onChange={(e) => setRevenueConfig(prev => ({ 
                      ...prev, 
                      fallback_value: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="0.00"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Used when the revenue field is missing or invalid
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRevenueConfig} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
