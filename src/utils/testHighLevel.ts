// Test utility for HighLevel integration
// This file can be used to test the HighLevel integration manually

import { highlevelService } from '../services/highlevel';

export const testHighLevelIntegration = async (config: {
  privateIntegrationToken: string;
  locationId: string;
  workflowId?: string;
}) => {
  console.log('Testing HighLevel integration...');
  
  try {
    // Configure the service
    highlevelService.configure({
      privateIntegrationToken: config.privateIntegrationToken,
      locationId: config.locationId,
    });

    // Test connection
    console.log('1. Testing connection...');
    const connectionTest = await highlevelService.testConnection();
    console.log('Connection test result:', connectionTest);

    // Test contact creation
    console.log('2. Testing contact creation...');
    const testContact = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      locationId: config.locationId,
      tags: ['test-lead'],
      customFields: {
        source: 'LeadFlow Test',
        test_field: 'test_value',
      },
    };

    const contactResult = await highlevelService.createContact(testContact);
    console.log('Contact creation result:', contactResult);

    // Test workflow addition if workflow ID is provided
    if (config.workflowId && contactResult.contact?.id) {
      console.log('3. Testing workflow addition...');
      const workflowResult = await highlevelService.addToWorkflow(
        contactResult.contact.id,
        config.workflowId
      );
      console.log('Workflow addition result:', workflowResult);
    }

    console.log('✅ All tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Example usage (uncomment to test):
// testHighLevelIntegration({
//   privateIntegrationToken: 'your-private-integration-token',
//   locationId: 'your-location-id',
//   workflowId: 'your-workflow-id', // optional
// });
