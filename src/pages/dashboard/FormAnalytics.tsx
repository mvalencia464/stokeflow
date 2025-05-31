import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BarChart2, 
  ArrowLeft, 
  ChevronDown, 
  Calendar,
  Download 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useFormStore } from '../../stores/formStore';
import { useAnalyticsStore, StepAnalytics } from '../../stores/analyticsStore';

const FormAnalytics = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getForm } = useFormStore();
  const { getFormAnalytics } = useAnalyticsStore();
  
  const form = formId ? getForm(formId) : null;
  const analytics = formId ? getFormAnalytics(formId) : null;
  
  const [dateRange, setDateRange] = useState('last30Days');
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  
  const dateRangeOptions = [
    { value: 'last7Days', label: 'Last 7 days' },
    { value: 'last30Days', label: 'Last 30 days' },
    { value: 'lastQuarter', label: 'Last quarter' },
    { value: 'lastYear', label: 'Last year' },
  ];

  useEffect(() => {
    if (!form || !formId) {
      // Redirect or show error
    }
  }, [form, formId]);

  if (!form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <BarChart2 className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-slate-900">Form not found</h3>
          <p className="text-slate-500 mb-4">The form you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/dashboard/analytics" className="btn-primary">
            Back to Analytics
          </Link>
        </div>
      </div>
    );
  }

  // If form exists but no analytics data yet, show empty state
  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard/analytics" className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{form.name} Analytics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-500">Total Views</h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">0</p>
            <div className="mt-1 text-sm text-slate-500">
              Users who viewed the form
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-500">Submissions</h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">0</p>
            <div className="mt-1 text-sm text-slate-500">
              Completed form submissions
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-slate-500">Conversion Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">0%</p>
            <div className="mt-1 text-sm text-slate-500">
              Percentage of views that convert
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-8 text-center">
            <BarChart2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Analytics Data Yet</h3>
            <p className="text-slate-500 mb-6">
              This form hasn't received any views or submissions yet. Share your form to start collecting analytics data.
            </p>
            <div className="flex justify-center space-x-3">
              <Link
                to={`/form/${formId}`}
                target="_blank"
                className="btn-primary"
              >
                Preview Form
              </Link>
              <Link
                to={`/dashboard/forms/${formId}/embed`}
                className="btn-secondary"
              >
                Get Embed Code
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDateRangeLabel = () => {
    return dateRangeOptions.find(option => option.value === dateRange)?.label || 'Select date range';
  };

  const chartData = analytics.stepAnalytics.map((step) => ({
    name: step.stepName,
    dropOffRate: step.dropOffRate,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link to="/dashboard/analytics" className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{form.name} Analytics</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="relative">
          <button 
            className="btn-secondary"
            onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {getDateRangeLabel()}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          
          {showDateRangeDropdown && (
            <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-lg border border-slate-200 py-1">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    dateRange === option.value ? 'font-medium text-primary-600 bg-primary-50' : 'text-slate-700'
                  }`}
                  onClick={() => {
                    setDateRange(option.value);
                    setShowDateRangeDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button className="btn-secondary">
          <Download className="h-4 w-4 mr-2" />
          Export data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-slate-500">Total Views</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{analytics.totalViews}</p>
          <div className="mt-1 text-sm text-slate-500">
            Users who viewed the form
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-sm font-medium text-slate-500">Submissions</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{analytics.totalSubmissions}</p>
          <div className="mt-1 text-sm text-slate-500">
            Completed form submissions
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-sm font-medium text-slate-500">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{analytics.conversionRate}%</p>
          <div className="mt-1 text-sm text-slate-500">
            Percentage of views that convert
          </div>
        </div>
      </div>

      {/* Step Funnel Analysis - Matching the reference design */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-slate-900">Step Funnel Analysis</h3>
          <p className="text-sm text-slate-500">Track user progression through each step of your form</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-slate-600 w-12">
                  #
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Screens
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                  Screen views
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                  Exits
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                  Drop-off rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {analytics.stepAnalytics.map((step: StepAnalytics, index: number) => {
                const isHighDropOff = step.dropOffRate > 40;
                const isMediumDropOff = step.dropOffRate > 20 && step.dropOffRate <= 40;

                return (
                  <tr
                    key={step.stepId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isHighDropOff ? 'bg-red-50 border-l-4 border-red-400' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {step.stepName || `Step ${index + 1}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {step.stepId.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-slate-900">
                        {step.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-slate-900">
                        {step.exits.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span
                          className={`text-sm font-semibold ${
                            isHighDropOff
                              ? 'text-red-600'
                              : isMediumDropOff
                                ? 'text-amber-600'
                                : 'text-slate-900'
                          }`}
                        >
                          {step.dropOffRate}%
                        </span>
                        {isHighDropOff && (
                          <span className="text-red-500 text-lg">⚠️</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Funnel Chart */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-slate-900">Drop-off Visualization</h3>
          <p className="text-sm text-slate-500">Visual representation of user drop-off at each step</p>
        </div>

        <div className="p-5">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Drop-off Rate']}
                  labelStyle={{ fontWeight: 'bold' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}
                />
                <Bar dataKey="dropOffRate" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.dropOffRate > 40 ? '#EF4444' : entry.dropOffRate > 20 ? '#F59E0B' : '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAnalytics;