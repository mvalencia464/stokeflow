import { useState, useEffect } from 'react';
import { useIntegrationStore } from '../../stores/integrationStore';
import { highlevelService } from '../../services/highlevel';

interface HighLevelConfigProps {
  onClose: () => void;
}

export const HighLevelConfig = ({ onClose }: HighLevelConfigProps) => {
  const { configureHighLevel } = useIntegrationStore();
  const [config, setConfig] = useState({
    privateIntegrationToken: '',
    locationId: '',
    defaultWorkflowId: '',
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize form with environment variables
  useEffect(() => {
    const envToken = import.meta.env.VITE_HIGHLEVEL_PRIVATE_TOKEN;
    const envLocationId = import.meta.env.VITE_HIGHLEVEL_LOCATION_ID;
    const envWorkflowId = import.meta.env.VITE_HIGHLEVEL_DEFAULT_WORKFLOW_ID;

    if (envToken || envLocationId || envWorkflowId) {
      setConfig(prev => ({
        ...prev,
        privateIntegrationToken: envToken || prev.privateIntegrationToken,
        locationId: envLocationId || prev.locationId,
        defaultWorkflowId: envWorkflowId || prev.defaultWorkflowId,
      }));
    }
  }, []);

  const handleTestConnection = async () => {
    if (!config.privateIntegrationToken || !config.locationId) {
      setConnectionStatus('error');
      setErrorMessage('Please enter both Private Integration Token and Location ID before testing');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      // Temporarily configure the service for testing
      highlevelService.configure({
        privateIntegrationToken: config.privateIntegrationToken,
        locationId: config.locationId,
      });

      const isConnected = await highlevelService.testConnection();

      if (isConnected) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
        setErrorMessage('Connection test failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    configureHighLevel(config);
    onClose();
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-slate-900 mb-4">
        Configure HighLevel Integration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="privateIntegrationToken" className="form-label">
            Private Integration Token
          </label>
          <input
            type="text"
            id="privateIntegrationToken"
            className="input-field"
            value={config.privateIntegrationToken}
            onChange={(e) => setConfig(prev => ({ ...prev, privateIntegrationToken: e.target.value }))}
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            {config.privateIntegrationToken && import.meta.env.VITE_HIGHLEVEL_PRIVATE_TOKEN
              ? '✓ Loaded from environment variables'
              : 'Find your Private Integration Token in HighLevel under Settings → Private Integrations'
            }
          </p>
        </div>

        <div>
          <label htmlFor="locationId" className="form-label">
            Location ID
          </label>
          <input
            type="text"
            id="locationId"
            className="input-field"
            value={config.locationId}
            onChange={(e) => setConfig(prev => ({ ...prev, locationId: e.target.value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="workflowId" className="form-label">
            Default Workflow ID (Optional)
          </label>
          <input
            type="text"
            id="workflowId"
            className="input-field"
            value={config.defaultWorkflowId}
            onChange={(e) => setConfig(prev => ({ ...prev, defaultWorkflowId: e.target.value }))}
          />
          <p className="mt-1 text-xs text-slate-500">
            Leads will automatically be added to this workflow
          </p>
        </div>

        {/* Test Connection Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Test Connection</span>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection || !config.privateIntegrationToken || !config.locationId}
              className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
            >
              {isTestingConnection ? 'Testing...' : 'Test'}
            </button>
          </div>

          {connectionStatus === 'success' && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
              ✓ Connection successful! Your HighLevel integration is working.
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              ✗ Connection failed: {errorMessage}
            </div>
          )}

          {connectionStatus === 'idle' && config.privateIntegrationToken && config.locationId && (
            <div className="text-sm text-slate-500">
              Click "Test" to verify your HighLevel connection
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};