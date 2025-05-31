import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Mail, Key, CreditCard, Bell, Link, X } from 'lucide-react';
import { useIntegrationStore } from '../../stores/integrationStore';
import { HighLevelConfig } from '../../components/integrations/HighLevelConfig';

const Settings = () => {
  const { user, updateProfile } = useAuthStore();
  const { highlevel } = useIntegrationStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showHighLevelConfig, setShowHighLevelConfig] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    company: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
    updateProfile({
      name: fullName,
      email: profileData.email
    });
    alert('Profile updated successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'account', label: 'Account', icon: <Mail className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Key className="h-5 w-5" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'integrations', label: 'Integrations', icon: <Link className="h-5 w-5" /> },
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      
      <div className="flex border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px flex items-center ${
              activeTab === tab.id 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="card p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">Profile Information</h2>
            <p className="text-sm text-slate-500">
              Update your account profile information and profile picture.
            </p>
            
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="mb-6 md:mb-0">
                <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
                <button className="mt-3 text-sm text-primary-600 font-medium">
                  Change Avatar
                </button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="input-field"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="input-field"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-field"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="form-label">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="input-field"
                    value={profileData.company}
                    onChange={handleProfileChange}
                    placeholder="Your company name"
                  />
                </div>

                <div className="pt-2">
                  <button className="btn-primary" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">Change Password</h2>
            <p className="text-sm text-slate-500">
              Ensure your account is using a strong password for security.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="input-field"
                />
              </div>
              
              <div className="pt-2">
                <button className="btn-primary">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">Billing Information</h2>
            <p className="text-sm text-slate-500">
              Manage your subscription plan and payment methods.
            </p>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-primary-800">Free Plan</h3>
                  <p className="text-sm text-primary-600">Limited to 3 forms and 100 responses per month.</p>
                </div>
                <button className="btn-primary">
                  Upgrade Plan
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg divide-y">
              <div className="p-4">
                <h3 className="font-medium mb-2">Payment Methods</h3>
                <p className="text-sm text-slate-500">No payment methods added yet.</p>
                <button className="mt-2 text-sm text-primary-600 font-medium">
                  Add Payment Method
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-2">Billing History</h3>
                <p className="text-sm text-slate-500">No billing history available.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">Notification Settings</h2>
            <p className="text-sm text-slate-500">
              Manage how you receive notifications and alerts from LeadFlow.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-slate-500">Receive email notifications for new leads and form submissions.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="emailToggle" 
                    className="sr-only"
                    defaultChecked
                  />
                  <label 
                    htmlFor="emailToggle" 
                    className="block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"
                  >
                    <span 
                      className="block h-6 w-6 rounded-full bg-white border border-slate-200 transform transition-transform duration-200 ease-in translate-x-0 checked:translate-x-4"
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Weekly Reports</h3>
                  <p className="text-sm text-slate-500">Receive weekly summary reports of form performance.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="reportsToggle" 
                    className="sr-only"
                  />
                  <label 
                    htmlFor="reportsToggle" 
                    className="block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"
                  >
                    <span 
                      className="block h-6 w-6 rounded-full bg-white border border-slate-200 transform transition-transform duration-200 ease-in translate-x-0 checked:translate-x-4"
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Marketing Updates</h3>
                  <p className="text-sm text-slate-500">Receive news about feature updates and promotions.</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="marketingToggle" 
                    className="sr-only"
                  />
                  <label 
                    htmlFor="marketingToggle" 
                    className="block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"
                  >
                    <span 
                      className="block h-6 w-6 rounded-full bg-white border border-slate-200 transform transition-transform duration-200 ease-in translate-x-0 checked:translate-x-4"
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="pt-2">
                <button className="btn-primary">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'account' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">Account Settings</h2>
            <p className="text-sm text-slate-500">
              Manage your account settings and preferences.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="form-label">Language</label>
                <select id="language" className="input-field">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timezone" className="form-label">Timezone</label>
                <select id="timezone" className="input-field">
                  <option value="utc">UTC (GMT+0)</option>
                  <option value="est">Eastern Time (GMT-5)</option>
                  <option value="pst">Pacific Time (GMT-8)</option>
                  <option value="cet">Central European Time (GMT+1)</option>
                </select>
              </div>
              
              <div className="pt-4 border-t mt-6">
                <h3 className="text-base font-medium text-slate-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <button className="px-4 py-2 border border-error-300 text-error-700 bg-error-50 hover:bg-error-100 rounded-md text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-slate-900">Integrations</h2>
            <p className="text-sm text-slate-500">
              Connect LeadFlow with your favorite tools and services.
            </p>
            
            <div className="border rounded-lg divide-y">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium text-slate-900">HighLevel (GoHighLevel)</h3>
                    <p className="text-sm text-slate-500">
                      Automatically sync leads to your HighLevel CRM
                    </p>
                  </div>
                  <button 
                    className={`${
                      highlevel.enabled 
                        ? 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                        : 'btn-primary'
                    } px-4 py-2 rounded-lg text-sm font-medium`}
                    onClick={() => setShowHighLevelConfig(true)}
                  >
                    {highlevel.enabled ? 'Configured' : 'Configure'}
                  </button>
                </div>
                {highlevel.enabled && (
                  <div className="mt-4 bg-slate-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Location ID:</span>
                        <span className="font-mono text-slate-800">{highlevel.locationId}</span>
                      </div>
                      {highlevel.defaultWorkflowId && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Default Workflow:</span>
                          <span className="font-mono text-slate-800">{highlevel.defaultWorkflowId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HighLevel Configuration Modal */}
      {showHighLevelConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-slate-900">Configure HighLevel</h2>
              <button 
                onClick={() => setShowHighLevelConfig(false)}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <HighLevelConfig onClose={() => setShowHighLevelConfig(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;