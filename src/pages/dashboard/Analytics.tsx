import { Link } from 'react-router-dom';
import { BarChart2, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useFormStore } from '../../stores/formStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';

const Analytics = () => {
  const { forms } = useFormStore();
  const { formAnalytics } = useAnalyticsStore();
  
  const sortedForms = [...forms].sort((a, b) => {
    const aAnalytics = formAnalytics[a.id];
    const bAnalytics = formAnalytics[b.id];
    
    // Sort by conversion rate if analytics exist for both forms
    if (aAnalytics && bAnalytics) {
      return bAnalytics.conversionRate - aAnalytics.conversionRate;
    }
    
    // Put forms with analytics first
    if (aAnalytics && !bAnalytics) return -1;
    if (!aAnalytics && bAnalytics) return 1;
    
    // Otherwise sort by updated date
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
  
  // Calculate overall stats
  const totalViews = Object.values(formAnalytics).reduce((sum, analytics) => sum + analytics.totalViews, 0);
  const totalSubmissions = Object.values(formAnalytics).reduce((sum, analytics) => sum + analytics.totalSubmissions, 0);
  const overallConversionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-slate-500">Total Form Views</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalViews}</p>
          <div className="mt-1 text-sm text-slate-500">
            Across all forms
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-sm font-medium text-slate-500">Total Submissions</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalSubmissions}</p>
          <div className="mt-1 text-sm text-slate-500">
            Completed forms
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-sm font-medium text-slate-500">Overall Conversion</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{overallConversionRate.toFixed(2)}%</p>
          <div className="mt-1 text-sm text-slate-500">
            Average across all forms
          </div>
        </div>
      </div>
      
      {/* Form Performance Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-slate-900">Form Performance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Highest Drop-off
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedForms.map(form => {
                const analytics = formAnalytics[form.id];
                
                // Find the step with the highest drop-off rate
                let highestDropOff = { stepName: 'N/A', dropOffRate: 0 };
                if (analytics?.stepAnalytics) {
                  highestDropOff = analytics.stepAnalytics.reduce(
                    (max, step) => step.dropOffRate > max.dropOffRate ? { stepName: step.stepName, dropOffRate: step.dropOffRate } : max,
                    { stepName: '', dropOffRate: 0 }
                  );
                }
                
                return (
                  <tr key={form.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{form.name}</div>
                      <div className="text-xs text-slate-500">{form.steps.length} steps</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {analytics?.totalViews || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {analytics?.totalSubmissions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analytics ? (
                        <div className="flex items-center">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              analytics.conversionRate > 10 
                                ? 'bg-accent-100 text-accent-800' 
                                : analytics.conversionRate > 5 
                                  ? 'bg-primary-100 text-primary-800' 
                                  : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {analytics.conversionRate > 0 ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            )}
                            {analytics.conversionRate.toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analytics ? (
                        <div>
                          <span 
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              highestDropOff.dropOffRate > 50 
                                ? 'bg-error-100 text-error-800' 
                                : highestDropOff.dropOffRate > 30 
                                  ? 'bg-warning-100 text-warning-800' 
                                  : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {highestDropOff.stepName}: {highestDropOff.dropOffRate}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/dashboard/analytics/${form.id}`}
                        className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                      >
                        View Details
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {sortedForms.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <BarChart2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="text-base font-medium text-slate-900 mb-1">No forms found</h3>
                    <p className="text-sm text-slate-500 mb-4">Create a form to start collecting analytics</p>
                    <Link to="/dashboard/forms/new" className="btn-primary inline-flex">
                      Create your first form
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;