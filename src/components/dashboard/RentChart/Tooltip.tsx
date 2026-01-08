import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Building2 } from "lucide-react";
import Empty_Report from "../../../assets/Reports/Empty_Report.png";
import { FONTS } from "../../../constants/ui constants";

interface RentCollectionRateProps {
  data: {
  monthly: {
    [year: number]: {
      [month: string]: {
        exp: number;
        rev: number;
        pending: number;
      };
    };
  };
};
}

const MONTHS = [
  "jan","feb","mar","apr","may","jun",
  "jul","aug","sep","oct","nov","dec"
];

const MONTH_LABELS: Record<string, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr",
  may: "May", jun: "Jun", jul: "Jul", aug: "Aug",
  sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

const RentCollectionRate: React.FC<RentCollectionRateProps> = ({ data }) => {
  /* ---------------- Available Years ---------------- */
  const monthly = data?.monthly
  const years = useMemo(
    () => Object.keys(monthly).map(Number).sort((a, b) => b - a),
    [monthly]
  );

  const [selectedYear, setSelectedYear] = useState<number>(years[0]);

  /* ---------------- Build Chart Data ---------------- */
  const chartData = useMemo(() => {
    if (!monthly[selectedYear]) return [];

    return MONTHS.map((month) => ({
      month: MONTH_LABELS[month],
      paid: monthly[selectedYear][month]?.rev ?? 0,
      pending: monthly[selectedYear][month]?.pending ?? 0,
    }));
  }, [monthly, selectedYear]);

  const total = useMemo(
    () =>
      chartData.reduce(
        (sum, item) => sum + item.paid + item.pending,
        0
      ),
    [chartData]
  );

  const formatIndianNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} k`;
    return num.toString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#289A9A26]/15 shadow-lg">
            <Building2 className="text-[#289A9A]" />
          </div>
          <h2 className="font-semibold text-lg">Rent Collection Rate</h2>
        </div>

        {/* Year Filter */}
        {years.length > 1 && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm cursor-pointer"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chart / Empty */}
      {total === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1 py-10">
          <img src={Empty_Report} alt="EmptyImg" className="w-[80px] mb-4" />
          <h1 style={{ ...FONTS.large_card_subHeader }}>Rent Collection</h1>
          <p style={{ ...FONTS.large_card_description3, textAlign: "center" }}>
            Rent collection data will appear once available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barSize={30}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatIndianNumber}
            />
            <Tooltip formatter={(v: number) => formatIndianNumber(v)} />
            <Legend />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="#45B38A"
              radius={[0, 0, 20, 20]}
            />
            <Bar
              dataKey="paid"
              stackId="a"
              fill="#82D8A2"
              radius={[20, 20, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RentCollectionRate;
