import { Link } from 'react-router-dom';
import { Activity, ArrowRight, BarChart2, FileEdit, CheckCircle, Command } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-slate-900">LeadFlow</span>
          </div>
          <div>
            <Link to="/auth/login" className="btn-secondary mr-3">Log in</Link>
            <Link to="/auth/register" className="btn-primary">Sign up free</Link>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
              <span className="block">Optimize Your Lead Flow</span>
              <span className="block text-primary-600">Maximize Conversions</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-500">
              Build beautiful multi-step forms and identify exactly where users drop off to optimize your lead generation process.
            </p>
            <div className="mt-10 sm:flex sm:justify-center">
              <div className="mb-4 sm:mb-0 sm:mr-4">
                <Link to="/auth/register" className="btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
              </div>
              <div>
                <Link to="/auth/login" className="btn-secondary text-lg px-8 py-3">
                  Live Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Powerful Features</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
              Everything you need to create, manage, and optimize lead generation forms.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="bg-primary-100 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                <FileEdit className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Intuitive Form Builder</h3>
              <p className="text-slate-500">
                Create multi-step forms with a variety of question types including text, multiple choice, and image-based selectors.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="bg-primary-100 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                <Command className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Embedding</h3>
              <p className="text-slate-500">
                Simple embed codes for your website with responsive design that works perfectly on all devices.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8 shadow-sm border border-slate-100">
              <div className="bg-primary-100 rounded-lg w-12 h-12 flex items-center justify-center mb-5">
                <BarChart2 className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Detailed Analytics</h3>
              <p className="text-slate-500">
                Identify drop-off points with step-by-step funnel analysis to optimize your conversion rates.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to optimize your lead generation?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-100">
            Start creating your first form in minutes.
          </p>
          <div className="mt-8">
            <Link 
              to="/auth/register" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 md:text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <Activity className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">LeadFlow</span>
            </div>
            <div className="flex space-x-6">
              <Link to="#" className="text-slate-300 hover:text-white">Terms</Link>
              <Link to="#" className="text-slate-300 hover:text-white">Privacy</Link>
              <Link to="#" className="text-slate-300 hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-slate-400">
            <div>© 2025 LeadFlow. All rights reserved.</div>
            <div className="mt-4 md:mt-0">
              Made with <span className="text-error-500">♥</span> for your business growth
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;