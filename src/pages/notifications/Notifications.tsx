import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  BarChart3,
  Building2,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import cancelicon from "../../assets/close-circle.png"
import cardimg1 from "../../assets/image 315.png"
import cardimg2 from "../../assets/image 315.png"
import cardimg3 from "../../assets/image 315.png"
import cardimg4 from "../../assets/image 315.png"
import { FONTS } from '../../constants/ui constants'
import { selectNotification } from "../../features/notification/redecures/selectors"
import { getNotificationAll } from "../../features/notification/redecures/thunks"
import { deleteNotification, updateStatusAllNotification, updateStatusNotification } from "../../features/notification/services"
import type { AppDispatch } from "../../store/store"
import socket from "../../context/socketContext"
import { addNotification } from "../../features/notification/redecures/slice"
import type { Notification } from "../../features/notification/redecures/notifyType"

interface NotificationItem {
  id: string
  notify_type: "rent" | "lease" | "report" | "reminder"
  title: string
  description: string
  timestamp: string
  is_read: boolean
}

const cardData = [
  {
    id: 1,
    title: "Total",
    value: "6",
    icon: Building2,
    iconBgColor: "bg-red-300",
    backgroundImage: cardimg1,
  },
  {
    id: 2,
    title: "UnRead",
    value: "4",
    icon: Building2,
    iconBgColor: "bg-orange-300",
    backgroundImage: cardimg2,
  },
  {
    id: 3,
    title: "Rent Reminders",
    value: "3",
    icon: Building2,
    iconBgColor: "bg-blue-300",
    backgroundImage: cardimg3,
  },
  {
    id: 4,
    title: "Today",
    value: "0",
    icon: Building2,
    iconBgColor: "bg-pink-300",
    backgroundImage: cardimg4,
  },
]

const rowsPerPageOptions = [5, 10, 20, 25, 50]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "rent":
      return <Home className="h-5 w-5" />
    case "lease":
      return <FileText className="h-5 w-5" />
    case "report":
      return <BarChart3 className="h-5 w-5" />
    case "reminder":
      return <Bell className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

function Notifications() {
  const dispatch: AppDispatch = useDispatch()
  const notifications = useSelector(selectNotification) || []

  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "rent" | "lease">("all")
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError(null)
        const params = {
          page: 1,
          limit: 100,
        }
        dispatch(getNotificationAll(params))
      } catch (err) {
        setError('Failed to fetch notifications')
        console.error('Error fetching notifications:', err)
      }
    }

    fetchNotifications()
  }, [dispatch])

  useEffect(() => {
    socket.on("newNotification", (data) => {
      console.log("Received Notification:", data);

      const transformed:Notification = {
        _id: data._id || data.id,
        title: data.title || "Notification",
        description: data.description || data.message || "",
        notify_type: data.notify_type || "reminder",
        createdAt: data.createdAt || new Date().toISOString(),
        is_read: false,
      };

      dispatch(addNotification(transformed));
    });

    return () => {
      socket.off("newNotification");
    };
  }, [dispatch]);


  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      const transformedNotifications = notifications.map((notification: any) => ({
        id: notification.id || notification._id,
        notify_type: notification.notify_type || "reminder",
        title: notification.title || "Notification",
        description: notification.description || notification.message || "",
        timestamp: notification.timestamp || notification.createdAt || new Date().toLocaleDateString(),
        is_read: notification.is_read || false,
      }))
      setNotificationList(transformedNotifications)
    }
  }, [notifications])

  const filteredNotifications = notificationList.filter(notification => {
    const readMatch =
      readFilter === "all" ||
      (readFilter === "read" && notification.is_read) ||
      (readFilter === "unread" && !notification.is_read)

    const typeMatch =
      typeFilter === "all" ||
      notification.notify_type === typeFilter

    return readMatch && typeMatch
  })

  const totalItems = filteredNotifications.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems)
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [rowsPerPage, readFilter, typeFilter])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
  }

  const markAsRead = async (uuid: string) => {
    try {
      await updateStatusNotification({ uuid })
      setNotificationList(prev =>
        prev.map(notification =>
          notification.id === uuid ? { ...notification, is_read: true } : notification
        )
      )
    } catch (err) {
      console.error("Error marking as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await updateStatusAllNotification()
      setNotificationList(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      )
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const deleteNotificationHandler = async (uuid: string) => {
    try {
      const res = await deleteNotification({ uuid })
      if (res) {
        setNotificationList(prev =>
          prev.filter(notification => notification.id !== uuid)
        )
      } else {
        console.error("Failed to delete notification:", res)
      }
    } catch (err) {
      console.error("Error deleting notification:", err)
    }
  }

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
  }

  const updatedCardData = cardData.map(card => {
    if (card.title === "Total") {
      return { ...card, value: notificationList.length.toString() }
    }
    if (card.title === "UnRead") {
      return { ...card, value: notificationList.filter(n => !n.is_read).length.toString() }
    }
    if (card.title === "Rent Reminders") {
      return { ...card, value: notificationList.filter(n => n.notify_type === "rent").length.toString() }
    }
    if (card.title === "Today") {
      const today = new Date().toLocaleDateString()
      return {
        ...card,
        value: notificationList.filter(n => {
          const notificationDate = new Date(n.timestamp).toLocaleDateString()
          return notificationDate === today
        }).length.toString()
      }
    }
    return card
  })

  if (error) {
    return (
      <div className="w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="text-red-600 text-lg">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl -ml-5 font-semibold text-gray-900"
            style={{ ...FONTS.headers }}
          >Notifications</h1>
          <p className="text-sm text-gray-600 -ml-5 mt-1">Stay Updated With Important Alerts And Messages</p>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700 -mr-9 text-white"
          onClick={markAllAsRead}
          disabled={notificationList.filter(n => !n.is_read).length === 0}
        >
          Mark as All Read
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {updatedCardData.map((card) => {
          const IconComponent = card.icon
          return (
            <Card key={card.id} className="relative overflow-hidden shadow-md border w-[285px] h-[130px]">
              <div
                className="absolute inset-0 bg-no-repeat bg-[length:150%] opacity-35"
                style={{
                  backgroundImage: `url('${card.backgroundImage}')`,
                  backgroundPosition:
                    card.backgroundImage === cardimg1 ? "100px 10px" :
                      card.backgroundImage === cardimg2 ? "-162px -130px" :
                        card.backgroundImage === cardimg3 ? "-340px -110px" :
                          card.backgroundImage === cardimg4 ? "-192px -150px" : "10px 10px",
                  transform:
                    card.backgroundImage === cardimg2 ? "rotate(180deg)" :
                      card.backgroundImage === cardimg3 ? "rotate(180deg)" :
                        card.backgroundImage === cardimg4 ? "rotate(180deg)" : "none",
                  backgroundSize:
                    card.backgroundImage === cardimg2 ? "110%" :
                      card.backgroundImage === cardimg3 ? "185%" :
                        card.backgroundImage === cardimg4 ? "140%" : "none",
                }}
              ></div>

              <div className="absolute inset-0 bg-white opacity-30"></div>

              <CardContent className="relative h-full -mt-5 flex flex-col justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-2 ${card.iconBgColor} rounded-lg`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700" style={{ ...FONTS.card_headers }}>{card.title}</span>
                </div>
                <div className="text-3xl font-bold mt-5 text-gray-900">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col p-6 border-b border-gray-200">
        <div className="flex items-center justify-end gap-2">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:ring-black active:ring-black">
              <Button variant="outline" className="gap-2 bg-[#ed32371A]">
                {typeFilter === "all" ? "All Types" : typeFilter === "rent" ? "Rent Reminders" : "Lease Expiry"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-transparent border shadow-none p-0 w-38 rounded-xl mt-1" align="start">
              <div className="flex flex-col gap-2 bg-white p-2">
                <DropdownMenuItem
                  className="rounded-xl border px-4 py-2 cursor-pointer hover:outline-none hover:bg-[#ed3237] hover:text-[white]"
                  onClick={() => setTypeFilter("all")}
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl border px-4 py-2 cursor-pointer hover:outline-none hover:bg-[#ed3237] hover:text-[white]"
                  onClick={() => setTypeFilter("rent")}
                >
                  Rent Reminders
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl border px-4 py-2 cursor-pointer hover:outline-none hover:bg-[#ed3237] hover:text-[white]"
                  onClick={() => setTypeFilter("lease")}
                >
                  Lease Expiry
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Read Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-white focus:ring-black active:ring-black">
              <Button variant="outline" className="gap-2 bg-[#ed32371A]">
                {readFilter === "all" ? "All" : readFilter === "read" ? "Read" : "Unread"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border rounded-xl shadow-none mt-1 w-28" align="start">
              <div className="flex flex-col gap-2 bg-transparent p-2">
                <DropdownMenuItem
                  className="rounded-xl border border-gray-200 px-4 py-2 cursor-pointer hover:outline-none hover:bg-[#ed3237] hover:text-[white]"
                  onClick={() => setReadFilter("all")}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl border border-gray-200 px-4 py-2 cursor-pointer hover:outline-none hover:bg-[#ed3237] hover:text-[white]"
                  onClick={() => setReadFilter("read")}
                >
                  Read
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl border border-gray-200 px-4 py-2 cursor-pointer hover:outline-none hover:bg-[#ed3237] hover:text-[white]"
                  onClick={() => setReadFilter("unread")}
                >
                  Unread
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200">
        {paginatedNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {notificationList.length === 0
              ? "No notifications available."
              : "No notifications found matching your filters."}
          </div>
        ) : (
          paginatedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 rounded-lg mb-4 transition-all duration-200 ${!notification.is_read
                  ? "border-2 bg-blue-50 cursor-pointer hover:bg-blue-100 shadow-md"
                  : "border border-gray-200 bg-white hover:bg-blue-100"
                }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg border shadow-sm ${!notification.is_read ? "bg-blue-100 border-blue-300" : "bg-gray-50 border-gray-200"
                    }`}
                >
                  {getNotificationIcon(notification.notify_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${!notification.is_read ? "text-gray-900" : "text-gray-500"}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                      </div>
                      <p className={`text-sm mb-2 ${!notification.is_read ? "text-gray-700" : "text-gray-500"}`}>
                        {notification.description}
                      </p>
                      <p className={`text-xs ${!notification.is_read ? "text-gray-600" : "text-gray-400"}`}>
                        {new Date(notification.timestamp).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotificationHandler(notification.id)
                        }}
                      >
                        <img src={cancelicon} className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#7D7D7D]">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-[#7D7D7D]">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${page === currentPage
                          ? "bg-[#ed3237] text-white border-[#ed3237]"
                          : "border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications