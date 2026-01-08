import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { FONTS } from "../../../constants/ui constants";
import Empty_Report from "../../../assets/Reports/Empty_Report.png";

interface OccupancyRateTrendProps {
  data?: {
    year: number;
    month: number; // 1–12
    occupancyRate: number;
  }[];
}

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export default function OccupancyRateTrend({ data }: OccupancyRateTrendProps) {
  /* ---------------- Years ---------------- */
  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(d => d.year))].sort((a, b) => b - a);
  }, [data]);

  const [selectedYear, setSelectedYear] = useState<number>(
    years[0] ?? new Date().getFullYear()
  );

  /* ---------------- Normalize Data ---------------- */
  const completeData = useMemo(() => {
    if (!data) return [];

    const yearData = data.filter(d => d.year === selectedYear);

    return MONTHS.map((monthLabel, index) => {
      const found = yearData.find(d => d.month === index + 1);
      return {
        month: monthLabel,
        rate: found ? Math.round(found.occupancyRate) : null,
      };
    });
  }, [data, selectedYear]);

  const dataWithValues = completeData.filter(d => d.rate !== null);

  const showNoData = dataWithValues.length === 0;

  /* ---------------- Chart constants ---------------- */
  const maxRate = 100;
  const chartWidth = 620;
  const chartHeight = 230;
  const padding = 30;
  const stepX = (chartWidth - padding * 2) / (MONTHS.length - 1);

  const generatePath = () => {
    if (dataWithValues.length <= 1) return "";
    return dataWithValues
      .map((point, index) => {
        const monthIndex = MONTHS.indexOf(point.month);
        const x = padding + monthIndex * stepX;
        const y =
          chartHeight -
          padding -
          (point.rate! / maxRate) * (chartHeight - padding * 2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className="p-2 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] w-full border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3A32D326]/15 shadow-lg">
            <div className="text-[#3A32D3]">
              <Building2 />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Occupancy Rate Trend
          </h3>
        </div>

        {/* Year Filter */}
        {years.length > 1 && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}
      </div>

      {/* Chart / Empty */}
      {showNoData ? (
        <div className="w-full text-center py-10">
          <img src={Empty_Report} alt="EmptyImg" className="w-[60px] m-auto" />
          <h1 style={{ ...FONTS.large_card_subHeader }}>
            Occupancy Rate report
          </h1>
          <p style={{ ...FONTS.large_card_description3 }}>
            Detailed Occupancy Rate analytics and insights coming soon.
          </p>
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height={chartHeight}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map(value => (
            <text
              key={value}
              x={padding - 10}
              y={
                chartHeight -
                padding -
                (value / maxRate) * (chartHeight - padding * 2) +
                4
              }
              textAnchor="end"
              className="text-xs fill-gray-400"
            >
              {value}
            </text>
          ))}

          {/* Path */}
          <path
            d={generatePath()}
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* Points */}
          {completeData.map((point, index) => {
            if (point.rate === null) return null;

            const x = (padding + 10) + index * stepX;
            const y =
              chartHeight -
              padding -
              (point.rate / maxRate) * (chartHeight - padding * 2);

            return (
              <g key={index}>
                <circle cx={x} cy={y} r="4" fill="#f97316" />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-700"
                >
                  {point.rate}%
                </text>
              </g>
            );
          })}

          {/* X-axis */}
          {MONTHS.map((month, index) => (
            <text
              key={month}
              x={(padding + 10) + index * stepX}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {month}
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}
