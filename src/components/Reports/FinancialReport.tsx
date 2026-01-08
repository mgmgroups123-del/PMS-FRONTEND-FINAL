import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { ChevronDown } from "lucide-react";
import { FONTS } from "../../constants/ui constants";
import ExpenseBreakdown from "./ExpenseChart";
import graphBuilding from "../../assets/Reports/graphBuilding.png";
import { useEffect, useMemo, useState } from "react";
import Purple_Building from "../../assets/Reports/purple_building.png";
import Frame_1 from "../../assets/image 315.png";
import { useSelector } from "react-redux";
import { selectDashboardData } from "../../features/Dashboard/Reducer/Selector";
import { getAllPropertiesReport } from "../../features/Properties/Services";
import { BsCircleFill } from "react-icons/bs";

/* ---------------- CONSTANTS ---------------- */

const MONTHS = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
];

/* ---------------- COMPONENT ---------------- */

const FinancialReport = () => {
  const ReportsData = useSelector(selectDashboardData);
  const { rentCollectionGraph }: any = ReportsData || {};

  const [properties, setProperties] = useState<any[]>([]);
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"Monthly" | "Yearly">("Monthly");
  const [selectedYear, setSelectedYear] = useState<string>("");

  /* ---------------- FETCH PROPERTY DATA ---------------- */

  useEffect(() => {
    (async () => {
      const res = await getAllPropertiesReport();
      setProperties(res?.data || []);
    })();
  }, []);

  /* ---------------- YEARS LIST ---------------- */

  const availableYears = useMemo(
    () => Object.keys(rentCollectionGraph?.monthly || {}),
    [rentCollectionGraph]
  );

  useEffect(() => {
    if (!selectedYear && availableYears.length) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears, selectedYear]);

  /* ---------------- FORMATTER ---------------- */

  const formatIndianNumber = (num: number) => {
    if (!num) return "₹ 0";
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} K`;
    return `₹ ${num}`;
  };

  /* ---------------- MONTHLY GRAPH DATA (ALWAYS 12 MONTHS) ---------------- */

  const monthlyRevenueData = useMemo(() => {
    return MONTHS.map(({ key, label }) => ({
      month: label,
      expense: Number(
        rentCollectionGraph?.monthly?.[selectedYear]?.[key]?.exp || 0
      ),
      revenue: Number(
        rentCollectionGraph?.monthly?.[selectedYear]?.[key]?.rev || 0
      ),
    }));
  }, [rentCollectionGraph, selectedYear]);

  /* ---------------- YEARLY GRAPH DATA ---------------- */

  const yearlyRevenueData = useMemo(() => {
    return Object.entries(rentCollectionGraph?.yearly || {}).map(
      ([year, values]: any) => ({
        year,
        expense: Number(values.exp || 0),
        revenue: Number(values.rev || 0),
      })
    );
  }, [rentCollectionGraph]);

  return (
    <div>
      <div className="flex gap-6">
        {/* LEFT SIDE */}
        <div className="w-full">
          {/* TOTAL REVENUE */}
          <section
            className="w-full flex flex-col shadow-[0px_0px_40px_0px_#9739E91A] rounded-xl py-3 my-10"
            style={{
              backgroundImage: `url(${Frame_1})`,
              backgroundSize: "cover",
            }}
          >
            <div className="flex items-center">
              <img src={Purple_Building} className="w-[90px] h-[90px]" />
              <p style={{ ...FONTS.card_headers }} className="text-[#7D7D7D]">
                Total Revenue
              </p>
            </div>
            <h1 style={{ ...FONTS.headers }} className="px-6">
              {formatIndianNumber(ReportsData?.totalMonthlyRevenue || 0)}
            </h1>
          </section>

          {/* REVENUE GRAPH */}
          <Card className="shadow-[0px_0px_15px_0px_#0000001A] border-0 rounded-lg mb-5">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={graphBuilding} className="h-[90px] w-[90px]" />
                <CardTitle style={{ ...FONTS.headers }}>
                  {selectedOption === "Monthly"
                    ? "Monthly Revenue Trend"
                    : "Yearly Revenue Trend"}
                </CardTitle>
              </div>

              {/* CONTROLS */}
              <div className="flex gap-3">
                {selectedOption === "Monthly" && (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border rounded-md px-3 py-1"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() =>
                    setSelectedOption((p) =>
                      p === "Monthly" ? "Yearly" : "Monthly"
                    )
                  }
                  className="bg-[#ed32371A] px-4 py-2 rounded-md text-[#ed3237]"
                >
                  {selectedOption}
                  <ChevronDown className="inline ml-2 w-4 h-4" />
                </button>
              </div>
            </CardHeader>

            <CardContent>
              <ChartContainer
                config={{
                  expense: { label: "Expense", color: "#EF5DA8" },
                  revenue: { label: "Revenue", color: "#7B00FF" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      selectedOption === "Monthly"
                        ? monthlyRevenueData
                        : yearlyRevenueData
                    }
                  >
                    <XAxis
                      dataKey={
                        selectedOption === "Monthly" ? "month" : "year"
                      }
                    />
                    <YAxis tickFormatter={formatIndianNumber} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(v) => formatIndianNumber(Number(v))}
                    />

                    <Area
                      dataKey="expense"
                      stroke="#EF5DA8"
                      strokeWidth={4}
                      fill="transparent"
                      dot
                    />
                    <Area
                      dataKey="revenue"
                      stroke="#7B00FF"
                      strokeWidth={4}
                      fill="transparent"
                      dot
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="flex justify-center gap-8 mt-4">
                <span className="flex items-center gap-2 text-[#EF5DA8]">
                  <BsCircleFill className="text-[8px]" /> Expense
                </span>
                <span className="flex items-center gap-2 text-[#7B00FF]">
                  <BsCircleFill className="text-[8px]" /> Revenue
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full">
          <ExpenseBreakdown />
        </div>
      </div>

      {/* PROPERTY PERFORMANCE (UNCHANGED) */}
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

        {properties?.map((data: any, index: number) => (
          <div
            key={index}
            className="shadow-[0px_0px_15px_0px_#0000001A] rounded-lg p-4 grid grid-cols-4"
          >
            <p style={{ ...FONTS.Table_Header }}>{data?.name}</p>
            <p className="text-[#7D7D7D]">{data?.total_units}</p>
            <p className="text-[#7D7D7D]">
              {formatIndianNumber(data?.revenue)}
            </p>
            <p className="text-[#7D7D7D]">{data?.occupancy_rate} %</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReport;
