import { Building2 } from "lucide-react";
import Card1 from "../../components/dashboard/Card1/Card1";
import Card2 from "../../components/dashboard/Card2/Card2";
import frame1 from "../../assets/image 315.png";
import frame2 from "../../assets/image 315.png";
import frame3 from "../../assets/image 315.png";
import MonthlyRevenueTrendBar from "../../components/dashboard/MonthlyRevenue/BarCharts/Barcharts";
import MonthlyRevenueTrendLine from "../../components/dashboard/MonthlyRevenue/Linecharts/Linecharts";
import OccupancyRateTrend from "../../components/dashboard/OccRate/RateLineCharts";
import PropertyTypesDistribution from "../../components/dashboard/PropertyType/PieCharts";
import RentCollectionRate from "../../components/dashboard/RentChart/Tooltip";
import ActivityTabs, {
  type ActivityItem,
} from "../../components/dashboard/RecentActivity&task/Activity&task";
import RadialChart from "../../components/dashboard/PaymentCharts/RadicalChart";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import { DashboardThunks } from "../../features/Dashboard/Reducer/DashboardThunk";
import { selectDashboardData } from "../../features/Dashboard/Reducer/Selector";
import LoadingOverlay from "../../components/Loading/Loading";
import { getallactivity } from "../../features/settings/service";

// Types
export interface PropertyTotal {
  _id: string;
  count: number;
}

export interface OccupancyGraph {
  _id: {
    month: number;
    year: number;
  };
  occupiedCount: number;
  month: number;
  year: number;
  occupancyRate: number;
}

export interface RentCollectionMonthly {
  [month: string]: {
    exp: number;
    rev: number;
  };
}

export interface RentCollectionYearly {
  exp: number;
  rev: number;
}

export interface RentCollectionGraph {
  monthly: RentCollectionMonthly;
  yearly: RentCollectionYearly;
}

export interface DashboardData {
  PropertiesTotal: PropertyTotal[];
  totalTenants: number;
  newTenantsThisMonth: number;
  leasesExpiringSoon: number;
  totalMonthlyRevenue: number;
  totalExpected: number;
  collectionRate: string;
  YearlyRevenue: number;
  OverAllRevenue: number;
  totalMonthlyPending: number;
  monthlyRevenueGraph: any[];
  yearlyRevenueGraph: any[];
  occupancyGraph: OccupancyGraph[];
  paymentStatusBreakdownGraph: any[];
  rentCollectionGraph: RentCollectionGraph;
}

export interface DashboardApiResponse {
  data: DashboardData;
}

const DashBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const dashboardData = useSelector(selectDashboardData);
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchAllActivity = async () => {
      const response = await getallactivity({});
      setActivityData(response?.data || []);
    };
    fetchAllActivity();
  }, []);

  useEffect(() => {
    dispatch(DashboardThunks());

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (loading) {
    return <LoadingOverlay />;
  }

  const totalProperties =
    dashboardData?.PropertiesTotal?.reduce(
      (sum: number, property: PropertyTotal) => sum + (property.count || 0),
      0
    ) || 0;

  const formatIndianCurrency = (value: number): string => {
    if (value === 0) return "₹0";
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const processedOccupancyGraph =
    dashboardData?.occupancyGraph?.map((item: OccupancyGraph) => ({
      ...item,
      occupancyRate: Number(item.occupancyRate.toFixed(1)),
    })) || [];

  const mergedPaymentStatus = (() => {
    const statusMap: Record<string, number> = {};

    dashboardData?.paymentStatusBreakdownGraph?.forEach((item: any) => {
      const key =
        item._id.toLowerCase() === "overdue"
          ? "Overdue"
          : item._id.charAt(0).toUpperCase() + item._id.slice(1);
      statusMap[key] = (statusMap[key] || 0) + item.count;
    });

    return Object.entries(statusMap).map(([name, value], index) => ({
      name,
      value,
      fill: ["#E800DC", "#006AFF", "#FF008C"][index % 3],
    }));
  })();

  const isValidRentCollectionGraph = (
    graph: any
  ): graph is RentCollectionGraph => {
    return (
      graph &&
      typeof graph === "object" &&
      graph.monthly &&
      typeof graph.monthly === "object" &&
      graph.yearly &&
      typeof graph.yearly === "object"
    );
  };

  const rentCollectionData = (() => {
    if (
      !dashboardData?.rentCollectionGraph ||
      !isValidRentCollectionGraph(dashboardData.rentCollectionGraph)
    ) {
      return [];
    }

    const monthlyData = dashboardData.rentCollectionGraph.monthly;
    return Object.entries(monthlyData).map(([monthKey, values]) => {
      const { exp, rev } = values as { exp: number; rev: number };
      const monthName = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
      const paid = rev || 0;
      const totalExpected = exp || 0;
      const pending = Math.max(totalExpected - paid, 0);
      return { month: monthName, paid, pending };
    });
  })();

  const monthlyRevenueData = (() => {
    if (
      !dashboardData?.rentCollectionGraph ||
      !isValidRentCollectionGraph(dashboardData.rentCollectionGraph)
    ) {
      return [];
    }

    const monthlyData = dashboardData.rentCollectionGraph.monthly;
    return Object.entries(monthlyData).map(([monthKey, values]) => {
      const { exp, rev } = values as { exp: number; rev: number };
      return {
        month: monthKey.charAt(0).toUpperCase() + monthKey.slice(1),
        year: new Date().getFullYear(),
        revenue: rev || 0,
        expenses: exp || 0,
      };
    });
  })();

  const yearlyRevenueData = (() => {
    if (
      !dashboardData?.rentCollectionGraph ||
      !isValidRentCollectionGraph(dashboardData.rentCollectionGraph)
    ) {
      return [];
    }

    const startYear = 2022;
    const currentYear = new Date().getFullYear();

    const apiYear = currentYear.toString();
    const yearlyData = dashboardData.rentCollectionGraph.yearly;

    const merged = [];
    for (let y = startYear; y <= currentYear + 1; y++) {
      merged.push({
        year: y.toString(),
        revenue: y.toString() === apiYear ? yearlyData.rev || 0 : 0,
        netIncome: y.toString() === apiYear ? yearlyData.exp || 0 : 0,
      });
    }

    return merged;
  })();

  const formatPercent = (value: number) => `${Number(value).toFixed(1)}%`;

  return (
    <div className="p-3 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[#000000] font-semibold text-2xl">Dashboard</h3>
          <p className="text-[#7D7D7D]">
            Welcome back! Latest property insights.

          </p>
        </div>
      </div>

      {/* Card 1 */}
      <div className="grid grid-cols-5 gap-6">
        <Card1
          title="Total Properties"
          value={totalProperties}
          subText={`${totalProperties} Properties`}
          percentage={8.2}
          icon={<Building2 />}
          iconBg="bg-[#3065A426]/15"
          iconTextColor="text-[#3065A4]"
        />
        <Card1
          title="Total Tenants"
          value={dashboardData?.totalTenants || 0}
          subText={`${dashboardData?.collectionRate || "0%"} Collection Rate`}
          percentage={3.1}
          icon={<Building2 />}
          iconBg="bg-[#EB821826]/15"
          iconTextColor="text-[#EB8218]"
        />
        <Card1
          title="Total Revenue"
          value={formatIndianCurrency(dashboardData?.OverAllRevenue || 0)}
          subText="All Time"
          percentage={15.2}
          icon={<Building2 />}
          iconBg="bg-[#2FAD8D26]/15"
          iconTextColor="text-[#2FAD8D]"
        />
        <Card1
          title="Monthly Revenue"
          value={formatIndianCurrency(dashboardData?.totalMonthlyRevenue || 0)}
          subText="This Month"
          percentage={8.3}
          icon={<Building2 />}
          iconBg="bg-[#E500FF26]/15"
          iconTextColor="text-[#ed3237]"
        />
        <Card1
          title="Monthly Pending"
          value={formatIndianCurrency(dashboardData?.totalMonthlyPending || 0)}
          subText="This Month"
          percentage={-8.2}
          icon={<Building2 />}
          iconBg="bg-[#FE2F591A]/10"
          iconTextColor="text-[#FE2F59]"
        />
      </div>

      {/* Card 2 */}
      <div className="grid grid-cols-3 gap-6">
        <Card2
          bgImage={frame1}
          icon={<Building2 />}
          title="New Tenants"
          subText="This Month"
          value={dashboardData?.newTenantsThisMonth || 0}
          iconBg="bg-[#ed323726]/15"
          iconTextColor="text-[#ed3237]"
        />
        <Card2
          bgImage={frame2}
          icon={<Building2 />}
          title="Leases Expiring Soon"
          subText="This Month"
          value={dashboardData?.leasesExpiringSoon || 0}
          iconBg="bg-[#FFBF0026]/15"
          iconTextColor="text-[#FFBF00]"
        />
        <Card2
          bgImage={frame3}
          icon={<Building2 />}
          title="Occupancy Rate"
          subText="This Month"
          value={formatPercent(
            processedOccupancyGraph?.[0]?.occupancyRate || 0
          )}
          iconBg="bg-[#3091EB26]/15"
          iconTextColor="text-[#3091EB]"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyRevenueTrendLine data={monthlyRevenueData} />
        <MonthlyRevenueTrendBar data={yearlyRevenueData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OccupancyRateTrend
          data={
            processedOccupancyGraph.map((item) => ({
              month: new Date(0, item.month - 1).toLocaleString("default", {
                month: "short",
              }),
              rate: item.occupancyRate,
            })) || []
          }
        />
        <PropertyTypesDistribution
          data={
            dashboardData?.PropertiesTotal?.map((property, index) => ({
              name:
                property._id.charAt(0).toUpperCase() + property._id.slice(1),
              value: property.count,
              color: ["#06B6D4", "#EC4899", "#EF4444", "#8B5CF6", "#FACC15"][
                index % 5
              ],
            })) || []
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RadialChart data={mergedPaymentStatus} />
        <RentCollectionRate data={rentCollectionData} />
      </div>

      {/* Activity Tabs */}
      <ActivityTabs activityData={activityData} />
    </div>
  );
};

export default DashBoard;
