import React from "react";
import { Building2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Empty_Report from "../../../../assets/Reports/Empty_Report.png";
import { FONTS } from "../../../../constants/ui constants";

interface DataPoint {
  year: string;
  revenue: number;
  netIncome: number;
}

// Format numbers in ₹ with K / L / Cr
const formatIndianCurrency = (num: number) => {
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
  return `₹ ${num}`;
};

const MonthlyRevenueTrendBar: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const total =
    data?.reduce((sum, entry) => sum + entry.revenue + entry.netIncome, 0) || 0;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#ed323726]/15 shadow-lg">
          <div className="text-[#ed3237]">
            <Building2 />
          </div>
        </div>
        <h2 className="font-semibold text-lg">Yearly Revenue Growth</h2>
      </div>

      {/* Chart or No Data */}
      {!data || data.length === 0 || total === 0 ? (
        <div className=" flex-1 flex  flex-col justify-center items-center  py-10">
          <img src={Empty_Report} alt="EmptyImg" className="w-[80px] mb-4" />
          <h1 style={{ ...FONTS.large_card_subHeader }}>Yearly Revenue Growth</h1>
          <p style={{ ...FONTS.large_card_description3, textAlign: "center" }}>
            Monthly revenue details will appear once available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={20}>
            <defs>
              <pattern
                id="diagonalStripes"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="6" stroke="#ECC5FD" strokeWidth="2" />
              </pattern>
            </defs>

            <XAxis dataKey="year" tick={true} axisLine={false} tickLine={false} />
            <YAxis
              tick={true}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatIndianCurrency}
            />

            <Tooltip
              formatter={(value: number) => formatIndianCurrency(value)}
            />

            <Bar
              dataKey="revenue"
              fill="url(#diagonalStripes)"
              radius={[10, 10, 0, 0]}
              name="Revenue"
            />
            <Bar
              dataKey="netIncome"
              fill="#ed3237"
              radius={[10, 10, 0, 0]}
              name="Net Income"
            />

            <Legend verticalAlign="bottom" height={36} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlyRevenueTrendBar;
