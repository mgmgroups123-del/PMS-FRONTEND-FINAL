import React, { useState, useMemo, useRef, useEffect } from "react";
import { Building2, ChevronLeft, ChevronRight, X, } from "lucide-react";
import Card2 from "./Card";
// import frame2 from "../../assets/cardimg1.png";
// import frame3 from "../../assets/image 315.png";
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
  financial_information: any
}

interface RentItem {
  uuid: string;
  tenantId: Tenant;
  paymentDueDay: string;
  status: string;
  bankDetails: string;
}

const Rent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState<boolean>(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedRent, setSelectedRent] = useState<RentItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date();

  const months = [
    "All Months",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthIndex = today.getMonth();
  const currentMonthName = months[currentMonthIndex + 1];

  const [monthFilter, setMonthFilter] = useState(currentMonthName);


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


  useEffect(() => {
    const fetchRentData = async () => {
      try {
        // Month index for API (1-12)
        const monthNumber = today.getMonth() + 1;
        const yearNumber = today.getFullYear();

        const params = {
          month: monthNumber.toString(),
          year: yearNumber.toString(),
        };

        await dispatch(fetchRentThunk(params));
      } catch (err) {
        console.error("Error fetching rent data:", err);
      } finally {
      }
    };

    fetchRentData();
  }, [dispatch]);


  const handleDownload = async (uuid: string) => {
    try {
      setDownloadingId(uuid);

      const response = await downloadRent(uuid);
      toast.success("File downloaded successfully");

      // Create a Blob URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `rent_receipt_${uuid}_${new Date()
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
        status: newStatus
      };

      await updateRent(params);
      toast.success('Status updated successfully!');

      const fetchParams = {
        month: (today.getMonth() + 1).toString(),
        year: today.getFullYear().toString(),
      };

      await dispatch(fetchRentThunk(fetchParams));
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
    console.log("delete id", deletingId)
    try {
      setIsDeleting(true);
      await deleteRent(deletingId)
      toast.success('Rent deleted successfully!');

      const fetchParams = {
        month: "8",
        year: "2025"
      };
      await dispatch(fetchRentThunk(fetchParams));

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

  const filteredData = useMemo(() => {
    if (!rents?.rents) return [];
    return rents.rents.filter((item: RentItem) => {
      const matchesSearch = item.tenantId?.personal_information?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" ? true : item.status === statusFilter;

      const matchesMonth =
        monthFilter === "All Months"
          ? true
          : months[new Date(item.paymentDueDay).getMonth() + 1] === monthFilter;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [searchTerm, statusFilter, monthFilter, rents?.rents]);


  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, monthFilter, rowsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const totalDue = rents?.rents?.reduce(
    (sum: number, item: RentItem) => sum + (Number(item.tenantId?.rent) || 0), 0) || 0;

  const totalPaid = rents?.rents
    ?.filter((item: RentItem) => item.status === "paid")
    ?.reduce((sum: number, item: RentItem) => sum + (Number(item.tenantId?.rent) || 0), 0) || 0;

  const totalPending = rents?.rents
    ?.filter((item: RentItem) => item.status === "pending")
    ?.reduce((sum: number, item: RentItem) => sum + (Number(item.tenantId?.rent) || 0), 0) || 0;

  const totalDeposits = rents?.TotalDeposit?.[0]?.total || 0;


  const resetSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (isMonthDropdownOpen && !document.querySelector('.month-dropdown')?.contains(target)) {
        setIsMonthDropdownOpen(false);
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
  }, [isMonthDropdownOpen, isStatusDropdownOpen, openDropdownId]);

  const role = GetLocalStorage('role')

  return (
    <div className="bg-gray-50 min-h-screen">
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

      <div className="flex flex-wrap gap-4 mb-6">
        <div className='relative max-w-md flex-1'>
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

        <div className="relative w-28 ml-auto ">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
            onClick={() => {
              setIsStatusDropdownOpen((prev) => !prev);
              setStatusFilter((prev) =>
                prev === "All Status" ? "All Status" : prev
              );
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

        <div className="relative w-28 ">
          <div
            className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
            onClick={() => {
              setIsMonthDropdownOpen((prev) => !prev);
              setMonthFilter((prev) =>
                prev === "All Months" ? "All Months" : prev
              );
            }}
          >
            <span className="text-[#ed3237]">{monthFilter}</span>
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
              {months.map((month) => (
                <div
                  key={month}
                  onClick={() => {
                    setMonthFilter(month);
                    setIsMonthDropdownOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md cursor-pointer border transition-colors ${monthFilter === month
                    ? "bg-[#ed3237] text-white"
                    : "hover:bg-[#ed3237] hover:text-white"
                    }`}
                >
                  {month}
                </div>
              ))}
            </div>


          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 shadow overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-6">
          <thead className="bg-gray-100" style={{ ...FONTS.Table_Header }}>
            <tr>
              <th className="px-6 py-4 rounded-l-lg">Company Name</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody style={{ ...FONTS.Table_Body }}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item: RentItem) => (
                <tr
                  key={item.uuid}
                  className="shadow-sm text-[#7D7D7D] hover:shadow-md transition-shadow"
                >
                  <td className="px-6 py-4 flex rounded-l-lg text-lg border-l border-t border-b border-gray-200">
                    <span
                      className={`rounded p-2 flex items-center justify-center ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      <BiSolidBuildings className="text-2xl" />
                    </span>
                    <div className="grid ml-3">
                      <span className="font-bold text-black">
                        {item.tenantId?.personal_information?.full_name || "N/A"}
                      </span>
                      <span className="text-sm">{item.tenantId?.unit.unit_name || "N/A"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 border-t border-b border-gray-200">
                    ₹{item.tenantId?.rent || "0"}
                  </td>

                  <td className="px-6 py-4  border-t border-b border-gray-200">

                    <span> {formatDate(item.paymentDueDay)}</span>

                  </td>

                  <td className="px-6 py-4 border-t border-b border-gray-200 relative">
                    <div
                      ref={(el) => {
                        if (openDropdownId === item.uuid && el)
                          badgeRef.current = el;
                      }}
                      onClick={(e) => {
                        if (item.status === 'paid') {
                          return;
                        }
                        badgeRef.current = e.currentTarget as HTMLDivElement;
                        setOpenDropdownId((prev) =>
                          prev === item.uuid ? null : item.uuid
                        );
                      }}
                      className={`inline-flex items-center justify-between cursor-pointer h-10 px-3 py-1 rounded-md border text-sm font-medium ${role === 'owner' || role === 'manager' ? `` : `opacity-50 cursor-not-allowed`}  ${getStatusStyle(
                        item.status
                      )} min-w-[100px] ${updatingId === item.uuid ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span>{item.status}</span>
                      </span>

                      {item.status !== 'paid' && (
                        <svg
                          className={`w-4 h-4 ml-2 transition-transform ${openDropdownId === item.uuid ? "rotate-180" : ""}
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
                      )}
                    </div>

                    {openDropdownId === item.uuid && (
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
                            onClick={() => { role === 'owner' || role === 'manager' ? handleStatusChange(item.uuid, s) : undefined }}
                            className={`flex items-center px-3 text-[#7D7D7D] py-2 rounded-md cursor-pointer border hover:bg-[#ed323710] transition-colors ${role === 'owner' || role === 'manager' ? `cursor-pointer` : `opacity-50 cursor-not-allowed`}  ${item.status === s
                              ? "bg-[#ed323710] text-[#ed3237]"
                              : ""
                              }`}
                          >
                            <span>{s}</span>
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
                        }}
                      >
                        View
                      </button>
                      <button
                        className={`hover:bg-[#ed3237] bg-[#ed3237] text-white px-3 py-1 rounded-lg transition-colors  ${downloadingId === item.uuid ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        onClick={() => handleDownload(item.uuid)}
                        disabled={downloadingId === item.uuid}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#7D7D7D]">
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


      {isModalOpen && selectedRent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Rent Payment Details</h2>
                <p className="text-[#7D7D7D] mt-1">{formatDate(selectedRent.paymentDueDay) || "N/A"}</p>
              </div>
              <button
                className="text-gray-400  bg-gray-500 w-6 h-6 hover:bg-gray-700 rounded-full transition-colors p-1 -mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 text-white w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex items-center gap-5">
                <div className={`rounded-xl p-4 ${getStatusStyle(selectedRent.status)}`}>
                  <BiSolidBuildings className="text-4xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedRent.tenantId?.personal_information?.full_name || "N/A"}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="flex items-center text-[#7D7D7D]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {selectedRent.tenantId?.unit.unit_name || "N/A"}
                    </span>
                    <span className="flex items-center text-[#7D7D7D]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {selectedRent.tenantId?.personal_information?.email || "N/A"}
                    </span>
                    <span className="flex items-center text-[#7D7D7D]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {selectedRent.tenantId?.personal_information?.phone || "N/A"}
                    </span>
                  </div>
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
                        <p className="text-gray-800">{selectedRent.tenantId?.personal_information?.address || "N/A"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#7D7D7D]">Lease Start</p>
                          <p className="text-gray-800">{formatDate(selectedRent.tenantId?.lease_duration.start_date) || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#7D7D7D]">Lease End</p>
                          <p className="text-gray-800">{formatDate(selectedRent.tenantId?.lease_duration.end_date) || "N/A"}</p>
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
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusStyle(selectedRent.status)}`}></span>
                        <span className="font-medium capitalize">{selectedRent.status || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-sm text-[#7D7D7D]">Security Deposit:</span>
                        <span className="ml-2 font-medium">₹{selectedRent.tenantId?.deposit || "0"}</span>
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
                      <div className="flex justify-between">
                        <span className="text-[#7D7D7D]">Base Rent</span>
                        <span className="font-medium">₹{selectedRent.tenantId?.financial_information?.rent || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7D7D7D]">Maintenance</span>
                        <span className="font-medium">₹{selectedRent.tenantId?.financial_information?.maintanence || "0"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7D7D7D]">CGST</span>
                        <span className="font-medium">{selectedRent.tenantId?.financial_information?.cgst || "0"} %</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7D7D7D]">SGST</span>
                        <span className="font-medium">{selectedRent.tenantId?.financial_information?.sgst || "0"} %</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-[#7D7D7D]">TDS Deduction</span>
                        <span className="text-red-500 font-medium">{selectedRent.tenantId?.financial_information?.tds || "0"} %</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="font-semibold">Total Amount</span>
                        <span className="font-bold text-lg">₹{selectedRent.tenantId?.rent || "0"}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
              <button
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className={`px-6 py-2.5 bg-red-600 rounded-lg text-white hover:bg-red-400 transition-colors ${role === 'owner' ? `` : `bg-red-600 opacity-50 cursor-not-allowed`} `}
                onClick={() => {
                  if (role === 'owner') {
                    setDeletingId(selectedRent.uuid);
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