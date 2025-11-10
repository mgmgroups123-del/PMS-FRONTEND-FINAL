import React, { useState, useMemo, useRef, useEffect } from "react";
import { Building2, ChevronLeft, ChevronRight, X, Edit, Save } from "lucide-react";
import Card2 from "./Card";
import { BiSolidBuildings } from "react-icons/bi";
import { FONTS } from "../../constants/ui constants";
import { useDispatch, useSelector } from "react-redux";
import { getRent } from "../../features/Rent/selector";
import { fetchRentThunk } from "../../features/Rent/thunks";
import { deleteRent, downloadRent, updateRent } from "../../features/Rent/service";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import searchImg from '../../assets/properties/search.png';
import { GetLocalStorage } from "../../utils/localstorage";
import { DashboardThunks } from "../../features/Dashboard/Reducer/DashboardThunk";
import { editTenants, patchTenants } from "../../features/tenants/services";
import dayjs from "dayjs";

interface PersonalInformation {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

interface Tenant {
  deposit: string;
  lease_duration: any;
  personal_information: PersonalInformation;
  rent: string;
  unit: any
  unit_number: number;
  security_deposit: string;
  lease_start_date: string;
  lease_end_date: string;
  emergency_contact: string;
  financial_information: any;
  uuid: string
}

interface RentItem {
  uuid: string;
  tenantId: Tenant;
  paymentDueDay: string;
  status: string;
  bankDetails: string;
  previousMonthDue?: number;
  previousMonthStatus?: string;
}

// New interface for backend response structure
interface CombinedRentItem {
  tenantId: string;
  tenantName: string;
  floor: string;
  companyName: string;
  lease_start_date: string;
  lease_end_date: string;
  address:string;
  tenantEmail:string;
  currentMonth: {
    uuid: string;
    amount: number;
    status: string;
    dueDate: string;
    cgst: number;
    sgst: number;
    maintenance: number;
    tds: number;
    total: number;
  };
  previousMonth: {
    uuid: string;
    amount: number;
    status: string;
    dueDate: string;
    cgst: number;
    sgst: number;
    maintenance: number;
    tds: number;
    total: number;
  };
}

interface EditableRentData {
  full_name: string;
  rent: any;
  maintenance: any;
  cgst: any;
  sgst: any;
  tds: any;
  total: any;
}

const Rent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState<boolean>(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); 
  const [openPreviousDropdownId, setOpenPreviousDropdownId] = useState<string | null>(null); 
  const [selectedRent, setSelectedRent] = useState<CombinedRentItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<EditableRentData>({
    full_name: "",
    rent: 0,
    maintenance: 0,
    cgst: 0,
    sgst: 0,
    tds: 0,
    total: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // Generate years for filtering (current year and previous 5 years)
  const generateYears = () => {
    const years = [];
    for (let i = -2; i <= 2; i++) {
      years.push(currentYear + i);
    }
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  };

  // Generate months with years for proper filtering
  const generateMonthsWithYears = () => {
    const months = [];
    const currentDate = new Date();

    // Add 12 months including current and previous months
    for (let i = -2; i <= 9; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      months.push({
        name: `${monthName} ${year}`,
        value: `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        monthIndex: date.getMonth() + 1,
        year: year
      });
    }

    return [{ name: "All Months", value: "all" }, ...months];
  };

  const monthsWithYears = generateMonthsWithYears();
  const years = generateYears();
  
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(currentYear.toString());

  const badgeRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const statusOptions = ["paid", "pending", "overdue"];
  const filterStatusOptions = ["All Status", "paid", "pending", "overdue"];
  const rowsPerPageOptions = [5, 10, 15, 20, 25];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-[#1CAF191A] border-[#1CAF19] text-[#1CAF19]";
      case "pending":
        return "bg-[#FFC3001A] border-[#FFC300] text-[#FFC300]";
      case "overdue":
        return "bg-[#E212691A] border-[#E21269] text-[#E21269]";
      default:
        return "bg-gray-100 text-[#7D7D7D]";
    }
  };

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!openDropdownId) return;
      const target = e.target as Node;
      if (
        badgeRef.current &&
        dropdownRef.current &&
        !badgeRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        setOpenDropdownId(null);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdownId(null);
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openDropdownId]);

  const dispatch = useDispatch<any>();
  const rents = useSelector(getRent);

  // Function to fetch rent data for a specific month and year
  const fetchRentData = async (month?: number, year?: number) => {
    try {
      const monthNumber = month || (monthFilter !== "all" ? parseInt(monthFilter.split('-')[1]) : currentMonth);
      const yearNumber = year || parseInt(yearFilter);

      const params = {
        month: monthNumber.toString(),
        year: yearNumber.toString(),
      };

      await dispatch(fetchRentThunk(params));
    } catch (err) {
      console.error("Error fetching rent data:", err);
      toast.error("Failed to fetch rent data");
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchRentData();
  }, [dispatch]);

  // Fetch data when filters change
  useEffect(() => {
    if (monthFilter !== "all" || yearFilter !== currentYear.toString()) {
      fetchRentData();
    }
  }, [monthFilter, yearFilter]);

  const handleDownload = async (item: CombinedRentItem) => {
    try {
      setDownloadingId(item.currentMonth.uuid);
      const dueDate = new Date(item.currentMonth.dueDate);
      const year = dueDate.getFullYear();
      const month = dueDate.getMonth() + 1;
      const payload = {
        uuid: item.currentMonth.uuid,
        year: year,
        month: month
      }
      const response = await downloadRent(payload);
      toast.success("File downloaded successfully");

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `rent_receipt_${item.currentMonth.uuid}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleStatusChange = async (uuid: string, newStatus: string) => {
    try {
      setUpdatingId(uuid);
      const params = {
        uuid: uuid,
        status: newStatus,
      };

      await updateRent(params);
      toast.success('Status updated successfully!');

      // Refresh current month data
      await fetchRentData();
      // Refresh dashboard data to update pending payments count
      dispatch(DashboardThunks());
    } catch (error) {
      console.error('Status update failed:', error);
      toast.error('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
    setOpenDropdownId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      await deleteRent(deletingId)
      toast.success('Rent deleted successfully!');

      await fetchRentData();
      // Refresh dashboard data to update pending payments count
      dispatch(DashboardThunks());

      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete rent record. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    } catch (e) {
      return "N/A";
    }
  };

  // Initialize editable data when modal opens
  useEffect(() => {
    if (selectedRent && isModalOpen) {
      setEditableData({
        full_name: selectedRent.tenantName || "",
        rent: selectedRent.currentMonth.amount || 0,
        maintenance: selectedRent?.currentMonth.maintenance || selectedRent?.previousMonth.maintenance,
        cgst: selectedRent?.currentMonth.cgst || selectedRent?.previousMonth.cgst,
        sgst: selectedRent?.currentMonth.sgst || selectedRent?.previousMonth.sgst,
        tds: selectedRent?.currentMonth.tds || selectedRent?.previousMonth.tds,
        total: selectedRent?.currentMonth.total || selectedRent?.previousMonth.total
      });
    }
  }, [selectedRent, isModalOpen]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reset to original values
      setEditableData({
        full_name: selectedRent?.tenantName || "",
        rent: selectedRent?.currentMonth.amount || 0,
        maintenance: selectedRent?.currentMonth.maintenance || selectedRent?.previousMonth.maintenance,
        cgst: selectedRent?.currentMonth.cgst || selectedRent?.previousMonth.cgst,
        sgst: selectedRent?.currentMonth.sgst || selectedRent?.previousMonth.sgst,
        tds: selectedRent?.currentMonth.tds || selectedRent?.previousMonth.tds,
        total: selectedRent?.currentMonth.total || selectedRent?.previousMonth.total
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    if (!selectedRent) return;

    try {
      setIsSaving(true);
      // Note: You'll need to adjust this based on your actual tenant update API
      const data = {
        uuid: selectedRent.tenantId,
        data: {
          personal_information: { full_name: editableData.full_name },
          financial_information: {
            rent: Number(editableData.rent),
            maintenance: Number(editableData.maintenance),
            cgst: Number(editableData.cgst),
            sgst: Number(editableData.sgst),
            tds: Number(editableData.tds),
            total: Number(editableData.total)
          },
          rent: Number(editableData.total),
        }
      };

      const response = await patchTenants(data);
      if (response.success) {
        toast.success('Changes saved successfully!');
        setIsEditing(false);
      }

      // Refresh the data
      await fetchRentData();

    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof EditableRentData, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredData = useMemo(() => {
    if (!rents?.combined) return [];

    return rents.combined.filter((item: CombinedRentItem) => {
      const matchesSearch = item.tenantName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" ? true : item.currentMonth.status === statusFilter;

      // Month and Year filtering
      let matchesMonthYear = true;
      if (monthFilter !== "all") {
        const [filterYear, filterMonth] = monthFilter.split('-');
        const itemDueDate = new Date(item.currentMonth.dueDate);
        const itemYear = itemDueDate.getFullYear();
        const itemMonth = itemDueDate.getMonth() + 1;
        
        matchesMonthYear = itemYear.toString() === filterYear && itemMonth.toString() === filterMonth;
      }

      return matchesSearch && matchesStatus && matchesMonthYear;
    });
  }, [searchTerm, statusFilter, monthFilter, yearFilter, rents?.combined]);


  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, monthFilter, yearFilter, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const totalDue = rents?.totalDueAmount || 0;
  const totalPaid = rents?.totalPaidThisMonth || 0;
  const totalPending = rents?.totalPendingThisMonth || 0;
  const totalDeposits = rents?.TotalDeposit?.[0]?.total || 0;

  const resetSearch = () => {
    setSearchTerm('');
  };

  const resetFilters = () => {
    setMonthFilter("all");
    setYearFilter(currentYear.toString());
    setStatusFilter("All Status");
    setSearchTerm("");
  };

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (isMonthDropdownOpen && !document.querySelector('.month-dropdown')?.contains(target)) {
        setIsMonthDropdownOpen(false);
      }

      if (isYearDropdownOpen && !document.querySelector('.year-dropdown')?.contains(target)) {
        setIsYearDropdownOpen(false);
      }

      if (isStatusDropdownOpen && !document.querySelector('.status-dropdown')?.contains(target)) {
        setIsStatusDropdownOpen(false);
      }

      if (openDropdownId &&
        !(badgeRef.current?.contains(target) || dropdownRef.current?.contains(target))) {
        setOpenDropdownId(null);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMonthDropdownOpen(false);
        setIsYearDropdownOpen(false);
        setIsStatusDropdownOpen(false);
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMonthDropdownOpen, isYearDropdownOpen, isStatusDropdownOpen, openDropdownId]);

  const role = GetLocalStorage('role');

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="font-bold">
          <span className="text-2xl"> Rent Management </span>
          <br />
          <span className="text-md font-normal text-[#7D7D7D]">
            Track and Manage Rent Payments
          </span>
        </div>
      </div>

      <div className="flex mb-6 gap-6">
        <Card2
          bgImage=""
          icon={<Building2 />}
          title="Total Due"
          subText="This Month"
          value={totalDue}
          iconBg="bg-pink-200"
          iconTextColor="text-pink-600"
        />
        <Card2
          bgImage=""
          icon={<Building2 />}
          title="Collected"
          subText="This Month"
          value={totalPaid}
          iconBg="bg-green-200"
          iconTextColor="text-green-600"
        />
        <Card2
          bgImage=""
          icon={<Building2 />}
          title="Pending"
          subText="This Month"
          value={totalPending}
          iconBg="bg-yellow-200"
          iconTextColor="text-yellow-600"
        />
        <Card2
          bgImage=""
          icon={<Building2 />}
          title="Total Deposits"
          subText=""
          value={totalDeposits}
          iconBg="bg-yellow-200"
          iconTextColor="text-yellow-600"
        />
      </div>

      <div className="flex justify-between gap-4 mb-6">
        <div className='relative max-w-md flex-1'>
        <div>
          <img
            src={searchImg}
            className='absolute left-3 top-7 transform -translate-y-1/2 text-gray-400 w-4 h-4'
          />
          <Input
            placeholder='Search by tenant name'
            className='pl-10 h-10 w-[80%] bg-[#b200ff0d] border-[#b200ff0d] text-[#333333] placeholder-[#333333] rounded-lg focus-visible:ring-[#000] focus-visible:border-[#000]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={resetSearch}
              className='absolute right-24 top-7 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:ring-[#000] focus-visible:border-[#000]'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
        </div>
        <div className="flex gap-3">

        {/* Year Filter */}
        <div className="relative w-28">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
            onClick={() => {
              setIsYearDropdownOpen((prev) => !prev);
            }}
          >
            <span className="text-[#ed3237]">{yearFilter}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isYearDropdownOpen && (
            <div className="absolute year-dropdown w-full text-[#7D7D7D] bg-white shadow-xl rounded-lg mt-1 border border-gray-300 z-10 overflow-y-auto p-2 space-y-2 max-h-80 custom-scrollbar">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setYearFilter(year.toString());
                    setIsYearDropdownOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md cursor-pointer border transition-colors ${yearFilter === year.toString()
                    ? "bg-[#ed3237] text-white"
                    : "hover:bg-[#ed3237] hover:text-white"
                    }`}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Month Filter */}
        <div className="relative w-48">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
            onClick={() => {
              setIsMonthDropdownOpen((prev) => !prev);
            }}
          >
            <span className="text-[#ed3237]">
              {monthFilter === "all"
                ? "All Months"
                : monthsWithYears.find(m => m.value === monthFilter)?.name || "Select Month"
              }
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isMonthDropdownOpen && (
            <div className="absolute month-dropdown w-full text-[#7D7D7D] bg-white shadow-xl rounded-lg mt-1 border border-gray-300 z-10 overflow-y-auto p-2 space-y-2 max-h-80 custom-scrollbar">
              {monthsWithYears
                .filter(month => month.value === "all" || month.year === parseInt(yearFilter))
                .map((month) => (
                  <div
                    key={month.value}
                    onClick={() => {
                      setMonthFilter(month.value);
                      setIsMonthDropdownOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md cursor-pointer border transition-colors ${monthFilter === month.value
                      ? "bg-[#ed3237] text-white"
                      : "hover:bg-[#ed3237] hover:text-white"
                      }`}
                  >
                    {month.name}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative w-28">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
            onClick={() => {
              setIsStatusDropdownOpen((prev) => !prev);
            }}
          >
            <span className="text-[#ed3237]">{statusFilter}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isStatusDropdownOpen && (
            <div className="absolute status-dropdown w-full bg-white text-[#7D7D7D] shadow-xl mt-1 rounded-lg border border-gray-300 z-10 overflow-y-auto p-2 space-y-2">
              {filterStatusOptions.map((status) => (
                <div
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md active:bg-[#ed3237] active:text-white cursor-pointer border transition-colors ${statusFilter === status ? "bg-[#ed3237] text-white" : ""
                    }`}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset Filters
        </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 shadow overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-6">
          <thead className="bg-gray-100" style={{ ...FONTS.Table_Header }}>
            <tr>
              <th className="px-6 py-4 rounded-l-lg">Company Name</th>
              <th className="px-6 py-4">Rent Amount</th>
              <th className="px-6 py-4">Previous Due Amount & Status</th>
              <th className="px-6 py-4">Current Due date</th>
              <th className="px-6 py-4">Current Status</th>
              <th className="px-6 py-4 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody style={{ ...FONTS.Table_Body }}>
            {paginatedData.length > 0 ? (
              paginatedData?.map((item: CombinedRentItem) => (
                <tr
                  key={item.currentMonth.uuid}
                  className="shadow-sm text-[#7D7D7D] hover:shadow-md transition-shadow"
                >
                  <td className="px-6 py-4 flex rounded-l-lg text-lg border-l border-t border-b border-gray-200">
                    <span
                      className={`rounded p-2 flex items-center justify-center ${getStatusStyle(
                        item.currentMonth.status
                      )}`}
                    >
                      <BiSolidBuildings className="text-2xl" />
                    </span>
                    <div className="grid ml-3">
                      <span className="font-bold text-black">
                        {item.tenantName || "N/A"}
                      </span>
                      <span className="text-sm">{item.floor || "N/A"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 border-t border-b border-gray-200">
                    ₹{item.currentMonth.amount || "0"}
                  </td>

                  <td className="px-6 py-4 border-t border-b border-gray-200">
                    <div className="flex flex-col gap-2">
                      {/* Previous Month Due with Status */}
                      {item?.previousMonth?.amount > 0 ? (
                        <div className="flex items-center justify-between bg-red-50 p-2 rounded border border-red-200">
                          <span className="text-sm text-red-700 font-medium">
                            ₹{item.previousMonth.amount}
                          </span>
                          <div className="relative">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                if (role === "owner" || role === "manager") {
                                  setOpenPreviousDropdownId(
                                    openPreviousDropdownId === item.previousMonth.uuid
                                      ? null
                                      : item.previousMonth.uuid
                                  );
                                }
                              }}
                              className={`inline-flex items-center cursor-pointer px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
                                item.previousMonth.status || "overdue"
                              )}`}
                            >
                              <span className="capitalize">{item.previousMonth.status}</span>
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>

                            {openPreviousDropdownId === item.previousMonth.uuid && (
                              <div className="absolute right-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-300 z-20 overflow-y-auto p-2 space-y-2 min-w-[120px]">
                                {statusOptions.map((s) => (
                                  <div
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (role === "owner" || role === "manager") {
                                        handleStatusChange(item.previousMonth.uuid, s);
                                        setOpenPreviousDropdownId(null);
                                      }
                                    }}
                                    className={`flex items-center px-3 text-[#7D7D7D] py-2 rounded-md cursor-pointer border hover:bg-[#ed323710] transition-colors ${item.previousMonth.status === s ? "bg-[#ed323710] text-[#ed3237]" : ""
                                      }`}
                                  >
                                    <span className="capitalize">{s}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200 text-center">
                          No Previous Dues
                        </div>
                      )}

                    </div>
                  </td>

                  <td className="px-6 py-4  border-t border-b border-gray-200">
                    <span> {formatDate(item.currentMonth.dueDate)}</span>
                  </td>

                  <td className="px-6 py-4 border-t border-b border-gray-200 relative">
                    <div
                      ref={(el) => {
                        if (openDropdownId === item.currentMonth.uuid && el)
                          badgeRef.current = el;
                      }}
                      onClick={(e) => {
                        badgeRef.current = e.currentTarget as HTMLDivElement;
                        setOpenDropdownId((prev) =>
                          prev === item.currentMonth.uuid ? null : item.currentMonth.uuid
                        );
                      }}
                      className={`inline-flex items-center justify-between cursor-pointer h-10 px-3 py-1 rounded-md border text-sm font-medium ${role === 'owner' || role === 'manager' ? `` : `opacity-50 cursor-not-allowed`}  ${getStatusStyle(
                        item.currentMonth.status
                      )} min-w-[100px] ${updatingId === item.currentMonth.uuid ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <span className="flex items-center gap-2 truncate capitalize">
                        <span>{item.currentMonth.status}</span>
                      </span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${openDropdownId === item.currentMonth.uuid ? "rotate-180" : ""}
                            `}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {openDropdownId === item.currentMonth.uuid && (
                      <div
                        ref={dropdownRef}
                        style={{
                          minWidth: badgeRef.current
                            ? `${badgeRef.current.offsetWidth}px`
                            : undefined,
                        }}
                        className={`absolute left-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-300 z-10 overflow-y-auto p-2 space-y-2`}
                      >
                        {statusOptions.map((s) => (
                          <div
                            key={s}
                            onClick={() => {
                              if (role === 'owner' || role === 'manager') {
                                handleStatusChange(item.currentMonth.uuid, s);
                              }
                            }}
                            className={`flex items-center px-3 text-[#7D7D7D] py-2 rounded-md cursor-pointer border hover:bg-[#ed323710] transition-colors ${role === 'owner' || role === 'manager' ? `cursor-pointer` : `opacity-50 cursor-not-allowed`}  ${item.currentMonth.status === s
                              ? "bg-[#ed323710] text-[#ed3237]"
                              : ""
                              }`}
                          >
                            <span className="capitalize">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 rounded-r-lg border-r border-t border-b border-gray-200">
                    <div className="flex gap-2">
                      <button
                        className="hover:bg-[#ed3237] bg-[#ed3237] text-white px-3 h-10 py-1 rounded-lg transition-colors "
                        onClick={() => {
                          setSelectedRent(item);
                          setIsModalOpen(true);
                          setIsEditing(false);
                        }}
                      >
                        View
                      </button>
                      <button
                        className={`hover:bg-[#ed3237] bg-[#ed3237] text-white px-3 py-1 rounded-lg transition-colors  ${downloadingId === item.currentMonth.uuid ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item.currentMonth.uuid}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#7D7D7D]">
                  No rent data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#7D7D7D]">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#ed3237]"
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
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-[#7D7D7D] mb-6">
                Are you sure you want to delete this rent record? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-red-600 rounded-lg text-white hover:bg-red-400 transition-colors"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Rent Modal */}
      {isModalOpen && selectedRent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Rent Payment Details</h2>
                <p className="text-[#7D7D7D] mt-1">{formatDate(selectedRent.currentMonth.dueDate) || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={handleEditToggle}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                )}
                <button
                  className="text-gray-400 bg-gray-500 w-6 h-6 hover:bg-gray-700 rounded-full transition-colors p-1"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 text-white w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex items-center gap-5">
                <div className={`rounded-xl p-4 ${getStatusStyle(selectedRent.currentMonth.status)}`}>
                  <BiSolidBuildings className="text-4xl text-white" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tenant Name
                        </label>
                        <Input
                          value={editableData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          className="w-full"
                          placeholder="Enter tenant name"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {editableData.full_name || "N/A"}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        <span className="flex items-center text-[#7D7D7D]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {selectedRent.floor || "N/A"}
                        </span>
                        <span className="flex items-center text-[#7D7D7D]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {selectedRent.tenantEmail || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Tenant Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-[#7D7D7D]">Full Address</p>
                        <p className="text-gray-800">{selectedRent.address || "N/A"}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                        <p className="text-sm text-[#7D7D7D]">Lease start date</p>
                        <p className="text-gray-800">{dayjs(selectedRent.lease_start_date).format("DD-MM-YYYY") || "N/A"}</p>
                        </div>
                        <div>
                        <p className="text-sm text-[#7D7D7D]">Lease end date</p>
                        <p className="text-gray-800">{dayjs(selectedRent.lease_end_date).format("DD-MM-YYYY") || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Payment Status
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusStyle(selectedRent.currentMonth.status)}`}></span>
                        <span className="font-medium capitalize">{selectedRent.currentMonth.status || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                      Rent Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#7D7D7D]">Base Rent</span>
                        {isEditing ? (
                          <Input
                            value={editableData.rent}
                            onChange={(e) => handleInputChange('rent', e.target.value)}
                            className="w-32 text-right"
                            type="number"
                            placeholder="0"
                          />
                        ) : (
                          <span className="font-medium">₹{editableData.rent || "0"}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7D7D7D]">Maintenance</span>
                        {isEditing ? (
                          <Input
                            value={editableData.maintenance}
                            onChange={(e) => handleInputChange('maintenance', e.target.value)}
                            className="w-32 text-right"
                            type="number"
                            placeholder="0"
                          />
                        ) : (
                          <span className="font-medium">₹{editableData.maintenance || "0"}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7D7D7D]">CGST</span>
                        {isEditing ? (
                          <Input
                            value={editableData.cgst}
                            onChange={(e) => handleInputChange('cgst', e.target.value)}
                            className="w-32 text-right"
                            type="number"
                            placeholder="0"
                          />
                        ) : (
                          <span className="font-medium">₹{editableData.cgst || "0"}</span>
                        )}

                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7D7D7D]">SGST</span>
                        {isEditing ? (
                          <Input
                            value={editableData.sgst}
                            onChange={(e) => handleInputChange('sgst', e.target.value)}
                            className="w-32 text-right"
                            type="number"
                            placeholder="0"
                          />
                        ) : (<span className="font-medium">₹{editableData.sgst || "0"} </span>)}

                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-[#7D7D7D]">TDS Deduction</span>
                        {isEditing ? (
                          <Input
                            value={editableData.tds}
                            onChange={(e) => handleInputChange('tds', e.target.value)}
                            className="w-32 text-right"
                            type="number"
                            placeholder="0"
                          />) : (<span className="text-red-500 font-medium">₹{editableData.tds || "0"}</span>)}

                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="font-semibold">Total Amount</span>
                        {isEditing ? (
                          <Input
                            value={editableData.total}
                            onChange={(e) => handleInputChange('total', e.target.value)}
                            className="w-32 text-right"
                            type="number"
                            placeholder="0"
                          />
                        ) : (<span className="font-bold text-lg">₹{Number(editableData.total) || "0"}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
              {isEditing && (
                <button
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={handleEditToggle}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              )}
              <button
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                }}
              >
                Close
              </button>
              <button
                className={`px-6 py-2.5 bg-red-600 rounded-lg text-white hover:bg-red-400 transition-colors ${role === 'owner' ? `` : `bg-red-600 opacity-50 cursor-not-allowed`} `}
                onClick={() => {
                  if (role === 'owner') {
                    setDeletingId(selectedRent.currentMonth.uuid);
                    setIsModalOpen(false);
                    setIsDeleteModalOpen(true);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rent;