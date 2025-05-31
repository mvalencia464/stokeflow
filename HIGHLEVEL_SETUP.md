# HighLevel Integration Setup Guide

This guide will help you set up the HighLevel integration to automatically capture leads from your forms using Private Integration Tokens (v2 API).

## Prerequisites

1. A HighLevel account with Private Integration access
2. Admin or appropriate permissions in your HighLevel location

## Step 1: Create a Private Integration Token

1. Log into your HighLevel account
2. Go to **Settings** → **Private Integrations** (under "Other Settings")
3. Click **Create new Integration**
4. Give it a name like "LeadFlow Integration" and description
5. Select the required scopes/permissions:
   - **contacts.write** (to create contacts)
   - **contacts.read** (to test connection)
   - **workflows.write** (if using workflows)
6. Copy the generated Private Integration Token (you won't be able to see it again!)

## Step 2: Get Your Location ID

1. In HighLevel, go to your location settings
2. The Location ID is usually visible in the URL or location settings
3. It's a string that looks like: `ve9EPM428h8vShlRW1KT`

## Step 3: Configure the Integration

### Option A: Using Environment Variables (Recommended)

1. Copy `.env.example` to `.env`
2. Fill in your values:
   ```
   VITE_HIGHLEVEL_PRIVATE_TOKEN=your_actual_private_integration_token
   VITE_HIGHLEVEL_LOCATION_ID=your_actual_location_id
   ```

### Option B: Using the UI

1. Start your application
2. Go to the integrations settings
3. Click "Configure HighLevel"
4. Enter your Private Integration Token and Location ID
5. Click "Test" to verify the connection
6. Save the configuration

## Step 4: Optional Workflow Setup

If you want leads to automatically be added to a specific workflow:

1. In HighLevel, go to **Automation** → **Workflows**
2. Find or create the workflow you want to use
3. Copy the Workflow ID from the URL or workflow settings
4. Add it to your configuration

## Troubleshooting

### Common Issues

1. **401 Unauthorized Error**

   - Check that your Private Integration Token is correct
   - Ensure the token has the necessary scopes/permissions

2. **403 Forbidden Error**

   - Verify you have access to the specified location
   - Check that your user role has API access permissions

3. **404 Not Found Error**

   - Verify your Location ID is correct
   - Ensure the location exists and you have access

4. **422 Validation Error**
   - Check that required fields (email or phone) are being captured
   - Verify field names match expected format

### Testing the Integration

1. Use the "Test Connection" button in the configuration
2. Submit a test form and check HighLevel for the new contact
3. Check browser console for any error messages

### API Rate Limits

HighLevel has rate limits on their API. If you're getting 429 errors:

- Reduce the frequency of form submissions during testing
- Contact HighLevel support if you need higher limits

## Field Mapping

The integration automatically maps common form fields:

- **Full Name** → Split into firstName and lastName
- **First Name** → firstName
- **Last Name** → lastName
- **Email Address** or **Email** → email
- **Phone Number** or **Phone** → phone

All other fields are added as custom fields with snake_case naming.

## Security Notes

- Never commit your actual API keys to version control
- Use environment variables for production deployments
- Regularly rotate your API keys for security
- Monitor API usage in HighLevel dashboard

## Support

If you continue to have issues:

1. Check the browser console for detailed error messages
2. Verify your HighLevel account has API access enabled
3. Test the API connection using the built-in test feature
4. Contact HighLevel support for API-specific issues
