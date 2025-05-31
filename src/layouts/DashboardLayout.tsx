import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  FileEdit, 
  BarChart2, 
  Users, 
  Settings as SettingsIcon,
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Forms', path: '/dashboard/forms', icon: <FileEdit className="h-5 w-5" /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Leads', path: '/dashboard/leads', icon: <Users className="h-5 w-5" /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:z-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-semibold text-slate-900">LeadFlow</span>
          </Link>
          <button 
            className="ml-auto md:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={`${isActive ? 'text-primary-600' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-700" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex-shrink-0 p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="h-16 px-4 flex items-center">
            <button 
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;