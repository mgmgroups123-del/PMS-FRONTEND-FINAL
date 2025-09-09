import { Building2 } from "lucide-react";
import { useState } from "react";
import { FONTS } from "../../../constants/ui constants";
import Empty_Report from "../../../assets/Reports/Empty_Report.png";

interface OccupancyRateTrendProps {
  data?: Array<{ month: string; rate: number }>;
  highlightedPoint?: { month: string; rate: number };
}

export default function OccupancyRateTrend({
  data,
  highlightedPoint,
}: OccupancyRateTrendProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    month: string;
    rate: number;
    x: number;
    y: number;
  } | null>(null);

  const maxRate = 100;
  const chartWidth = 620;
  const chartHeight = 230;
  const padding = 30;

  const allMonths = [
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
  const completeData = data
    ? allMonths.map((month) => {
        const existingData = data.find((d) => d.month === month);
        return {
          month,
          rate: existingData ? existingData.rate : null,
        };
      })
    : [];

  const dataWithValues = completeData.filter((d) => d.rate !== null);

  const stepX = (chartWidth - padding * 2) / (allMonths.length - 1);

  const generatePath = () => {
    if (dataWithValues.length <= 1) return "";
    return dataWithValues
      .map((point, index) => {
        const monthIndex = allMonths.indexOf(point.month);
        const x = padding + monthIndex * stepX;
        const y =
          chartHeight -
          padding -
          (point.rate! / maxRate) * (chartHeight - padding * 2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const getPointPosition = (month: string, rate: number) => {
    const monthIndex = allMonths.indexOf(month);
    if (monthIndex === -1) return null;
    const x = padding + monthIndex * stepX;
    const y =
      chartHeight - padding - (rate / maxRate) * (chartHeight - padding * 2);
    return { x, y };
  };

  const highlightPosition = highlightedPoint
    ? getPointPosition(highlightedPoint.month, highlightedPoint.rate)
    : null;

  const handleMouseEnter = (
    point: { month: string; rate: number | null },
    x: number,
    y: number
  ) => {
    if (point.rate !== null) {
      setHoveredPoint({ month: point.month, rate: point.rate, x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const showNoData = !data || data.length === 0;

  return (
    <div className="p-2 rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] w-full border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#3A32D326]/15 shadow-lg">
          <div className="text-[#3A32D3]">
            <Building2 />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Occupancy Rate Trend
        </h3>
      </div>

      <div className="relative">
        {showNoData ? (
          <div className="w-full text-center py-10">
            <img
              src={Empty_Report}
              alt="EmptyImg"
              className="w-[60px] m-auto"
            />
            <h1 style={{ ...FONTS.large_card_subHeader }}>
              Occupancy Rate report
            </h1>
            <p style={{ ...FONTS.large_card_description3 }}>
              Detailed Occupancy Rate analytics and insights coming soon.
            </p>
          </div>
        ) : (
          // Chart
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            width="100%"
            height={chartHeight}
            preserveAspectRatio="xMidYMid meet"
            className="overflow-visible"
          >
            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <text
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
              </g>
            ))}

            {/* Main dashed line */}
            {dataWithValues.length > 1 && (
              <path
                d={generatePath()}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            )}

            {/* Data points */}
            {completeData.map((point, index) => {
              if (point.rate === null) return null;
              const x = padding + index * stepX;
              const y =
                chartHeight -
                padding -
                (point.rate / maxRate) * (chartHeight - padding * 2);

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      handleMouseEnter(
                        { month: point.month, rate: point.rate },
                        x,
                        y
                      )
                    }
                    onMouseLeave={handleMouseLeave}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#f97316"
                    stroke="white"
                    strokeWidth="2"
                    className="pointer-events-none"
                  />
                </g>
              );
            })}

            {/* Highlighted point */}
            {highlightPosition && (
              <>
                <circle
                  cx={highlightPosition.x}
                  cy={highlightPosition.y}
                  r="6"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="3"
                />
                <g>
                  <rect
                    x={highlightPosition.x - 25}
                    y={highlightPosition.y - 35}
                    width="50"
                    height="25"
                    rx="12"
                    fill="#f97316"
                  />
                  <text
                    x={highlightPosition.x}
                    y={highlightPosition.y - 18}
                    textAnchor="middle"
                    className="text-sm fill-white font-medium"
                  >
                    {highlightedPoint?.rate}%
                  </text>
                </g>
              </>
            )}

            {/* Hovered point */}
            {hoveredPoint && (
              <>
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="6"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="3"
                />
                <g>
                  <rect
                    x={hoveredPoint.x - 25}
                    y={hoveredPoint.y - 35}
                    width="50"
                    height="25"
                    rx="12"
                    fill="#f97316"
                  />
                  <text
                    x={hoveredPoint.x}
                    y={hoveredPoint.y - 18}
                    textAnchor="middle"
                    className="text-sm fill-white font-medium"
                  >
                    {hoveredPoint.rate}%
                  </text>
                </g>
              </>
            )}

            {/* X-axis labels */}
            {allMonths.map((month, index) => {
              const x = padding + index * stepX;
              const hasData = completeData[index].rate !== null;
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className={`text-xs ${
                    hasData ? "fill-gray-600 font-medium" : "fill-gray-400"
                  }`}
                >
                  {month}
                </text>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
