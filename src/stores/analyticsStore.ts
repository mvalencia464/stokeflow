import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StepAnalytics {
  stepId: string;
  stepName: string;
  views: number;
  completions: number;
  exits: number;
  dropOffRate: number;
}

export interface FormAnalytics {
  formId: string;
  totalViews: number;
  totalSubmissions: number;
  conversionRate: number;
  stepAnalytics: StepAnalytics[];
}

// Raw tracking events
export interface AnalyticsEvent {
  id: string;
  formId: string;
  stepId?: string;
  eventType: 'form_view' | 'step_view' | 'step_completion' | 'step_exit' | 'form_submission';
  timestamp: Date;
  sessionId: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  formAnalytics: Record<string, FormAnalytics>;

  // Event tracking methods
  trackFormView: (formId: string) => void;
  trackStepView: (formId: string, stepId: string) => void;
  trackStepCompletion: (formId: string, stepId: string) => void;
  trackStepExit: (formId: string, stepId: string) => void;
  trackFormSubmission: (formId: string) => void;

  // Analytics calculation methods
  calculateFormAnalytics: (formId: string) => FormAnalytics | null;
  getFormAnalytics: (formId: string) => FormAnalytics | null;
  refreshAllAnalytics: () => void;
}

// Generate a session ID for tracking user sessions
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      events: [],
      formAnalytics: {}, // Real analytics will be calculated from events

      trackFormView: (formId) => {
        const event: AnalyticsEvent = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          formId,
          eventType: 'form_view',
          timestamp: new Date(),
          sessionId: getSessionId(),
        };

        set(state => ({
          events: [...state.events, event]
        }));

        // Recalculate analytics for this form
        get().calculateFormAnalytics(formId);
      },

      trackStepView: (formId, stepId) => {
        const event: AnalyticsEvent = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          formId,
          stepId,
          eventType: 'step_view',
          timestamp: new Date(),
          sessionId: getSessionId(),
        };

        set(state => ({
          events: [...state.events, event]
        }));

        // Recalculate analytics for this form
        get().calculateFormAnalytics(formId);
      },

      trackStepCompletion: (formId, stepId) => {
        const event: AnalyticsEvent = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          formId,
          stepId,
          eventType: 'step_completion',
          timestamp: new Date(),
          sessionId: getSessionId(),
        };

        set(state => ({
          events: [...state.events, event]
        }));

        // Recalculate analytics for this form
        get().calculateFormAnalytics(formId);
      },

      trackStepExit: (formId, stepId) => {
        const event: AnalyticsEvent = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          formId,
          stepId,
          eventType: 'step_exit',
          timestamp: new Date(),
          sessionId: getSessionId(),
        };

        set(state => ({
          events: [...state.events, event]
        }));

        // Recalculate analytics for this form
        get().calculateFormAnalytics(formId);
      },

      trackFormSubmission: (formId) => {
        const event: AnalyticsEvent = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          formId,
          eventType: 'form_submission',
          timestamp: new Date(),
          sessionId: getSessionId(),
        };

        set(state => ({
          events: [...state.events, event]
        }));

        // Recalculate analytics for this form
        get().calculateFormAnalytics(formId);
      },

      calculateFormAnalytics: (formId) => {
        const { events } = get();
        const formEvents = events.filter(e => e.formId === formId);

        if (formEvents.length === 0) {
          return null;
        }

        // Get form structure from localStorage to avoid circular dependency
        const formsStorage = localStorage.getItem('forms-storage');
        let form = null;
        if (formsStorage) {
          try {
            const parsedStorage = JSON.parse(formsStorage);
            form = parsedStorage.state?.forms?.find((f: any) => f.id === formId);
          } catch (error) {
            console.error('Error parsing forms storage:', error);
            return null;
          }
        }

        if (!form) return null;

        // Calculate total form views (unique sessions)
        const formViewSessions = new Set(
          formEvents
            .filter(e => e.eventType === 'form_view')
            .map(e => e.sessionId)
        );
        const totalViews = formViewSessions.size;

        // Calculate total submissions (unique sessions)
        const submissionSessions = new Set(
          formEvents
            .filter(e => e.eventType === 'form_submission')
            .map(e => e.sessionId)
        );
        const totalSubmissions = submissionSessions.size;

        // Calculate conversion rate
        const conversionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

        // Calculate step analytics
        const stepAnalytics: StepAnalytics[] = form.steps.map((step, stepIndex) => {
          const stepEvents = formEvents.filter(e => e.stepId === step.id);

          // Step views (unique sessions that viewed this step)
          const stepViewSessions = new Set(
            stepEvents
              .filter(e => e.eventType === 'step_view')
              .map(e => e.sessionId)
          );
          const views = stepViewSessions.size;

          // Step completions (unique sessions that completed this step)
          const stepCompletionSessions = new Set(
            stepEvents
              .filter(e => e.eventType === 'step_completion')
              .map(e => e.sessionId)
          );
          const completions = stepCompletionSessions.size;

          // Calculate exits: people who viewed this step but didn't proceed to the next step
          let exits = 0;

          if (stepIndex < form.steps.length - 1) {
            // For non-final steps: exits = views - people who viewed the next step
            const nextStep = form.steps[stepIndex + 1];
            const nextStepEvents = formEvents.filter(e => e.stepId === nextStep.id);
            const nextStepViewSessions = new Set(
              nextStepEvents
                .filter(e => e.eventType === 'step_view')
                .map(e => e.sessionId)
            );

            // People who viewed this step but didn't view the next step
            exits = views - nextStepViewSessions.size;
          } else {
            // For the final step: exits = views - form submissions
            exits = views - totalSubmissions;
          }

          // Calculate drop-off rate: exits / views
          const dropOffRate = views > 0 ? (exits / views) * 100 : 0;

          return {
            stepId: step.id,
            stepName: step.title,
            views,
            completions,
            exits: Math.max(0, exits), // Ensure exits is never negative
            dropOffRate: Math.round(dropOffRate * 100) / 100, // Round to 2 decimal places
          };
        });

        const analytics: FormAnalytics = {
          formId,
          totalViews,
          totalSubmissions,
          conversionRate: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
          stepAnalytics,
        };

        // Update the analytics in state
        set(state => ({
          formAnalytics: {
            ...state.formAnalytics,
            [formId]: analytics,
          }
        }));

        return analytics;
      },

      getFormAnalytics: (formId) => {
        const analytics = get().formAnalytics[formId];
        if (!analytics) {
          // Try to calculate analytics if not cached
          return get().calculateFormAnalytics(formId);
        }
        return analytics;
      },

      refreshAllAnalytics: () => {
        const { events } = get();
        const formIds = new Set(events.map(e => e.formId));

        formIds.forEach(formId => {
          get().calculateFormAnalytics(formId);
        });
      },
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({
        events: state.events,
        formAnalytics: state.formAnalytics
      }),
      onRehydrateStorage: () => (state) => {
        // Convert string dates back to Date objects when loading from localStorage
        if (state?.events) {
          state.events = state.events.map(event => ({
            ...event,
            timestamp: new Date(event.timestamp)
          }));
        }
        // Refresh analytics after rehydration
        setTimeout(() => {
          state?.refreshAllAnalytics?.();
        }, 100);
      },
    }
  )
);