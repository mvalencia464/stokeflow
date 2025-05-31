import { useEffect } from 'react';
import { useIntegrationStore } from '../stores/integrationStore';

/**
 * AppInitializer - Automatically configures integrations from environment variables
 * This ensures HighLevel integration works without manual configuration
 */
export const AppInitializer = () => {
  const { configureHighLevel, highlevel } = useIntegrationStore();

  useEffect(() => {
    // Auto-configure HighLevel integration from environment variables
    const envToken = import.meta.env.VITE_HIGHLEVEL_PRIVATE_TOKEN;
    const envLocationId = import.meta.env.VITE_HIGHLEVEL_LOCATION_ID;
    const envWorkflowId = import.meta.env.VITE_HIGHLEVEL_DEFAULT_WORKFLOW_ID;

    // Only configure if we have the required credentials and it's not already configured
    if (envToken && envLocationId && !highlevel.enabled) {
      console.log('🔧 Auto-configuring HighLevel integration from environment variables');
      
      configureHighLevel({
        privateIntegrationToken: envToken,
        locationId: envLocationId,
        defaultWorkflowId: envWorkflowId || undefined
      });
      
      console.log('✅ HighLevel integration auto-configured successfully');
      console.log('📋 Location ID:', envLocationId);
      console.log('📋 Token preview:', envToken.substring(0, 10) + '...');
    } else if (highlevel.enabled) {
      console.log('✅ HighLevel integration already configured');
    } else {
      console.log('⚠️ HighLevel environment variables not found - integration disabled');
    }
  }, [configureHighLevel, highlevel.enabled]);

  // This component doesn't render anything
  return null;
};

export default AppInitializer;
