import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useSelector } from "react-redux";
import { selectDashboardData } from "../../features/Dashboard/Reducer/Selector";
import { FONTS } from "../../constants/ui constants";
import pyBuilding from "../../assets/Reports/pyBuilding.png";
import { ChevronDown } from "lucide-react";
import Purple_Building from "../../assets/Reports/purple_building.png";
import Frame_2 from "../../assets/image 315.png";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];

// Format number in Indian style with ₹ K / L / Cr
const formatIndianCurrency = (num: number) => {
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
  return `₹ ${num}`;
};

const ExpenseBreakdown: React.FC = () => {
  const ReportsData = useSelector(selectDashboardData);
  const maintenanceExpenseGraph = ReportsData?.maintenanceExpenseGraph?.[0];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Monthly");

  const options = ["Monthly", "Yearly"];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const expenseData = useMemo(() => {
    const monthlyData = maintenanceExpenseGraph?.monthly || [];
    const monthMap: Record<number, number> = {};
    monthlyData.forEach((item: any) => {
      monthMap[item._id.month] = item.totalMonthlyExpense;
    });

    return months.map((m, i) => ({
      month: m,
      maintenance: monthMap[i + 1] || 0,
    }));
  }, [maintenanceExpenseGraph]);

  const expenseYearData = useMemo(() => {
    const dummyYears = [
      { year: "2021", maintenance: 0 },
      { year: "2022", maintenance: 0 },
      { year: "2023", maintenance: 0 },
      { year: "2024", maintenance: 0 },
    ];

    const apiYears = (maintenanceExpenseGraph?.yearly || []).map((item: any) => ({
      year: item._id.year.toString(),
      maintenance: item.totalYearlyExpense,
    }));

    return [...dummyYears, ...apiYears];
  }, [maintenanceExpenseGraph]);

  const currentData =
    selectedOption.toLowerCase() === "monthly" ? expenseData : expenseYearData;

  const totalExpense = currentData.reduce(
    (sum, item) => sum + (item.maintenance || 0),
    0
  );

  return (
    <div>
      {/* Top Card */}
      <section
        className="w-full flex flex-col justify-center shadow-[0px_0px_40px_0px_#9739E91A] rounded-xl py-3 my-10"
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
            Total Expenses
          </p>
        </div>
        <h1 style={{ ...FONTS.headers }} className="px-6">
          {formatIndianCurrency(totalExpense)}
        </h1>
      </section>

      {/* Chart Container */}
      <div className="bg-white rounded-lg shadow-[0px_0px_15px_0px_#0000001A] p-2 h-[437px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={pyBuilding}
              alt="pyBuilding"
              className="h-[90px] w-[90px]"
            />
            <h3 style={{ ...FONTS.headers }}>Expense Breakdown</h3>
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
                className={`ml-2 w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        </div>

        {/* Chart */}
        <div className="flex h-full items-center justify-center w-full">
          <ResponsiveContainer width="95%" height="100%">
            <BarChart data={currentData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={selectedOption.toLowerCase() === "monthly" ? "month" : "year"}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={formatIndianCurrency}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                formatter={(val: any) => formatIndianCurrency(val)}
              />
              <Bar dataKey="maintenance" fill="#FF6B2C" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
