import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { ChevronDown } from "lucide-react";
import { FONTS } from "../../constants/ui constants";
import ExpenseBreakdown from "./ExpenseChart";
import graphBuilding from "../../assets/Reports/graphBuilding.png";
import { useState } from "react";
import Purple_Building from "../../assets/Reports/purple_building.png";
import Frame_1 from "../../assets/image 315.png";
import { useSelector } from "react-redux";
import { selectDashboardData } from "../../features/Dashboard/Reducer/Selector";
import { selectProperties } from "../../features/Properties/Reducers/Selectors";

const FinancialReport = () => {
  const ReportsData = useSelector(selectDashboardData);
  const properties = useSelector(selectProperties);
  const { rentCollectionGraph }: any = ReportsData || {};

  const revenueData = [
    {
      month: "Jan",
      expense: rentCollectionGraph?.monthly?.jan?.exp,
      revenue: rentCollectionGraph?.monthly?.jan?.rev,
    },
    {
      month: "Feb",
      expense: rentCollectionGraph?.monthly?.feb?.exp,
      revenue: rentCollectionGraph?.monthly?.feb?.rev,
    },
    {
      month: "Mar",
      expense: rentCollectionGraph?.monthly?.mar?.exp,
      revenue: rentCollectionGraph?.monthly?.mar?.rev,
    },
    {
      month: "Apr",
      expense: rentCollectionGraph?.monthly?.apr?.exp,
      revenue: rentCollectionGraph?.monthly?.apr?.rev,
    },
    {
      month: "May",
      expense: rentCollectionGraph?.monthly?.may?.exp,
      revenue: rentCollectionGraph?.monthly?.may?.rev,
    },
    {
      month: "Jun",
      expense: rentCollectionGraph?.monthly?.jun?.exp,
      revenue: rentCollectionGraph?.monthly?.jun?.rev,
    },
    {
      month: "Jul",
      expense: rentCollectionGraph?.monthly?.jul?.exp,
      revenue: rentCollectionGraph?.monthly?.jul?.rev,
    },
    {
      month: "Aug",
      expense: rentCollectionGraph?.monthly?.aug?.exp,
      revenue: rentCollectionGraph?.monthly?.aug?.rev,
    },
    {
      month: "Sep",
      expense: rentCollectionGraph?.monthly?.sep?.exp,
      revenue: rentCollectionGraph?.monthly?.sep?.rev,
    },
    {
      month: "Oct",
      expense: rentCollectionGraph?.monthly?.oct?.exp,
      revenue: rentCollectionGraph?.monthly?.oct?.rev,
    },
    {
      month: "Nov",
      expense: rentCollectionGraph?.monthly?.nov?.exp,
      revenue: rentCollectionGraph?.monthly?.nov?.rev,
    },
    {
      month: "Dec",
      expense: rentCollectionGraph?.monthly?.dec?.exp,
      revenue: rentCollectionGraph?.monthly?.dec?.rev,
    },
  ];

  const revenueYearData = [
    { year: "2021", expense: 50, revenue: 45 },
    { year: "2022", expense: 55, revenue: 50 },
    { year: "2023", expense: 60, revenue: 55 },
    { year: "2024", expense: 65, revenue: 60 },
    {
      year: "2025",
      expense: rentCollectionGraph?.yearly?.exp,
      revenue: rentCollectionGraph?.yearly?.rev,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Monthly");
  const options = ["Monthly", "Yearly"];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const formatIndianNumber = (num: any) => {
    if (!num) return "₹ 0";
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
    return `₹ ${num}`;
  };

  return (
    <div>
      <div className=" my-6 flex gap-6">
        {/* Graph Data  */}
        <div className="w-full ">
          <section
            className="w-full flex flex-col justify-center shadow-[0px_0px_40px_0px_#9739E91A] rounded-xl  py-3 my-10"
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
                Total Revenue
              </p>
            </div>
            <h1 style={{ ...FONTS.headers }} className="px-6">
              {formatIndianNumber(ReportsData?.totalMonthlyRevenue)}
            </h1>
          </section>

          {/* Revenue Chart */}
          <Card className=" shadow-[0px_0px_15px_0px_#0000001A] border-0 pt-0 rounded-lg">
            <CardHeader className="flex items-center justify-between pl-0">
              <div className="flex items-center">
                <img
                  src={graphBuilding}
                  alt="pyBuilding"
                  className="h-[90px] w-[90px]"
                />
                <CardTitle style={{ ...FONTS.headers }}>
                  {selectedOption === "Monthly"
                    ? "Monthly Revenue Trend"
                    : "Yearly Revenue Trend"}
                </CardTitle>
              </div>

              {/* Dropdown */}
              <div className="relative">
                <button
                  className="bg-[#ed32371A] px-4 py-2 rounded-md flex items-center justify-between text-[#ed3237]"
                  style={{ ...FONTS.button_Text }}
                  onClick={toggleDropdown}
                >
                  {selectedOption}
                  <ChevronDown
                    className={`ml-2 w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
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
            </CardHeader>

            <CardContent>
              <ChartContainer
                config={{
                  expense: { label: "Expense", color: "#EF5DA8" },
                  revenue: { label: "Revenue", color: "#7B00FF" },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      selectedOption.toLowerCase() === "monthly"
                        ? revenueData
                        : revenueYearData
                    }
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                  >
                    <XAxis
                      dataKey={
                        selectedOption.toLowerCase() === "monthly"
                          ? "month"
                          : "year"
                      }
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 14 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 14 }}
                      dx={-10}
                      tickFormatter={(val) => formatIndianNumber(val)}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{
                        stroke: "rgba(0,0,0,0.1)",
                        strokeWidth: 10,
                        strokeLinecap: "round",
                      }}
                      formatter={(val: any) => formatIndianNumber(val)} // ✅ Add ₹ formatting
                    />

                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#EF5DA8"
                      strokeWidth={5}
                      fill="transparent"
                      dot={false}
                      activeDot={{ r: 6, fill: "#EF5DA8" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#7B00FF"
                      strokeWidth={5}
                      fill="transparent"
                      dot={false}
                      activeDot={{ r: 6, fill: "#7B00FF" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          <ExpenseBreakdown />
        </div>
      </div>

      {/* Property Table */}
      <div className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-3 grid gap-6">
        <h1 style={{ ...FONTS.chart_Header }}>Property Performance</h1>

        <div
          style={{ ...FONTS.Table_Header }}
          className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-4"
        >
          <p>Property</p>
          <p>Units</p>
          <p>Revenue</p>
          <p>Occupancy</p>
        </div>

        {properties.map((data: any, index: any) => (
          <div
            key={index}
            className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-4"
          >
            <p style={{ ...FONTS.Table_Header }}>{data?.property_name}</p>
            <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
              {data?.total_units}
            </p>
            <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
               {formatIndianNumber(data?.property_revenue)}
            </p>
            <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
              {data?.occupancy_rate} %
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReport;
