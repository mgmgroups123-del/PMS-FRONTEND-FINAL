import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import Empty_Report from "../../assets/Reports/Empty_Report.png";
import { FONTS } from "../../constants/ui constants";
import { useDispatch, useSelector } from "react-redux";
import { getAllTenantData } from "../../features/tenants/reducers/Thunks";
import { tenantSelector } from "../../features/tenants/reducers/Selector";
import { ChevronLeft, ChevronRight} from "lucide-react";

type props = {
  selectedType: string;
  setSelectedType: Dispatch<SetStateAction<string>>;
}

const TenantReport:React.FC<props> = ({selectedType, setSelectedType}) => {
  const dispatch = useDispatch<any>();
  const { data, loading, error } = useSelector(tenantSelector);
  const tenants = data?.tenants || [];

  // Filters
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchTerm] = useState("");

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 15, 20];

  const months = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    name: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const tenantTypes = ["All Types", "rent", "lease"];

  const fetchTenants = async () => {
    await dispatch(getAllTenantData(""));
  };

  useEffect(() => {
    fetchTenants();
  }, [dispatch]);

  // Filter tenants by year + month + type + search
  const filteredTenants = tenants.filter((tenant: any) => {
    if (!tenant.createdAt) return false;
    
    // Date filters
    const createdDate = new Date(tenant.createdAt);
    const year = createdDate.getFullYear();
    const month = createdDate.getMonth() + 1;
    
    // Type filter
    const typeMatch = 
      selectedType === "All Types" || 
      tenant.tenant_type.toLowerCase() === selectedType.toLowerCase();
    
    // Search filter
    const searchMatch = 
      searchTerm === "" ||
      tenant.personal_information.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.personal_information.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    return (
      year === selectedYear && 
      month === selectedMonth && 
      typeMatch && 
      searchMatch
    );
  });

  // Pagination logic
  const totalItems = filteredTenants.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTenants = filteredTenants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const availableYears = [
    ...new Set(tenants.map((t: any) => new Date(t.createdAt).getFullYear())),
  ].sort((a: any, b:  any) => b - a);

 
  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="p-8">Loading tenant report...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">Error loading tenants</div>;
  }

  return (
    <div className="p-8">
      {tenants.length === 0 ? (
        <div className="w-full text-center mt-15 mb-20">
          <img src={Empty_Report} alt="EmptyImg" className="w-[280px] m-auto" />
          <h1 style={{ ...FONTS.large_card_subHeader }}>Tenant Report</h1>
          <p style={{ ...FONTS.large_card_description3 }}>
            Detailed tenant analytics and insights coming soon.
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Search */}
           
            {/* Year Filter */}
            <div className="relative w-32">
              <div
                className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
                onClick={() => setIsYearDropdownOpen((prev) => !prev)}
              >
                <span className="text-[#ed3237]">{selectedYear}</span>
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
                <div className="absolute w-full text-[#7D7D7D] bg-white shadow-xl rounded-lg mt-1 border border-gray-300 z-10 overflow-y-auto p-2 space-y-2 max-h-80">
                  {availableYears.map((year: any) => (
                    <div
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md cursor-pointer border transition-colors ${
                        selectedYear === year
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
            <div className="relative w-40">
              <div
                className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
                onClick={() => setIsMonthDropdownOpen((prev) => !prev)}
              >
                <span className="text-[#ed3237]">
                  {months.find((m) => m.number === selectedMonth)?.name}
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
                <div className="absolute w-full text-[#7D7D7D] bg-white shadow-xl rounded-lg mt-1 border border-gray-300 z-10 overflow-y-auto p-2 space-y-2 max-h-80">
                  {months.map((month) => (
                    <div
                      key={month.number}
                      onClick={() => {
                        setSelectedMonth(month.number);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md cursor-pointer border transition-colors ${
                        selectedMonth === month.number
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

            {/* Tenant Type Filter */}
            <div className="relative w-32">
              <div
                className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between bg-[#ed32371A]"
                onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
              >
                <span className="text-[#ed3237] capitalize">{selectedType}</span>
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
              {isTypeDropdownOpen && (
                <div className="absolute w-full text-[#7D7D7D] bg-white shadow-xl rounded-lg mt-1 border border-gray-300 z-10 overflow-y-auto p-2 space-y-2 max-h-80">
                  {tenantTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        setSelectedType(type);
                        setIsTypeDropdownOpen(false);
                      }}
                      className={`px-3 py-2 rounded-md cursor-pointer border transition-colors ${
                        selectedType === type
                          ? "bg-[#ed3237] text-white"
                          : "hover:bg-[#ed3237] hover:text-white"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-3 grid gap-6">
            <h1 style={{ ...FONTS.chart_Header }}>Tenant Performance</h1>

            {/* Table Header */}
            <div
              style={{ ...FONTS.Table_Header }}
              className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-6 gap-4 bg-gray-50"
            >
              <p>Tenant</p>
              <p>Type</p>
              <p>Lease Duration</p>
              <p>Unit</p>
              <p>Rent</p>
              <p>Deposit</p>
            </div>

            {/* Table Rows */}
            {paginatedTenants.length ? (
              paginatedTenants.map((tenant: any, index: number) => (
                <div
                  key={tenant.uuid || index}
                  className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-6 gap-4 items-center"
                >
                  <p style={{ ...FONTS.Table_Body_2 }}>
                    <span className="grid">
                      {tenant.personal_information.full_name}
                      <small className="text-[#7D7D7D]">
                        {tenant.personal_information.phone}
                      </small>
                    </span>
                  </p>
                  <p style={{ ...FONTS.Table_Body_2 }} className="capitalize text-[#7D7D7D]">
                    {tenant.tenant_type}
                  </p>
                  <div style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D] grid">
                    <span>{formatDate(tenant.lease_duration.start_date)}</span>
                    <span>{formatDate(tenant.lease_duration.end_date)}</span>
                  </div>
                  <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
                    {tenant.unit?.unit_name || "N/A"}
                  </p>
                  <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
                    ₹{Number(tenant.rent).toLocaleString()}
                  </p>
                  <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
                    ₹{Number(tenant.deposit).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                No tenants found for {months.find((m) => m.number === selectedMonth)?.name}{" "}
                {selectedYear}
              </p>
            )}

            {/* Pagination */}
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
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                              page === currentPage
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
        </>
      )}
    </div>
  );
};

export default TenantReport;