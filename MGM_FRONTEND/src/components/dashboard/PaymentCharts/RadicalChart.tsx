import { Building2 } from "lucide-react";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  PolarAngleAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Empty_Report from "../../../assets/Reports/Empty_Report.png";
import { FONTS } from "../../../constants/ui constants";

interface RadialChartProps {
  data: { name: string; value: number; fill: string }[];
}

const RadialChart: React.FC<RadialChartProps> = ({ data }) => {
  const total = data?.reduce((sum, entry) => sum + entry.value, 0) || 0;

  return (
    <div className="w-full flex flex-col rounded-lg shadow-[2px_2px_5px_rgba(0,0,0,0.25)] p-4 justify-center bg-transparent">
      {/* Title Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#289A9A26]/15 shadow-lg">
            <div className="text-[#289A9A]">
              <Building2 />
            </div>
          </div>
          <h2 className="font-semibold text-lg">Payment Status Distribution</h2>
        </div>
        <div
          className="mb-4 text-[#7D7D7D] "
          style={{ ...FONTS.headers_description }}
        >
          <p>This Month</p>
        </div>
      </div>

      {/* Chart or No Data */}
      {!data || data.length === 0 || total === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1">
          <img src={Empty_Report} alt="EmptyImg" className="w-[80px] mb-4" />

          <h1 style={{ ...FONTS.large_card_subHeader }}>
            Payment status report
          </h1>
          <p
            style={{
              ...FONTS.large_card_description3,
              textAlign: "center",
            }}
          >
            Payment status details will appear once available.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={15}
              data={data}
              startAngle={90}
              endAngle={-1070}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar dataKey="value" cornerRadius={10}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>

              <Tooltip />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RadialChart;
