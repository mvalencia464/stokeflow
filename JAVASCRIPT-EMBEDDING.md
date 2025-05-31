# StokeFlow JavaScript Widget - Complete Guide

## 🚀 **Any Form Can Now Be Embedded!**

The JavaScript widget now dynamically loads **any form** created in your StokeFlow dashboard, plus includes **automatic HighLevel CRM integration**.

## 📋 **Basic Embedding**

### Method 1: Auto-Initialize (Simplest)
```html
<div data-stokeflow-form="YOUR-FORM-ID"></div>
<script src="https://stokeflow.netlify.app/stokeflow-widget.js"></script>
```

### Method 2: Manual Initialize (More Control)
```html
<div id="my-form"></div>
<script src="https://stokeflow.netlify.app/stokeflow-widget.js"></script>
<script>
StokeFlow.ready(function() {
  const widget = StokeFlow.create({
    formId: 'YOUR-FORM-ID',
    containerId: 'my-form'
  });
});
</script>
```

## 🔗 **Getting Your Form ID**

1. Go to your StokeFlow dashboard: `https://stokeflow.netlify.app/dashboard/forms`
2. Create or edit any form
3. Copy the form ID from the URL or form settings
4. Use that ID in the embedding code

## 🎯 **HighLevel CRM Integration**

### Automatic Sync Setup

**Option 1: Global Configuration**
```html
<script>
// Set globally for all widgets
window.STOKEFLOW_HIGHLEVEL_TOKEN = 'your-private-integration-token';
window.STOKEFLOW_HIGHLEVEL_LOCATION_ID = 'your-location-id';
</script>
<div data-stokeflow-form="YOUR-FORM-ID"></div>
<script src="https://stokeflow.netlify.app/stokeflow-widget.js"></script>
```

**Option 2: Per-Widget Configuration**
```html
<div id="my-form"></div>
<script src="https://stokeflow.netlify.app/stokeflow-widget.js"></script>
<script>
StokeFlow.ready(function() {
  const widget = StokeFlow.create({
    formId: 'YOUR-FORM-ID',
    containerId: 'my-form',
    
    // HighLevel Integration
    highLevelToken: 'your-private-integration-token',
    highLevelLocationId: 'your-location-id',
    
    // Custom submission handler
    onSubmit: function(data) {
      console.log('Form submitted:', data);
      // Your custom logic here
    }
  });
});
</script>
```

### Getting HighLevel Credentials

1. **Login to HighLevel**
2. **Go to Settings → Private Integrations**
3. **Create New Integration**:
   - Name: "StokeFlow"
   - Scopes: `contacts.write`, `contacts.read`
4. **Copy the Private Integration Token**
5. **Get Location ID** from your HighLevel location settings

## 🎨 **Advanced Configuration**

```html
<script>
StokeFlow.ready(function() {
  const widget = StokeFlow.create({
    formId: 'YOUR-FORM-ID',
    containerId: 'my-form',
    
    // Styling
    theme: {
      primaryColor: '#10B981'  // Your brand color
    },
    
    // HighLevel Integration
    highLevelToken: 'your-token',
    highLevelLocationId: 'your-location-id',
    
    // Event Handlers
    onLoad: function(form) {
      console.log('Form loaded:', form.name);
    },
    
    onSubmit: function(data) {
      console.log('Form submitted:', data);
      
      // Custom analytics tracking
      gtag('event', 'form_submit', {
        form_id: 'YOUR-FORM-ID',
        form_name: form.name
      });
      
      // Custom redirect
      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);
    }
  });
});
</script>
```

## 📊 **Field Mapping to HighLevel**

The widget automatically maps form fields to HighLevel contacts:

| Form Field | HighLevel Field |
|------------|-----------------|
| `name`, `fullname`, `full_name` | `name` |
| `firstname`, `first_name` | `firstName` |
| `lastname`, `last_name` | `lastName` |
| `email` | `email` |
| `phone`, `phonenumber`, `phone_number` | `phone` |
| All other fields | `customFields` array |

## 🔧 **Troubleshooting**

### Form Not Loading
- **Check Form ID**: Ensure the form ID exists in your dashboard
- **Check Console**: Look for error messages in browser console
- **Test with Known ID**: Try with `test-highlevel` first

### HighLevel Sync Issues
- **Verify Token**: Ensure Private Integration token is correct
- **Check Permissions**: Token needs `contacts.write` scope
- **Valid Contact Data**: Form must have email OR phone field
- **Location ID**: Verify the location ID is correct

### Multiple Forms on Same Page
```html
<!-- Form 1 -->
<div data-stokeflow-form="contact-form"></div>

<!-- Form 2 -->
<div data-stokeflow-form="quote-form"></div>

<!-- Single script tag works for all -->
<script src="https://stokeflow.netlify.app/stokeflow-widget.js"></script>
```

## 🎯 **Best Practices**

### 1. **Form Design**
- Include `name` and `email` fields for HighLevel sync
- Use clear field names that map well to CRM
- Test forms in dashboard before embedding

### 2. **Performance**
- Load widget script once per page
- Use auto-initialization for simple cases
- Manual initialization for complex setups

### 3. **Analytics**
- Use `onSubmit` callback for custom tracking
- Track form views and completions
- Monitor HighLevel sync success

### 4. **Error Handling**
```javascript
onSubmit: function(data) {
  try {
    // Your custom logic
    console.log('Form submitted:', data);
  } catch (error) {
    console.error('Custom handler error:', error);
  }
}
```

## 🚀 **Production Deployment**

### 1. **Set Environment Variables**
In your website's configuration:
```javascript
window.STOKEFLOW_HIGHLEVEL_TOKEN = process.env.HIGHLEVEL_TOKEN;
window.STOKEFLOW_HIGHLEVEL_LOCATION_ID = process.env.HIGHLEVEL_LOCATION_ID;
```

### 2. **Security**
- Never expose tokens in client-side code for production
- Use server-side proxy for HighLevel API calls
- Implement rate limiting and validation

### 3. **Monitoring**
- Monitor form submission rates
- Track HighLevel sync success/failures
- Set up alerts for integration issues

## 📞 **Support**

- **Form Issues**: Check StokeFlow dashboard
- **Integration Issues**: Verify HighLevel credentials
- **Custom Development**: Modify widget for specific needs

---

**🎉 Your forms now work everywhere with automatic CRM sync!**
