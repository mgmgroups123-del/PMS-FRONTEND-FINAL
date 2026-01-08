import React, { useRef, useEffect, useMemo, useState } from "react";
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

/* -------------------- TYPES -------------------- */
interface ApiResponse {
  year: number;
  month: number; // 1 - 12
  total: number;
}

interface ChartData {
  year: number;
  month: string;
  monthIndex: number;
  revenue: number;
}

/* -------------------- CONSTANTS -------------------- */
const MONTHS = [
  { name: "Jan", index: 1 },
  { name: "Feb", index: 2 },
  { name: "Mar", index: 3 },
  { name: "Apr", index: 4 },
  { name: "May", index: 5 },
  { name: "Jun", index: 6 },
  { name: "Jul", index: 7 },
  { name: "Aug", index: 8 },
  { name: "Sep", index: 9 },
  { name: "Oct", index: 10 },
  { name: "Nov", index: 11 },
  { name: "Dec", index: 12 },
];

/* -------------------- HELPERS -------------------- */
const formatIndianCurrency = (num: number) => {
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
  return `₹ ${num}`;
};

/* -------------------- COMPONENT -------------------- */
const MonthlyRevenueTrendLine: React.FC<{ data: ApiResponse[] }> = ({ data }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* -------- SAFE DATA -------- */
  const safeData = Array.isArray(data) ? data : [];

  /* -------- AVAILABLE YEARS -------- */
  const years = useMemo(() => {
    return [...new Set(safeData.map((d) => d.year))].sort();
  }, [safeData]);

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* -------- UPDATE YEAR ON DATA CHANGE -------- */
  useEffect(() => {
    if (years.length && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  /* -------- CLOSE DROPDOWN -------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------- BUILD 12 MONTH DATA -------- */
  const chartData: ChartData[] = useMemo(() => {
    return MONTHS.map((m) => {
      const record = safeData.find(
        (d) => d.year === selectedYear && d.month === m.index
      );

      return {
        year: selectedYear,
        month: m.name,
        monthIndex: m.index,
        revenue: record?.total || 0,
      };
    });
  }, [safeData, selectedYear]);

  const totalValue = chartData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  /* -------- TOOLTIP -------- */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-black text-white px-3 py-2 rounded-lg text-sm">
          <p>Revenue: {formatIndianCurrency(payload[0]?.value || 0)}</p>
        </div>
      );
    }
    return null;
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="p-3 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] w-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
            <Building2 className="text-blue-500 h-5 w-5" />
          </div>
          <h2 className="font-semibold text-lg text-gray-800">
            Monthly Revenue Trend
          </h2>
        </div>

        {/* YEAR FILTER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm"
          >
            {selectedYear}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg z-50">
              {years.map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    year === selectedYear
                      ? "font-semibold text-blue-500"
                      : ""
                  }`}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CHART / EMPTY */}
      {totalValue === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <img src={Empty_Report} alt="Empty" className="w-[80px] mb-4" />
          <h1 style={FONTS.large_card_subHeader}>
            Monthly Revenue Trend
          </h1>
          <p
            style={{
              ...FONTS.large_card_description3,
              textAlign: "center",
            }}
          >
            No revenue recorded for this year.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={310}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={formatIndianCurrency}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#36ACD3"
              strokeWidth={4}
              dot={false}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyRevenueTrendLine;
