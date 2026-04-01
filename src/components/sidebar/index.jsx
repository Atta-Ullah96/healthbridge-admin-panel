import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Stethoscope, 
  Users, 
  Calendar, 
  FlaskConical,
  CreditCard, 
  FileText, 
  Settings,
  ShieldCheck
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/doctor", label: "Doctors", icon: Stethoscope },
    { path: "/dashboard/patient", label: "Patients", icon: Users },
    { path: "/dashboard/appointment", label: "Appointments", icon: Calendar },
    { path: "/dashboard/laboratory", label: "Laboratories", icon: FlaskConical },
    { path: "/dashboard/role-management", label: "Role Management", icon: ShieldCheck },
    { path: "/dashboard/payment", label: "Payments", icon: CreditCard },
    { path: "/dashboard/report", label: "Reports", icon: FileText },
    { path: "/dashboard/setting", label: "Settings", icon: Settings },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Logo Section */}
     

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Section (Optional) */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@healthbridge.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;