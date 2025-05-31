import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useFormStore } from '../../stores/formStore';

const AnalyticsTest = () => {
  const { events, formAnalytics, refreshAllAnalytics, trackFormView, trackStepView, trackStepCompletion, trackStepExit, trackFormSubmission } = useAnalyticsStore();
  const { forms } = useFormStore();

  const handleRefresh = () => {
    refreshAllAnalytics();
  };

  const handleClearData = () => {
    localStorage.removeItem('analytics-storage');
    window.location.reload();
  };

  const generateSampleData = () => {
    if (!forms.length) {
      alert('No forms available. Please create a form first.');
      return;
    }

    const form = forms[0]; // Use the first form

    // Create a realistic funnel based on the reference image
    // Starting with 584 users, with specific numbers for each step
    const funnelData = [
      { views: 584, continues: 253 }, // Step 1: 584 views, 331 exit (57% drop-off)
      { views: 253, continues: 225 }, // Step 2: 253 views, 28 exit (11% drop-off)
      { views: 225, continues: 207 }, // Step 3: 225 views, 19 exit (8% drop-off)
      { views: 207, continues: 148 }, // Step 4: 207 views, 58 exit (28% drop-off)
      { views: 148, continues: 148 }, // Step 5: 148 views, 0 exit (0% drop-off)
      { views: 148, continues: 114 }, // Step 6: 148 views, 34 exit (23% drop-off)
      { views: 114, continues: 98 },  // Step 7: 114 views, 16 exit (14% drop-off)
      { views: 98, continues: 52 },   // Step 8: 98 views, 46 exit (47% drop-off)
      { views: 52, continues: 0 }     // Step 9: 52 views, 52 exit (100% drop-off - thank you page)
    ];

    // Generate sessions for each step
    let sessionCounter = 0;

    for (let stepIndex = 0; stepIndex < Math.min(form.steps.length, funnelData.length); stepIndex++) {
      const stepData = funnelData[stepIndex];
      const step = form.steps[stepIndex];

      // Create sessions for users who view this step
      for (let i = 0; i < stepData.views; i++) {
        const sessionId = `session_${sessionCounter++}_${Date.now()}`;

        // Track form view (only for first step)
        if (stepIndex === 0) {
          trackFormView(form.id);
        }

        // Track step view
        trackStepView(form.id, step.id);

        // Determine if this user continues to next step
        const continues = i < stepData.continues;

        if (continues) {
          // User completes this step
          trackStepCompletion(form.id, step.id);

          // If this is the last step, mark as form submission
          if (stepIndex === form.steps.length - 1) {
            trackFormSubmission(form.id);
          }
        }
        // Note: We don't track explicit exits anymore since they're calculated
      }
    }

    alert(`Generated realistic funnel data matching the reference image!\n\nStep 1: 584 views → 331 exits (57% drop-off)\nStep 2: 253 views → 28 exits (11% drop-off)\nAnd so on...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Analytics Test Dashboard</h1>
        <div className="space-x-2">
          <button onClick={generateSampleData} className="btn-primary">
            Generate Sample Data
          </button>
          <button onClick={handleRefresh} className="btn-secondary">
            Refresh Analytics
          </button>
          <button onClick={handleClearData} className="btn-secondary text-red-600">
            Clear All Data
          </button>
        </div>
      </div>

      {/* Raw Events */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Raw Analytics Events ({events.length})</h2>
        </div>
        <div className="p-4">
          {events.length === 0 ? (
            <p className="text-slate-500">No events tracked yet. Visit a form to start tracking!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.slice(-10).reverse().map(event => (
                <div key={event.id} className="text-xs bg-slate-50 p-2 rounded">
                  <div className="font-mono">
                    <span className="font-semibold">{event.eventType}</span> | 
                    Form: {event.formId} | 
                    {event.stepId && `Step: ${event.stepId} | `}
                    Session: {event.sessionId.slice(-8)} | 
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {events.length > 10 && (
                <p className="text-xs text-slate-400">Showing last 10 events of {events.length} total</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calculated Analytics */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Calculated Analytics</h2>
        </div>
        <div className="p-4">
          {Object.keys(formAnalytics).length === 0 ? (
            <p className="text-slate-500">No analytics calculated yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.values(formAnalytics).map(analytics => {
                const form = forms.find(f => f.id === analytics.formId);
                return (
                  <div key={analytics.formId} className="border rounded p-4">
                    <h3 className="font-semibold mb-2">
                      {form?.name || analytics.formId}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-500">Views</div>
                        <div className="text-xl font-semibold">{analytics.totalViews}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Submissions</div>
                        <div className="text-xl font-semibold">{analytics.totalSubmissions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Conversion Rate</div>
                        <div className="text-xl font-semibold">{analytics.conversionRate}%</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Step Analytics:</h4>
                      {analytics.stepAnalytics.map(step => (
                        <div key={step.stepId} className="text-sm bg-slate-50 p-2 rounded">
                          <div className="font-medium">{step.stepName}</div>
                          <div className="text-slate-600">
                            Views: {step.views} | 
                            Completions: {step.completions} | 
                            Exits: {step.exits} | 
                            Drop-off: {step.dropOffRate}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">How to Test Real Analytics</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open the form preview: <a href="/form/test-highlevel" className="text-blue-600 underline" target="_blank">/form/test-highlevel</a></li>
            <li>Navigate through the form steps (this tracks step views and completions)</li>
            <li>Submit the form (this tracks form submission)</li>
            <li>Come back to this page and click "Refresh Analytics" to see the data</li>
            <li>Check the main Analytics page to see the real data in the dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTest;
