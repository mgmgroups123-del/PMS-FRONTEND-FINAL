import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants/ui constants";
import Download from "../../assets/Reports/Download.png";
import Buildings from "../../assets/Reports/buildings.png";
import GrayBuilding from "../../assets/Reports/building_gray.png";
import Frame_1 from "../../assets/image 315.png";
import Frame_2 from "../../assets/image 315.png";
import Frame_3 from "../../assets/image 315.png";
import Purple_Building from "../../assets/Reports/purple_building.png";
import TenantReport from "../../components/Reports/TenantReport";
import FinancialReport from "../../components/Reports/FinancialReport";
import OccupancyReport from "../../components/Reports/OccupancyReport";
import { useDispatch, useSelector } from "react-redux";
import { DashboardThunks } from "../../features/Dashboard/Reducer/DashboardThunk";
import { fetchGetProperties } from "../../features/Properties/Reducers/PropertiesThunk";
import { loadOccReport } from "../../features/OccupancyReport/Reducers/OccreportThunk";
import { selectOccReport } from "../../features/OccupancyReport/Reducers/Selector";
import { downloadAllRentPdf, downloadRentExcel } from '../../features/Rent/service'
import toast from "react-hot-toast";

function Reports() {
  const [activeBtn, setActiveBtn] = useState("financial");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Last 30 Days");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const dispatch = useDispatch<any>();
  const occReportData = useSelector(selectOccReport);

  const activeStyle = "bg-[#15A0C60D] text-[#15A0C6] hover:bg-[#1391AD]/40";
  const inactiveStyle =
    "shadow-[0px_0px_15px_0px_#0000001A] text-[#7D7D7D] hover:bg-[#1391AD]/40";

  useEffect(() => {
    dispatch(DashboardThunks());
    dispatch(fetchGetProperties());
    dispatch(loadOccReport()); // Load occupancy report
  }, [dispatch]);

  const options = [
    "Last 30 Days",
    "Last 3 Month",
    "Last 6 Month",
    "Last 12 Month",
  ];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const formatIndianNumber = (num: any) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    else if (num >= 100000) return `${(num / 100000).toFixed(2)} Lakh`;
    return num.toString();
  };
  const totalunit = occReportData?.overall?.totalUnits || 0;
  const totalOccupied = occReportData?.overall?.occupiedUnits || 0;
  const totalVacant = occReportData?.overall?.vacantUnits || 0;

  const handleDownloadExcel = async () => {
    try {

      const response = await downloadRentExcel();
      toast.success("Rent report excel downloaded successfully");

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Overall rent report_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const Tenant:any = {tenant_type: selectedType}
      const response = await downloadAllRentPdf(Tenant);
      toast.success("Rent report pdf downloaded successfully");

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Overall rent report_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download");
    }
  };

  return (
    <div className="p-3">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <section>
          <h1 style={{ ...FONTS.headers }}>Financial Reports & Analytics</h1>
          <p
            style={{ ...FONTS.headers_description }}
            className="text-[#7D7D7D]"
          >
            Comprehensive insights into your property portfolio
          </p>
        </section>

        <section className='flex justify-center items-center gap-4'>
          <button onClick={handleDownloadPdf} className='flex justify-between items-center text-[#FFFFFF] px-3 py-2 rounded-lg gap-2' style={{ ...FONTS.button_Text, background: COLORS.primary_purple }}> <img src={Download} alt="Download" className='w-5 h-5' /> Export PDF</button>
          <button onClick={handleDownloadExcel} className='flex justify-between items-center text-[#FFFFFF] px-3 py-2 rounded-lg gap-2' style={{ ...FONTS.button_Text, background: COLORS.button_dark_green }}> <img src={Download} alt="Download" className='w-5 h-5' /> Export Excel</button>
        </section>
      </div>

      {/* Owner Info Section */}
      {/* <div className="bg-[#13A5A50D] flex items-center gap-2 my-6 rounded-lg border py-3 border-[#13A5A5]">
        <img src={Buildings} alt="building" className="h-[70px] w-[70px]" />
        <div>
          <h1 style={{ ...FONTS.headers }} className="text-[#139B9B]">
            Owner Access - Complete Financial Reports
          </h1>
          <p
            style={{ ...FONTS.headers_description }}
            className="text-[#7D7D7D]"
          >
            Access to all financial data, revenue reports, expense breakdowns,
            and profit analysis.
          </p>
        </div>
      </div> */}

      {/* Filters Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ ...FONTS.large_card_header }} className='mb-5'>Report Type</h1>
          <section className="flex  gap-3">
            <button
              onClick={() => setActiveBtn("financial")}
              className={`px-3 rounded-lg flex items-center justify-between pr-5 ${activeBtn === "financial" ? activeStyle : inactiveStyle
                }`}
              style={activeBtn === "financial" ? FONTS.card_headers : FONTS.report_btn}
            >
              <img
                src={activeBtn === "financial" ? Buildings : GrayBuilding}
                alt="btn"
                className="h-[50px] w-[50px]"
              />
              <p>Financial Report</p>
            </button>

            <button
              onClick={() => setActiveBtn("occupancy")}
              className={`px-3 rounded-lg flex items-center justify-between pr-5 ${activeBtn === "occupancy" ? activeStyle : inactiveStyle
                }`}
              style={activeBtn === "occupancy" ? FONTS.card_headers : FONTS.report_btn}
            >
              <img
                src={activeBtn === "occupancy" ? Buildings : GrayBuilding}
                alt="btn"
                className="h-[50px] w-[50px]"
              />
              <p>Occupancy Report</p>
            </button>

            <button
              onClick={() => setActiveBtn("tenant")}
              className={`px-3 rounded-lg flex items-center justify-between pr-5 ${activeBtn === "tenant" ? activeStyle : inactiveStyle
                }`}
              style={activeBtn === "tenant" ? FONTS.card_headers : FONTS.report_btn}
            >
              <img
                src={activeBtn === "tenant" ? Buildings : GrayBuilding}
                alt="btn"
                className="h-[50px] w-[50px]"
              />
              <p>Tenant Report</p>
            </button>

           
          </section>
        </div>

        <div>
          <h1 style={{ ...FONTS.large_card_header }} className="mb-5">
            Date Range
          </h1>
          <div className="relative">
            <button
              className="bg-[#ed32371A] px-4 py-2 rounded-md flex items-center justify-between text-[#ed3237]"
              style={{ ...FONTS.button_Text }}
              onClick={toggleDropdown}
            >
              {selectedOption}
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-10 mt-1 w-[140px] p-2 bg-white rounded-md shadow-[0px_0px_15px_0px_#0000001A] grid gap-2 top-[42px] right-0">
                {options.map((option) => (
                  <div
                    key={option}
                    style={{ ...FONTS.headers_description }}
                    className={`px-4 py-2 hover:bg-[#ed32371A] border rounded-md cursor-pointer ${
                      selectedOption === option ? "bg-[#ed32371A]" : ""
                    }`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Occupancy Summary */}
      {activeBtn === "occupancy" && (
        <div className="my-8 flex gap-4">
          <section
            className="w-[350px] shadow-[0px_0px_40px_0px_#9739E91A] rounded-xl py-1"
            style={{
              backgroundImage: `url(${Frame_1})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex items-center">
              <img
                src={Purple_Building}
                alt="Purp_build"
                className="w-[90px] h-[90px]"
              />
              <p style={{ ...FONTS.card_headers }} className="text-[#7D7D7D]">
                Total Unit
              </p>
            </div>
            <h1 style={{ ...FONTS.headers }} className="px-6">
              {formatIndianNumber(totalunit)}
            </h1>
          </section>
          <section
            className="w-[350px] shadow-[0px_0px_40px_0px_#9739E91A] rounded-xl py-1"
            style={{
              backgroundImage: `url(${Frame_2})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex items-center">
              <img
                src={Purple_Building}
                alt="Purp_build"
                className="w-[90px] h-[90px]"
              />
              <p style={{ ...FONTS.card_headers }} className="text-[#7D7D7D]">
                Total Occupancy
              </p>
            </div>
            <h1 style={{ ...FONTS.headers }} className="px-6">
              {formatIndianNumber(totalOccupied)}
            </h1>
          </section>

          <section
            className="w-[350px] shadow-[0px_0px_40px_0px_#9739E91A] rounded-xl py-1"
            style={{
              backgroundImage: `url(${Frame_3})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex items-center">
              <img
                src={Purple_Building}
                alt="Purp_build"
                className="w-[90px] h-[90px]"
              />
              <p style={{ ...FONTS.card_headers }} className="text-[#7D7D7D]">
                Total Vacant
              </p>
            </div>
            <h1 style={{ ...FONTS.headers }} className="px-6">
              {formatIndianNumber(totalVacant)}
            </h1>
          </section>
        </div>
      )}

      {/* Reports Components */}
      {activeBtn === "financial" && <FinancialReport />}
      {activeBtn === "occupancy" && <OccupancyReport />}
      {activeBtn === "tenant" && <TenantReport selectedType={selectedType} setSelectedType={setSelectedType}/>}
  

    </div>
  );
}

export default Reports;
