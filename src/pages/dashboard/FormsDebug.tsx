import { useFormStore } from '../../stores/formStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { Link } from 'react-router-dom';

const FormsDebug = () => {
  const { forms } = useFormStore();
  const { events, formAnalytics, refreshAllAnalytics } = useAnalyticsStore();

  const handleClearStorage = () => {
    localStorage.removeItem('forms-storage');
    window.location.reload();
  };

  const handleClearAnalytics = () => {
    localStorage.removeItem('analytics-storage');
    sessionStorage.removeItem('analytics_session_id');
    window.location.reload();
  };

  const handleRefreshAnalytics = () => {
    refreshAllAnalytics();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Forms Debug</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleRefreshAnalytics}
            className="btn-secondary text-blue-600"
          >
            Refresh Analytics
          </button>
          <button
            onClick={handleClearAnalytics}
            className="btn-secondary text-orange-600"
          >
            Clear Analytics
          </button>
          <button
            onClick={handleClearStorage}
            className="btn-secondary text-red-600"
          >
            Clear Forms Storage
          </button>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Available Forms ({forms.length})</h2>
        </div>
        <div className="p-4">
          {forms.length === 0 ? (
            <p className="text-slate-500">No forms found. Try clearing storage.</p>
          ) : (
            <div className="space-y-4">
              {forms.map(form => (
                <div key={form.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{form.name}</h3>
                      <p className="text-slate-600 text-sm">{form.description}</p>
                      <div className="mt-2 text-xs text-slate-500">
                        <div>ID: {form.id}</div>
                        <div>Steps: {form.steps.length}</div>
                        <div>Created: {form.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/form/${form.id}`}
                        target="_blank"
                        className="btn-primary text-sm"
                      >
                        Preview Form
                      </Link>
                      <Link 
                        to={`/dashboard/forms/${form.id}/edit`}
                        className="btn-secondary text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="font-medium text-sm mb-2">Form Steps:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {form.steps.map((step, index) => (
                        <div key={step.id} className="text-xs bg-slate-50 p-2 rounded">
                          <div className="font-medium">Step {index + 1}: {step.title}</div>
                          <div className="text-slate-600">{step.questions.length} questions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Analytics Debug ({events.length} events)</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 p-3 rounded">
              <h3 className="font-medium text-sm mb-2">Raw Events</h3>
              <div className="text-xs text-slate-600">
                <div>Total Events: {events.length}</div>
                <div>Form Views: {events.filter(e => e.eventType === 'form_view').length}</div>
                <div>Step Views: {events.filter(e => e.eventType === 'step_view').length}</div>
                <div>Step Completions: {events.filter(e => e.eventType === 'step_completion').length}</div>
                <div>Form Submissions: {events.filter(e => e.eventType === 'form_submission').length}</div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded">
              <h3 className="font-medium text-sm mb-2">Calculated Analytics</h3>
              <div className="text-xs text-slate-600">
                <div>Forms with Analytics: {Object.keys(formAnalytics).length}</div>
                {Object.entries(formAnalytics).map(([formId, analytics]) => (
                  <div key={formId} className="mt-1">
                    <div className="font-medium">{formId.slice(0, 8)}...</div>
                    <div>Views: {analytics.totalViews}, Submissions: {analytics.totalSubmissions}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {events.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">Recent Events</h3>
              <div className="bg-slate-50 p-3 rounded text-xs max-h-40 overflow-y-auto">
                {events.slice(-10).reverse().map((event, index) => (
                  <div key={event.id} className="mb-1 pb-1 border-b border-slate-200 last:border-b-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{event.eventType}</span>
                      <span className="text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-600">
                      Form: {event.formId.slice(0, 12)}...
                      {event.stepId && ` | Step: ${event.stepId.slice(0, 8)}...`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card bg-blue-50">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Quick Access Links</h2>
          <div className="space-y-2">
            <div>
              <strong>Modern Lead Template:</strong>{' '}
              <Link 
                to="/form/modern-lead-template" 
                className="text-blue-600 underline"
                target="_blank"
              >
                /form/modern-lead-template
              </Link>
            </div>
            <div>
              <strong>HighLevel Test Form:</strong>{' '}
              <Link 
                to="/form/test-highlevel" 
                className="text-blue-600 underline"
                target="_blank"
              >
                /form/test-highlevel
              </Link>
            </div>
            <div>
              <strong>Forms List:</strong>{' '}
              <Link 
                to="/dashboard/forms" 
                className="text-blue-600 underline"
              >
                /dashboard/forms
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-yellow-50">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>If you don't see the "Modern Lead Generation Form", click "Clear Forms Storage & Reload"</li>
            <li>This will reset the forms to the default templates defined in code</li>
            <li>After reload, both forms should be available</li>
            <li>You can then access the modern template via the preview links</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FormsDebug;
