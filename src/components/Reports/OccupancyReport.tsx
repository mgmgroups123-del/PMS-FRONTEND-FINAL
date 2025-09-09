import { FONTS } from "../../constants/ui constants";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import Buildings from "../../assets/Reports/buildings.png";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectOccReport } from "../../features/OccupancyReport/Reducers/Selector";
import { loadOccReport } from "../../features/OccupancyReport/Reducers/OccreportThunk";
import { selectProperties } from "../../features/Properties/Reducers/Selectors";

const chartConfig = {
  occupancy: {
    label: "Occupancy",
    color: "#ed3237",
  },
};
const formatIndianCurrency = (num: any) => {
  if (!num) return "₹ 0";
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
  return `₹ ${num}`;
};

const OccupancyReport = () => {
  const properties = useSelector(selectProperties);
  const dispatch = useDispatch<any>();
  const occReportData = useSelector(selectOccReport);

  useEffect(() => {
    dispatch(loadOccReport());
  }, [dispatch]);

  const chartData =
    occReportData?.monthlyTrend.map((item: any) => ({
      month: new Date(item.year, item.month - 1).toLocaleString("default", {
        month: "short",
      }),
      occupancy: item.occupancyRate,
    })) || [];

  // const propertyPerformance = occReportData
  //   ? [
  //       {
  //         property_name: "Overall",
  //         total_units: occReportData.overall.totalUnits,
  //         property_revenue: "-",
  //         occupancy_rate: occReportData.overall.occupancyRate,
  //       },
  //     ]
  //   : [];

  return (
    <div>
      {/* Occupancy Trend Chart */}
      <div className="my-6 shadow-[0px_0px_15px_0px_#0000001A] rounded-lg">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center ">
              <img src={Buildings} alt="btn" className="h-[80px] w-[80px]" />
              <CardTitle style={{ ...FONTS.headers }}>
                Occupancy Trend
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="occupancyGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ed3237" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#ed3237"
                        stopOpacity={0.07}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value}%`, "Occupancy"]}
                        labelStyle={{ color: "#374151" }}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#ed3237"
                    strokeWidth={5}
                    fill="url(#occupancyGradient)"
                    dot={false}
                    activeDot={{ r: 6, stroke: "#FFFFFF", strokeWidth: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance Table */}
      <div className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-3 grid gap-6">
        <h1 style={{ ...FONTS.chart_Header }}>Property Performance</h1>

        <div
          style={{ ...FONTS.Table_Header }}
          className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-4"
        >
          <p>Property</p>
          <p>Units</p>
          <p>Revenue</p>
          <p>Occupancy</p>
        </div>

        {properties.map((data: any, index: any) => (
          <div
            key={index}
            className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-4"
          >
            <p style={{ ...FONTS.Table_Header }}>{data?.property_name}</p>
            <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
              {data?.total_units}
            </p>
            <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
              {formatIndianCurrency(data?.property_revenue)}
            </p>

            <p style={{ ...FONTS.Table_Body_2 }} className="text-[#7D7D7D]">
              {data?.occupancy_rate} %
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccupancyReport;
