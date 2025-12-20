import React from "react";
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
  data: { month: string; paid: number; pending: number }[];
}

const RentCollectionRate: React.FC<RentCollectionRateProps> = ({ data }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const mergedData = months.map((m) => {
    const found = data?.find((d) => d.month === m);
    return found || { month: m, paid: 0, pending: 0 };
  });

  const total = mergedData.reduce(
    (sum, entry) => sum + entry.paid + entry.pending,
    0
  );

  // Format numbers as k, L, Cr
  const formatIndianNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} k`;
    return num.toString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#289A9A26]/15 shadow-lg">
          <div className="text-[#289A9A]">
            <Building2 />
          </div>
        </div>
        <h2 className="font-semibold text-lg">Rent Collection Rate</h2>
      </div>

      {/* Chart or No Data */}
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
          <BarChart data={mergedData} barSize={30}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatIndianNumber}
            />
            <Tooltip formatter={(value: number) => formatIndianNumber(value)} />
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
