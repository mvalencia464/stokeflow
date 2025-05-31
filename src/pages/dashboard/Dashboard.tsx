import { Link } from 'react-router-dom';
import { 
  FileEdit, 
  PlusCircle, 
  BarChart2, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { useLeadsStore } from '../../stores/leadsStore';

const Dashboard = () => {
  const { forms } = useFormStore();
  const { leads } = useLeadsStore();
  
  const stats = [
    { 
      name: 'Total Forms', 
      value: forms.length, 
      icon: <FileEdit className="h-5 w-5 text-primary-600" />, 
      path: '/dashboard/forms' 
    },
    { 
      name: 'Total Leads', 
      value: leads.length, 
      icon: <Users className="h-5 w-5 text-accent-600" />, 
      path: '/dashboard/leads' 
    },
    { 
      name: 'Conversion Rate', 
      value: '6.05%', 
      icon: <BarChart2 className="h-5 w-5 text-secondary-600" />, 
      path: '/dashboard/analytics' 
    },
  ];

  const recentForms = forms.slice(0, 3);
  const recentLeads = leads.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link 
          to="/dashboard/forms/new" 
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusCircle className="h-5 w-5 mr-1.5" />
          New Form
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.path}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-full">
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Forms */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Forms</h2>
            <Link 
              to="/dashboard/forms" 
              className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {recentForms.length > 0 ? (
              recentForms.map((form) => (
                <div key={form.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <h3 className="font-medium text-slate-900">{form.name}</h3>
                    <p className="text-sm text-slate-500">
                      {form.steps.length} steps · Created {form.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/dashboard/analytics/${form.id}`}
                      className="p-2 text-slate-500 hover:text-primary-600 rounded hover:bg-slate-100"
                    >
                      <BarChart2 className="h-5 w-5" />
                    </Link>
                    <Link 
                      to={`/dashboard/forms/${form.id}/edit`}
                      className="p-2 text-slate-500 hover:text-primary-600 rounded hover:bg-slate-100"
                    >
                      <FileEdit className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>No forms created yet.</p>
                <Link to="/dashboard/forms/new" className="mt-2 inline-block text-primary-600 font-medium">
                  Create your first form
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
            <Link 
              to="/dashboard/leads" 
              className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-6 hover:bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-slate-900">
                      {lead.data['Full Name'] || 'Anonymous User'}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {lead.submittedAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    {lead.data['Email Address'] || 'No email provided'}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {lead.formName}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>No leads captured yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;