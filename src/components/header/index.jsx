import { useState } from "react";
import { Bell, Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAdminLogoutMutation } from "../../api/auth";
import { adminLogout } from "../../slice/authslice";


const Header = () => {

  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const admin = {
  name: "attaullah",
  email:"attaullah@gmail.com"
}
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi, { isLoading }] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();

      // 🔥 Clear Redux state
      dispatch(adminLogout());

      // 🔁 Redirect to home
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      alert("Failed to logout. Please try again.");
    }
  };


  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">HealthBridge</h1>
          </div>


        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">




          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfile && (
              <div className="cursor-pointer absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                <div className=" px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">{admin?.email}</p>
                </div>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <a onClick={handleLogout} className="cursor-pointer block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>


    </header>
  );
};

export default Header;