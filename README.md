# StokeFlow - Professional Form Builder with Analytics

🚀 **A powerful, modern form builder with advanced analytics and CRM integration**

![StokeFlow](https://img.shields.io/badge/StokeFlow-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-blue.svg)

## ✨ Features

### 🎨 **Form Builder**
- **Drag & Drop Interface** - Reorder questions and steps effortlessly
- **Multi-Step Forms** - Create complex workflows with multiple steps
- **Professional Templates** - Pre-built templates for common use cases
- **Real-Time Preview** - See your form as you build it
- **Question Types**: Text, Email, Phone, Textarea, Radio, Checkbox, Select, Multi-Select, Date, Image-Select

### 📊 **Advanced Analytics**
- **Funnel Analysis** - Track user progression through each step
- **Drop-off Tracking** - Identify exactly where users abandon forms
- **Conversion Metrics** - Monitor form performance and optimization opportunities
- **Visual Charts** - Professional analytics dashboard with charts and tables
- **Real-Time Data** - Live tracking of form interactions

### 🔗 **Integrations**
- **HighLevel CRM** - Direct integration with HighLevel for lead management
- **Webhook Support** - Send form data to any endpoint
- **Email Notifications** - Automated email alerts for new submissions

### 🎯 **Templates**
- **Remodel/Moving Services** - Professional quote request forms with visual service selection
- **Contact Forms** - Simple contact and inquiry forms
- **Real Estate** - Property inquiry and lead capture forms
- **Custom Templates** - Create your own reusable templates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mvalencia464/stokeflow.git
cd stokeflow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🌐 Deployment

### Netlify (Recommended)

1. **Connect to GitHub**: Link your Netlify account to this repository
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy**: Netlify will automatically deploy on every push to main

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 📱 Embedding Forms

Once deployed, embed forms on any website:

```html
<!-- Embed as iframe -->
<iframe 
  src="https://your-domain.netlify.app/form/your-form-id" 
  width="100%" 
  height="600"
  frameborder="0">
</iframe>

<!-- Or link directly -->
<a href="https://your-domain.netlify.app/form/your-form-id">
  Fill out our form
</a>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for production:

```env
# HighLevel Integration (Optional)
VITE_HIGHLEVEL_API_URL=https://rest.gohighlevel.com/v1
VITE_HIGHLEVEL_WEBHOOK_URL=your-webhook-url

# Analytics (Optional)
VITE_ANALYTICS_ENABLED=true
```

## 🎨 Customization

### Themes
- Modify `src/styles/globals.css` for global styles
- Update `tailwind.config.js` for design system changes
- Customize colors in form settings

### Adding Question Types
1. Add new type to `src/types/form.ts`
2. Create component in `src/components/questions/`
3. Update `QuestionRenderer.tsx`

## 📊 Analytics Features

### Funnel Analysis
- **Step-by-step tracking** of user progression
- **Drop-off identification** at each form step
- **Conversion optimization** insights

### Metrics Tracked
- Form views and submissions
- Step completion rates
- User session data
- Time spent per step

## 🔗 Integrations

### HighLevel CRM
- Automatic contact creation
- Custom field mapping
- Lead scoring and tagging

### Webhooks
- Real-time form submission notifications
- Custom data processing
- Third-party integrations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for modern form building and analytics**
