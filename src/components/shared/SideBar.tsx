import { useState } from "react";
import {
  LandPlot,
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  TrendingUp,
  BadgeIndianRupee,
  Handshake,
  MoveHorizontal,
  LogOut,
  AudioLines
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { FONTS } from "../../constants/ui constants";
import toast from "react-hot-toast";
import { ClearLocalStorage } from "../../utils/localstorage";
import { useAuth } from "../auth/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }: any) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, path: "/", label: "DashBoard" },
    { icon: LandPlot, path: "/properties", label: "Properties" },
    { icon: FileText, path: "/tenants", label: "Tenants" },
    { icon: BadgeIndianRupee, path: "/rent", label: "Rent" },
    { icon: Handshake, path: "/lease", label: "Lease " },
    { icon: AudioLines, path: "/maintenance", label: "Maintenance" },
    { icon: LandPlot, path: "/lands", label: "Land" },
    { icon: TrendingUp, path: "/reports", label: "Reports" },
    { icon: Bell, path: "/notifications", label: "Notifications" },
    { icon: Settings, path: "/settings/account", label: "Settings" },
  ];

  const navigate = useNavigate();
  const { logout } = useAuth();

  const confirmLogout = () => {
    logout();
    ClearLocalStorage();
    toast.success("Logout successful!");
    navigate("/login");
  };

  return (
    <div
      className={`bg-white shadow-xl transition-all duration-300 ease-in-out rounded-tr-xl 
        ${isOpen ? "w-64" : "w-[80px]"} flex flex-col h-full`}
    >
      {/* Toggle Button */}
      <div className="py-4 ml-3">
        <div
          className="relative group cursor-pointer flex items-center gap-3 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-12 h-12 flex items-center justify-center clip-hex 
                       bg-[#F6F6F6] text-[#ed3237] 
                       hover:bg-[#ed3237] hover:text-white 
                       transition-all duration-300"
          >
            <MoveHorizontal size={20} />
          </div>
        </div>
        <hr className="border-t border-[#ed3237] m-2" />
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 ml-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className="relative flex py-2 items-center gap-3 transition-all duration-300 px-2 border-r-[4px] border-r-white"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute -right-1 top-0 h-full w-full border-r-[4px] border-[#ed3237] rounded-r-lg" />
                  )}
                  <div
                    className={`w-12 h-12 flex items-center justify-center transition-all duration-300 clip-hex
                      ${isActive
                        ? "bg-[#ed3237] text-white"
                        : "bg-[#F6F6F6] text-gray-500 hover:bg-[#ed3237] hover:text-white"
                      }`}
                  >
                    <Icon size={20} />
                  </div>
                  {isOpen && (
                    <span
                      style={{ ...FONTS.sidebar }}
                      className="text-sm text-gray-700 whitespace-nowrap font-bold"
                    >
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Fixed Logout at Bottom */}
      <div className="p-3 ml-2 pb-2">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowLogoutModal(true)}
        >
          <div
            className="w-12 h-12 flex items-center justify-center clip-hex 
                       bg-[#f4949c] text-white 
                       hover:bg-red-700 
                       transition-all duration-300"
          >
            <LogOut size={20} />
          </div>
          {isOpen && (
            <span className="text-md font-medium text-gray-700 whitespace-nowrap">
              Logout
            </span>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] text-center">
            <h2 className="text-lg font-bold mb-2">Logout</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
