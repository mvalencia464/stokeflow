import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { useIntegrationStore } from './integrationStore';

export interface Lead {
  id: string;
  formId: string;
  formName: string;
  submittedAt: Date;
  data: Record<string, any>;
}

interface LeadsState {
  leads: Lead[];
  getLeads: (formId?: string) => Lead[];
  getLead: (id: string) => Lead | null;
  addLead: (formId: string, formName: string, data: Record<string, any>) => Promise<void>;
  deleteLead: (id: string) => void;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set, get) => ({
      leads: [],

      getLeads: (formId) => {
        return formId
          ? get().leads.filter(lead => lead.formId === formId)
          : get().leads;
      },

      getLead: (id) => {
        return get().leads.find(lead => lead.id === id) || null;
      },

      addLead: async (formId, formName, data) => {
        const newLead: Lead = {
          id: uuidv4(),
          formId,
          formName,
          submittedAt: new Date(),
          data
        };

        set(state => ({
          leads: [newLead, ...state.leads]
        }));

        // Sync to HighLevel if integration is enabled
        console.log('🔄 Attempting to sync lead to HighLevel...');
        try {
          await useIntegrationStore.getState().syncLeadToHighLevel(data);
          console.log('✅ HighLevel sync completed successfully');
        } catch (error) {
          console.error('❌ Failed to sync lead to HighLevel:', error);
          // Continue with local lead storage even if HighLevel sync fails
        }
      },

      deleteLead: (id) => {
        set(state => ({
          leads: state.leads.filter(lead => lead.id !== id)
        }));
      }
    }),
    {
      name: 'leads-storage', // localStorage key
      partialize: (state) => ({ leads: state.leads }), // Only persist leads array
      onRehydrateStorage: () => (state) => {
        // Convert string dates back to Date objects when loading from localStorage
        if (state?.leads) {
          state.leads = state.leads.map(lead => ({
            ...lead,
            submittedAt: new Date(lead.submittedAt)
          }));
        }
      },
    }
  )
);