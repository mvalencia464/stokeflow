import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileEdit,
  PlusCircle,
  Trash2,
  Link as LinkIcon,
  BarChart2,
  Search,
  MoreVertical,
  Copy,
  Sparkles
} from 'lucide-react';
import { useFormStore, Form } from '../../stores/formStore';

const FormsList = () => {
  const navigate = useNavigate();
  const { forms, deleteForm, duplicateForm } = useFormStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const confirmDelete = (id: string) => {
    setShowConfirmDelete(id);
  };
  
  const handleDelete = (id: string) => {
    deleteForm(id);
    setShowConfirmDelete(null);
  };

  const handleDuplicate = (id: string) => {
    const newFormId = duplicateForm(id);
    if (newFormId) {
      navigate(`/dashboard/forms/${newFormId}/edit`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-bold text-slate-900">Forms</h1>
        <div className="flex space-x-3">
          <Link to="/dashboard/forms/templates" className="btn-secondary">
            <Sparkles className="h-5 w-5 mr-1.5" />
            Browse Templates
          </Link>
          <Link to="/dashboard/forms/new" className="btn-primary">
            <PlusCircle className="h-5 w-5 mr-1.5" />
            New Form
          </Link>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="card overflow-hidden">
        {filteredForms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Steps
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredForms.map((form: Form) => (
                  <tr key={form.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{form.name}</div>
                      <div className="text-sm text-slate-500">{form.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{form.steps.length} steps</div>
                      <div className="text-sm text-slate-500">
                        {form.steps.reduce((total, step) => total + step.questions.length, 0)} questions
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {form.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {form.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-1 justify-end">
                        <Link 
                          to={`/dashboard/forms/${form.id}/edit`}
                          className="p-2 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-100"
                          title="Edit Form"
                        >
                          <FileEdit className="h-5 w-5" />
                        </Link>
                        <Link 
                          to={`/dashboard/analytics/${form.id}`}
                          className="p-2 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-100"
                          title="View Analytics"
                        >
                          <BarChart2 className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/dashboard/forms/${form.id}/embed`}
                          className="p-2 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-100"
                          title="Embed Form"
                        >
                          <LinkIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(form.id)}
                          className="p-2 text-slate-500 hover:text-primary-600 rounded-full hover:bg-slate-100"
                          title="Duplicate Form"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(form.id)}
                          className="p-2 text-slate-500 hover:text-error-600 rounded-full hover:bg-slate-100"
                          title="Delete Form"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileEdit className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No forms found</h3>
            <p className="mt-1 text-slate-500">
              {searchQuery 
                ? `No forms matching "${searchQuery}"`
                : "You haven't created any forms yet."
              }
            </p>
            {!searchQuery && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/dashboard/forms/templates" className="inline-flex btn-secondary">
                  <Sparkles className="h-5 w-5 mr-1.5" />
                  Browse Templates
                </Link>
                <Link to="/dashboard/forms/new" className="inline-flex btn-primary">
                  <PlusCircle className="h-5 w-5 mr-1.5" />
                  Create from Scratch
                </Link>
              </div>
            )}
          </div>
        )}
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
                      Delete Form
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500">
                        Are you sure you want to delete this form? This action cannot be undone and all form data and analytics will be permanently lost.
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

export default FormsList;