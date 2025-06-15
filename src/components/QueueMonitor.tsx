
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play,
  RefreshCw
} from "lucide-react";
import { useEventQueue } from "@/hooks/useEventQueue";

export const QueueMonitor = () => {
  const { queueEvents, processEvent, isLoading, isProcessing } = useEventQueue();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading queue...</p>
        </div>
      </div>
    );
  }

  const pendingEvents = queueEvents.filter(e => e.status === 'pending');
  const processingEvents = queueEvents.filter(e => e.status === 'processing');
  const completedEvents = queueEvents.filter(e => e.status === 'completed');
  const failedEvents = queueEvents.filter(e => e.status === 'failed');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            Event Queue Monitor
          </h1>
          <p className="text-slate-600 mt-2">
            Monitor and manage background tasks and events
          </p>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingEvents.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Processing</p>
                <p className="text-2xl font-bold text-blue-600">{processingEvents.length}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedEvents.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedEvents.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Events</CardTitle>
          <CardDescription>
            Recent events in the processing queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queueEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.event_type}</div>
                      <div className="text-sm text-slate-500">
                        {JSON.stringify(event.payload).substring(0, 50)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(event.status)}
                        {event.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">P{event.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(event.scheduled_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {event.attempts}/{event.max_attempts}
                  </TableCell>
                  <TableCell>
                    {event.processed_at 
                      ? new Date(event.processed_at).toLocaleString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {event.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => processEvent(event.id)}
                        disabled={isProcessing}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    {event.status === 'failed' && event.last_error && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title={event.last_error}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {queueEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No events in queue</h3>
              <p className="text-slate-500">Events will appear here as they are queued for processing</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
