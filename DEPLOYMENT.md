# StokeFlow Deployment Guide

## 🚀 Deploy to Netlify (Recommended)

### Step 1: Connect GitHub Repository

1. **Login to Netlify**: Go to [netlify.com](https://netlify.com) and sign in
2. **New Site**: Click "New site from Git"
3. **Connect GitHub**: Choose GitHub and authorize Netlify
4. **Select Repository**: Choose `mvalencia464/stokeflow`

### Step 2: Configure Build Settings

Netlify should auto-detect these settings from `netlify.toml`:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### Step 3: Set Environment Variables (Optional)

In Netlify dashboard → Site settings → Environment variables:

```
VITE_APP_ENV=production
VITE_ANALYTICS_ENABLED=true
VITE_HIGHLEVEL_PRIVATE_TOKEN=your_token_here
VITE_HIGHLEVEL_LOCATION_ID=your_location_id
```

### Step 4: Deploy

1. **Click Deploy**: Netlify will build and deploy automatically
2. **Custom Domain**: Set up your custom domain in Site settings
3. **SSL**: Netlify provides free SSL certificates

## 🌐 Your Live URLs

After deployment, you'll have:

- **Dashboard**: `https://your-site.netlify.app/dashboard`
- **Form Builder**: `https://your-site.netlify.app/dashboard/forms`
- **Analytics**: `https://your-site.netlify.app/dashboard/analytics`
- **Public Forms**: `https://your-site.netlify.app/form/[form-id]`

## 📱 Embedding Forms on Websites

### Option 1: iframe Embed

```html
<iframe 
  src="https://your-site.netlify.app/form/your-form-id" 
  width="100%" 
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>
```

### Option 2: JavaScript Embed (Advanced)

```html
<div id="stokeflow-form"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-site.netlify.app/form/your-form-id';
    iframe.width = '100%';
    iframe.height = '600';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('stokeflow-form').appendChild(iframe);
  })();
</script>
```

### Option 3: Popup/Modal Embed

```html
<button onclick="openStokeFlowForm()">Get Quote</button>

<script>
function openStokeFlowForm() {
  var modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
    align-items: center; justify-content: center;
  `;
  
  var iframe = document.createElement('iframe');
  iframe.src = 'https://your-site.netlify.app/form/your-form-id';
  iframe.style.cssText = `
    width: 90%; max-width: 800px; height: 90%; max-height: 600px;
    border: none; border-radius: 12px; background: white;
  `;
  
  modal.appendChild(iframe);
  modal.onclick = function(e) {
    if (e.target === modal) document.body.removeChild(modal);
  };
  
  document.body.appendChild(modal);
}
</script>
```

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Buy Domain**: Purchase from any domain registrar
2. **Add to Netlify**: Site settings → Domain management → Add custom domain
3. **Configure DNS**: Point your domain to Netlify's servers
4. **SSL Certificate**: Netlify will automatically provision SSL

### HighLevel Integration Setup

1. **Get Private Token**: HighLevel → Settings → Private Integrations
2. **Create Integration**: Name it "StokeFlow" with required scopes
3. **Add to Netlify**: Environment variables → Add token
4. **Test Integration**: Create a test form and submit

### Analytics Configuration

Analytics work out of the box! To enhance:

1. **Google Analytics**: Add GA4 tracking code to `index.html`
2. **Custom Events**: Modify analytics store for additional tracking
3. **Export Data**: Use the built-in export functionality

## 🛠️ Troubleshooting

### Build Fails
- Check Node version is 18+
- Verify all dependencies are in package.json
- Check for TypeScript errors

### Forms Not Loading
- Verify the form ID in the URL
- Check browser console for errors
- Ensure the form is published

### HighLevel Integration Issues
- Verify token has correct permissions
- Check location ID is correct
- Test with a simple contact form first

### Analytics Not Tracking
- Check localStorage is enabled
- Verify analytics events in browser dev tools
- Clear browser cache and test again

## 📊 Monitoring & Maintenance

### Performance Monitoring
- Use Netlify Analytics for traffic insights
- Monitor Core Web Vitals in Google Search Console
- Set up uptime monitoring (UptimeRobot, etc.)

### Regular Updates
- Update dependencies monthly: `npm update`
- Monitor for security vulnerabilities: `npm audit`
- Test forms regularly to ensure functionality

### Backup Strategy
- GitHub serves as code backup
- Export form data regularly from dashboard
- Document any custom configurations

## 🎯 Next Steps

1. **Deploy to Netlify** using this guide
2. **Set up custom domain** for professional branding
3. **Create your first forms** using the templates
4. **Embed forms** on your websites
5. **Monitor analytics** to optimize conversion rates

## 📞 Support

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check README.md for detailed info
- **Community**: Share your forms and get feedback

---

**Ready to launch your professional form builder! 🚀**
