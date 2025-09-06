import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/NavBar";
import Sidebar from "../components/shared/SideBar";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = isSidebarOpen ? 250 : 85;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      {/* Navbar - uses same toggle and state */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Content */}
      <div className="flex flex-1 overflow-hidden mt-3">
        {/* Sidebar */}
        <div
          className="transition-all duration-300"
          style={{ width: `${sidebarWidth}px` }}
        >
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* Main Page */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
