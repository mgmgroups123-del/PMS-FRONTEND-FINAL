import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import Profileicon from "../../assets/profileicon.png";
import pmsicon from "../../assets/MGM_Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { selectNotification, selectUnreadCount } from "../../features/notification/redecures/selectors";
import { selectProfile } from "../../features/settings/reducers/selectors";
import { getProfileThunk } from "../../features/settings/reducers/thunks";
import { Input } from "../ui/input";
import { Globalsearchservice } from "../../features/Dashboard/Services";
import socket from "../../context/socketContext";
import { addNotification, markAsRead } from "../../features/notification/redecures/slice";
import type { Notification } from "../../features/notification/redecures/notifyType";
import { getImageUrl } from "../../utils/getImage";


export default function Navbar({ isSidebarOpen, toggleSidebar }: any) {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notifications: Notification[] = useSelector(selectNotification) || [];
  const unReadCount = useSelector(selectUnreadCount)

  // Calculate unread count
  // const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const profileData = useSelector(selectProfile);
  // Fetch profile data
  useEffect(() => {
    dispatch(getProfileThunk() as any);
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewNotification = () => {
    notifications.forEach((n: any) => {
      if (!n.is_read) {
        dispatch(markAsRead(n._id));
      }
    });
    setShowNotificationDropdown(false);
    navigate("/notifications");
  };

  const handleViewProfile = () => {
    navigate("/settings/account");
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) { // only search after 3 chars
      const res = await Globalsearchservice({ query: value })
      console.log(res, "Response Search")
      setResults(res);
    } else {
      setResults(null);
    }
  };

  const handleSelect = (type: string, _id: any) => {
    const paths: Record<string, string> = {
      lands: `/lands`,
      tenants: `/tenants`,
      properties: `/properties`,
      leases: `/leases`,
    };

    if (paths[type]) {
      navigate(paths[type]);
      setQuery("");
      setResults(null);
    }
  };

  useEffect(() => {
    socket.on("newNotification", (data: Notification) => {
      const transformed = {
        _id: data._id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt || new Date().toISOString(),
        is_read: false,
        notify_type: data.notify_type
      };
      dispatch(addNotification(transformed));
    });

    return () => {
      socket.off("newNotification");
    };
  }, [dispatch]);



  return (
    <div className="flex w-full gap-5">
      {/* Left: Logo + Name */}
      <div
        className={`flex items-center justify-center h-[80px] bg-white shadow-md rounded-br-xl rounded-bl-xl  ${isSidebarOpen ? "px-4" : "px-2"} cursor-pointer transition-all duration-300`}
        style={{ width: isSidebarOpen ? "250px" : "80px" }}
        onClick={toggleSidebar}
      >
        <img
          className="object-fit w-[250px]"
          src={pmsicon}
          alt="logo"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {/* Right: Search + Notification + Profile */}
      <div className="flex items-center justify-between h-[80px] flex-1 bg-white shadow-xl px-6 rounded-br-xl rounded-bl-xl">
        {/* Search */}
        <div className="relative w-[400px]">
          <FiSearch className="absolute left-3 top-[25px] -translate-y-1/2 h-4 w-4 text-black" />
          <Input
            type="text"
            placeholder="Search or type"
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {results && (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded max-h-60 overflow-y-auto z-50">
              {Object.entries(results).map(([key, items]: any) =>
                items.length > 0 && (
                  <div key={key} className="p-2 border-b">
                    <p className="text-gray-500 font-semibold capitalize">{key}</p>
                    {items.map((item: any) => (
                      <div
                        key={item._id}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(key, item._id)}
                      >
                        {item?.personal_information?.full_name || item?.property_name || item?.land_name}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Notification + Profile */}
        <div className="flex items-center gap-6">
          <div className="relative" ref={notificationRef}>
            <div
              className="h-10 w-10 flex items-center justify-center rounded-full bg-[#ed3237] hover:bg-red-700 text-white cursor-pointer  transition-colors relative"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            >
              <FaRegBell className="h-[20px] w-[20px]" />
              {unReadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ffff] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unReadCount}
                </span>
              )}
            </div>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-[300px] bg-white rounded-md shadow-lg z-20 p-4">
                <h3 className="font-semibold text-sm mb-2">Recent Notifications</h3>
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    [...notifications]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      )
                      .slice(0, 3)
                      .map((item: Notification, i) => (
                        <div key={item._id || i} className="border-b pb-2">
                          <div className="text-sm font-medium">
                            {item.title || "No Title"}
                          </div>
                          <p className="text-xs text-gray-600">
                            {item.description || ""}
                          </p>
                          <div className="text-[10px] text-gray-400">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : ""}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-gray-500">No notifications found</p>
                  )}
                </div>
                <p
                  onClick={handleViewNotification}
                  className="cursor-pointer block mt-4 text-center text-[#68B39F] text-sm font-medium"
                >
                  View All
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-10 border border-[#ed3237]"></div>

          {/* Profile */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleViewProfile}
            ref={profileRef}
          >
            <div className="h-[48px] w-[48px] rounded-full overflow-hidden">
              <img
                src={getImageUrl(profileData?.image)}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-[18px] font-semibold">
                {profileData?.first_name} {profileData?.last_name}
              </p>
              <p className="text-[#7D7D7D] text-[14px]">{profileData?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
