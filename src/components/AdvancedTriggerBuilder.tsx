import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventDiscovery } from "@/hooks/useEventDiscovery";
import { Plus, X, Zap, Filter } from "lucide-react";

interface TriggerRule {
  id: string;
  field: string;
  operator: string;
  value: any;
  dataType: string;
}

interface AdvancedTriggerBuilderProps {
  websiteId: string;
  onTriggerRulesChange: (rules: any) => void;
  initialRules?: any;
}

const operators = [
  { value: 'equals', label: 'Equals', types: ['string', 'number', 'boolean'] },
  { value: 'not_equals', label: 'Not Equals', types: ['string', 'number', 'boolean'] },
  { value: 'contains', label: 'Contains', types: ['string'] },
  { value: 'not_contains', label: 'Not Contains', types: ['string'] },
  { value: 'starts_with', label: 'Starts With', types: ['string'] },
  { value: 'ends_with', label: 'Ends With', types: ['string'] },
  { value: 'greater_than', label: 'Greater Than', types: ['number'] },
  { value: 'less_than', label: 'Less Than', types: ['number'] },
  { value: 'greater_than_or_equal', label: 'Greater Than or Equal', types: ['number'] },
  { value: 'less_than_or_equal', label: 'Less Than or Equal', types: ['number'] }
];

export const AdvancedTriggerBuilder = ({ 
  websiteId, 
  onTriggerRulesChange, 
  initialRules 
}: AdvancedTriggerBuilderProps) => {
  const { discoveredEvents } = useEventDiscovery(websiteId);
  const [selectedEventType, setSelectedEventType] = useState(initialRules?.eventType || '');
  const [triggerRules, setTriggerRules] = useState<TriggerRule[]>(
    initialRules?.rules || []
  );
  const [conditionLogic, setConditionLogic] = useState(initialRules?.logic || 'AND');

  // Mock events for development
  const mockEvents = [
    {
      id: '1',
      event_type: 'page_view',
      occurrence_count: 145,
      sample_payload: { url: '/home', timestamp: 1649876543210, user_id: 'user123' }
    },
    {
      id: '2',
      event_type: 'button_click',
      occurrence_count: 87,
      sample_payload: { element: 'cta-button', page: '/pricing', timestamp: 1649876543210 }
    },
    {
      id: '3',
      event_type: 'purchase',
      occurrence_count: 23,
      sample_payload: { amount: 99.99, currency: 'USD', product_id: 'prod_123', user_id: 'user456' }
    }
  ];

  const eventsToShow = discoveredEvents.length > 0 ? discoveredEvents : mockEvents;
  const selectedEvent = eventsToShow.find(e => e.event_type === selectedEventType);

  const getFieldsFromEvent = (event: any) => {
    if (!event || !event.sample_payload) return [];
    
    const fields: Array<{key: string, type: string, sample: any}> = [];
    
    const traverse = (obj: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          traverse(value, fullKey);
        } else {
          fields.push({
            key: fullKey,
            type: Array.isArray(value) ? 'array' : typeof value,
            sample: value
          });
        }
      }
    };
    
    traverse(event.sample_payload);
    return fields;
  };

  const addTriggerRule = () => {
    const newRule: TriggerRule = {
      id: `rule_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      dataType: 'string'
    };
    
    const newRules = [...triggerRules, newRule];
    setTriggerRules(newRules);
    updateTriggerRules(newRules);
  };

  const removeTriggerRule = (ruleId: string) => {
    const newRules = triggerRules.filter(rule => rule.id !== ruleId);
    setTriggerRules(newRules);
    updateTriggerRules(newRules);
  };

  const updateRule = (ruleId: string, updates: Partial<TriggerRule>) => {
    const newRules = triggerRules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    setTriggerRules(newRules);
    updateTriggerRules(newRules);
  };

  const updateTriggerRules = (rules: TriggerRule[]) => {
    onTriggerRulesChange({
      eventType: selectedEventType,
      logic: conditionLogic,
      rules: rules
    });
  };

  const handleEventTypeChange = (eventType: string) => {
    setSelectedEventType(eventType);
    setTriggerRules([]);
    onTriggerRulesChange({
      eventType,
      logic: conditionLogic,
      rules: []
    });
  };

  const getAvailableOperators = (dataType: string) => {
    return operators.filter(op => op.types.includes(dataType));
  };

  const renderValueInput = (rule: TriggerRule) => {
    switch (rule.dataType) {
      case 'boolean':
        return (
          <Select 
            value={rule.value.toString()} 
            onValueChange={(value) => updateRule(rule.id, { value: value === 'true' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={rule.value}
            onChange={(e) => updateRule(rule.id, { value: parseFloat(e.target.value) || 0 })}
            placeholder="Enter number"
          />
        );
      
      default:
        return (
          <Input
            value={rule.value}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
            placeholder="Enter value"
          />
        );
    }
  };

  const eventFields = selectedEvent ? getFieldsFromEvent(selectedEvent) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Advanced Trigger Configuration
        </CardTitle>
        <CardDescription>
          Configure when this campaign should trigger based on discovered events and their properties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Type Selection */}
        <div>
          <Label htmlFor="event-type">Trigger Event Type</Label>
          <Select value={selectedEventType} onValueChange={handleEventTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event type" />
            </SelectTrigger>
            <SelectContent>
              {eventsToShow.map((event) => (
                <SelectItem key={event.id || event.event_type} value={event.event_type}>
                  <div className="flex items-center justify-between w-full">
                    <span>{event.event_type}</span>
                    <Badge variant="outline" className="ml-2">
                      {event.occurrence_count.toLocaleString()}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEvent && (
          <>
            {/* Condition Logic */}
            <div>
              <Label htmlFor="condition-logic">Condition Logic</Label>
              <Select value={conditionLogic} onValueChange={(value) => {
                setConditionLogic(value);
                updateTriggerRules(triggerRules);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">ALL conditions must match (AND)</SelectItem>
                  <SelectItem value="OR">ANY condition can match (OR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trigger Rules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Trigger Conditions</Label>
                <Button onClick={addTriggerRule} size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Condition
                </Button>
              </div>

              {triggerRules.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <Filter className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 mb-4">No conditions set</p>
                  <p className="text-sm text-slate-400 mb-4">
                    Campaign will trigger on every "{selectedEventType}" event
                  </p>
                  <Button onClick={addTriggerRule} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Condition
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {triggerRules.map((rule, index) => (
                    <div key={rule.id} className="flex items-center gap-3 p-4 border rounded-lg bg-slate-50">
                      {index > 0 && (
                        <Badge variant="secondary" className="shrink-0">
                          {conditionLogic}
                        </Badge>
                      )}
                      
                      {/* Field Selection */}
                      <div className="flex-1">
                        <Select 
                          value={rule.field} 
                          onValueChange={(field) => {
                            const fieldInfo = eventFields.find(f => f.key === field);
                            updateRule(rule.id, { 
                              field, 
                              dataType: fieldInfo?.type || 'string',
                              value: fieldInfo?.type === 'boolean' ? false : 
                                     fieldInfo?.type === 'number' ? 0 : ''
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {eventFields.map((field) => (
                              <SelectItem key={field.key} value={field.key}>
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-mono text-sm">{field.key}</span>
                                  <div className="flex items-center gap-2 ml-2">
                                    <Badge variant="outline" className="text-xs">
                                      {field.type}
                                    </Badge>
                                    <span className="text-xs text-slate-500">
                                      (e.g., {JSON.stringify(field.sample)})
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Operator Selection */}
                      <div className="w-40">
                        <Select 
                          value={rule.operator} 
                          onValueChange={(operator) => updateRule(rule.id, { operator })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableOperators(rule.dataType).map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value Input */}
                      <div className="flex-1">
                        {renderValueInput(rule)}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTriggerRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Fields Reference */}
            <div>
              <Label>Available Fields for "{selectedEventType}"</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {eventFields.map((field, index) => (
                  <Badge key={index} variant="outline" className="justify-start p-2">
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-xs">{field.key}</span>
                      <span className="text-xs text-slate-500">
                        {field.type} • e.g., {JSON.stringify(field.sample)}
                      </span>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
