import { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  X,
  Trash2
} from 'lucide-react';
import { useLeadsStore, Lead } from '../../stores/leadsStore';
import { useFormStore } from '../../stores/formStore';

// Helper functions to extract lead information
const getLeadName = (data: Record<string, any>): string => {
  // Try various field names for name
  const nameFields = [
    'Full Name', 'full name', 'name', 'Name',
    'fullname', 'fullName', 'full_name',
    'What is your full name?', 'Your Name'
  ];

  for (const field of nameFields) {
    if (data[field] && typeof data[field] === 'string' && data[field].trim()) {
      return data[field].trim();
    }
  }

  // Try first name + last name
  const firstName = data['firstName'] || data['first_name'] || data['First Name'];
  const lastName = data['lastName'] || data['last_name'] || data['Last Name'];

  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim();
  }

  return 'Anonymous User';
};

const getLeadEmail = (data: Record<string, any>): string => {
  // Try various field names for email
  const emailFields = [
    'Email Address', 'email address', 'email', 'Email',
    'emailAddress', 'email_address', 'Email_Address',
    'What is your email?', 'Your Email', 'Contact Email'
  ];

  for (const field of emailFields) {
    if (data[field] && typeof data[field] === 'string' && data[field].includes('@')) {
      return data[field].trim();
    }
  }

  return 'No email provided';
};

const Leads = () => {
  const { leads, deleteLead } = useLeadsStore();
  const { forms } = useFormStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  const filteredLeads = leads.filter(lead => {
    // Filter by form
    if (selectedForm !== 'all' && lead.formId !== selectedForm) return false;
    
    // Search in name, email, and other data
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      
      // Search in form name
      if (lead.formName.toLowerCase().includes(searchLower)) return true;
      
      // Search in lead data
      return Object.entries(lead.data).some(([key, value]) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }
    
    return true;
  });
  
  const confirmDelete = (id: string) => {
    setShowConfirmDelete(id);
  };
  
  const handleDelete = (id: string) => {
    deleteLead(id);
    setShowConfirmDelete(null);
    if (selectedLead?.id === id) {
      setSelectedLead(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <select
              className="input-field appearance-none pr-10"
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
            >
              <option value="all">All Forms</option>
              {forms.map(form => (
                <option key={form.id} value={form.id}>{form.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium">Leads</h3>
          </div>
          
          <div className="divide-y max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <button
                  key={lead.id}
                  className={`w-full text-left p-4 hover:bg-slate-50 ${
                    selectedLead?.id === lead.id ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        {getLeadName(lead.data)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {getLeadEmail(lead.data)}
                      </div>
                      <div className="mt-1 text-xs inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {lead.formName}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(lead.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-slate-500">No leads found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Lead Details */}
        <div className="lg:col-span-2 card overflow-hidden">
          {selectedLead ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">Lead Details</h3>
                <div className="flex space-x-2">
                  <button
                    className="p-1.5 text-slate-400 hover:text-error-600 rounded-full hover:bg-slate-100"
                    onClick={() => confirmDelete(selectedLead.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
                    onClick={() => setSelectedLead(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-xs font-medium text-slate-500 uppercase">Form</h4>
                    <p className="mt-1">{selectedLead.formName}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-500 uppercase">Submitted At</h4>
                    <p className="mt-1">{new Date(selectedLead.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Form Responses</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <table className="min-w-full">
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(selectedLead.data).map(([key, value]) => (
                        <tr key={key}>
                          <td className="py-2 pr-4 text-sm font-medium text-slate-900 align-top w-1/3">{key}</td>
                          <td className="py-2 text-sm text-slate-700 break-words">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No lead selected</h3>
              <p className="text-slate-500">
                Select a lead from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-error-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-error-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">
                      Delete Lead
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500">
                        Are you sure you want to delete this lead? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error-600 text-base font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDelete(showConfirmDelete)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;