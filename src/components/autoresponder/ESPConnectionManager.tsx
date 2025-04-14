
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ESPConnection } from '@/types/autoresponder';
import { autoresponderConnectionsTable } from '@/utils/supabaseHelpers';
import ConnectionForm from './ConnectionForm';
import ConnectionItem from './ConnectionItem';
import EmptyConnectionState from './EmptyConnectionState';
import DeleteConnectionDialog from './DeleteConnectionDialog';

interface ESPConnectionManagerProps {
  userId: string;
}

const ESPConnectionManager: React.FC<ESPConnectionManagerProps> = ({ userId }) => {
  const [connections, setConnections] = useState<ESPConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [deletingConnection, setDeletingConnection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnections();
  }, [userId]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const { data, error } = await autoresponderConnectionsTable()
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data as ESPConnection[]);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: 'Failed to load connections',
        description: 'Could not retrieve your email marketing connections.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddConnection = (newConnection: ESPConnection) => {
    setConnections([newConnection, ...connections]);
    setShowForm(false);
  };

  const testConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);
    try {
      const response = await fetch('/api/test-esp-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Connection test failed');

      const { error } = await autoresponderConnectionsTable()
        .update({ last_verified: new Date().toISOString() })
        .eq('id', connectionId);

      if (error) throw error;

      setConnections(
        connections.map(conn => 
          conn.id === connectionId 
            ? { ...conn, last_verified: new Date().toISOString() } 
            : conn
        )
      );

      toast({
        title: 'Connection test successful',
        description: 'Your email marketing connection is working properly.',
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: 'Connection test failed',
        description: error instanceof Error ? error.message : 'Could not verify the connection.',
        variant: 'destructive',
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingConnection) return;
    
    try {
      const { error } = await autoresponderConnectionsTable()
        .delete()
        .eq('id', deletingConnection);

      if (error) throw error;

      setConnections(connections.filter(conn => conn.id !== deletingConnection));
      
      toast({
        title: 'Connection removed',
        description: 'The email marketing connection has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast({
        title: 'Failed to remove connection',
        description: 'There was an error deleting the connection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingConnection(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Marketing Connections</CardTitle>
          <CardDescription>Connect your email service provider to automatically add leads from your funnels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Marketing Connections</CardTitle>
            <CardDescription>Connect your email service provider to automatically add leads from your funnels</CardDescription>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            variant={showForm ? "outline" : "default"}
            className={showForm ? "" : "bg-purple-600 hover:bg-purple-700"}
          >
            {showForm ? "Cancel" : <>
              <Plus className="mr-2 h-4 w-4" /> Add Connection
            </>}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <ConnectionForm 
              userId={userId} 
              onSuccess={handleAddConnection} 
              onCancel={() => setShowForm(false)} 
            />
          )}

          {connections.length === 0 && !showForm ? (
            <EmptyConnectionState onAddConnection={() => setShowForm(true)} />
          ) : (
            connections.length > 0 && (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <ConnectionItem 
                    key={connection.id}
                    connection={connection}
                    onTest={testConnection}
                    onDelete={setDeletingConnection}
                    testingId={testingConnection}
                  />
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>

      <DeleteConnectionDialog 
        isOpen={!!deletingConnection}
        onClose={() => setDeletingConnection(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ESPConnectionManager;
