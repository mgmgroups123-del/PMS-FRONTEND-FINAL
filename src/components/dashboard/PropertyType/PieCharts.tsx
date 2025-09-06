import { Building2 } from "lucide-react";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Empty_Report from "../../../assets/Reports/Empty_Report.png";
import { FONTS } from "../../../constants/ui constants";

interface PropertyTypesDistributionProps {
  data: { name: string; value: number; color: string }[];
}

const PropertyTypesDistribution: React.FC<PropertyTypesDistributionProps> = ({
  data,
}) => {
  const total = data?.reduce((sum, entry) => sum + entry.value, 0) || 0;
  let cumulativeAngle = 90;
  const minThickness = 20;
  const maxThickness = 45;

  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name, fill } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const lineX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const lineY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

    return (
      <g>
        <line
          x1={lineX}
          y1={lineY}
          x2={x}
          y2={y}
          stroke={fill}
          strokeWidth={1}
        />
        <text
          x={x}
          y={y}
          fill={fill}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          {name} : {percentage}%
        </text>
      </g>
    );
  };

  const renderLegend = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: 10,
      }}
    >
      {data.map((entry, index) => {
        const percentage =
          total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 12px",
              fontSize: "14px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                backgroundColor: entry.color,
                marginRight: 6,
                borderRadius: "2px",
              }}
            />
            {entry.name} : {percentage}%
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-[2px_2px_5px_rgba(0,0,0,0.25)] p-4 w-full h-85 flex flex-col">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#FF7B0026]/15 shadow-lg">
          <div className="text-[#FF7B00]">
            <Building2 />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Property Types Distribution
        </h3>
      </div>

      {/* Chart or No Data */}
      {!data || data.length === 0 || total === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1">
          <img src={Empty_Report} alt="EmptyImg" className="w-[80px] mb-4" />

          <h1 style={{ ...FONTS.large_card_subHeader }}>
            Property Types report
          </h1>
          <p style={{ ...FONTS.large_card_description3, textAlign: "center" }}>
            Data on property types will be displayed once available.
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              {data.map((entry, index) => {
                const thickness =
                  (entry.value / total) * (maxThickness - minThickness) +
                  minThickness;

                const angle = (entry.value / total) * 360;
                const startAngle = cumulativeAngle;
                const endAngle = cumulativeAngle - angle;
                cumulativeAngle = endAngle;

                const innerRadius = 70 - thickness / 2;
                const outerRadius = innerRadius + thickness;

                return (
                  <Pie
                    key={index}
                    data={[{ value: entry.value, name: entry.name }]}
                    dataKey="value"
                    nameKey="name"
                    startAngle={startAngle}
                    endAngle={endAngle}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    stroke="none"
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    <Cell fill={entry.color} />
                  </Pie>
                );
              })}
              <Tooltip formatter={(value) => `${value}`} />
            </PieChart>
          </ResponsiveContainer>
          {renderLegend()}
        </>
      )}
    </div>
  );
};

export default PropertyTypesDistribution;
