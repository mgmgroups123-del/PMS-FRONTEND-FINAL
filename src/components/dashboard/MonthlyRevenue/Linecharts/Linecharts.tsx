import React, { useRef, useEffect } from "react";
import { Building2, ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Empty_Report from "../../../../assets/Reports/Empty_Report.png";
import { FONTS } from "../../../../constants/ui constants";

interface DataPoint {
  month: string;
  year: number;
  revenue: number;
  expenses: number;
}

// Format numbers in ₹ with K / L / Cr
const formatIndianCurrency = (num: number) => {
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
  return `₹ ${num}`;
};

const MonthlyRevenueTrendLine: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2025 + 1 }, (_, i) => 2025 + i);

  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = data.filter((item) => item.year === selectedYear);
  const total = filteredData.reduce((sum, entry) => sum + entry.revenue + entry.expenses, 0) || 0;

  // Custom tooltip showing both revenue and expenses
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const revenue = payload.find((p: any) => p.dataKey === "revenue")?.value || 0;
      const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value || 0;

      return (
        <div className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium">
          <p>Revenue: {formatIndianCurrency(revenue)}</p>
          <p>Expenses: {formatIndianCurrency(expenses)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-3 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 shadow-sm">
            <Building2 className="text-blue-500 h-5 w-5" />
          </div>
          <h2 className="font-semibold text-lg text-gray-800">Monthly Revenue Trend</h2>
        </div>

        {/* Custom Year Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm min-w-[100px]"
          >
            {selectedYear}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 py-2">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedYear === year ? "font-semibold text-blue-500" : ""
                  }`}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart or No Data */}
      {!filteredData.length || total === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1 py-10">
          <img src={Empty_Report} alt="EmptyImg" className="w-[80px] mb-4" />
          <h1 style={{ ...FONTS.large_card_subHeader }}>Monthly Revenue Trend</h1>
          <p style={{ ...FONTS.large_card_description3, textAlign: "center" }}>
            Monthly revenue details will appear once available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={310}>
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => formatIndianCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <Line type="monotone" dataKey="revenue" stroke="#36ACD3" strokeWidth={5} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#B200FF" strokeWidth={5} dot={false} name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyRevenueTrendLine;
