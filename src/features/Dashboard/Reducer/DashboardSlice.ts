import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PropertyTotal {
  _id: string;
  count: number;
}

interface OccupancyGraph {
  _id: {
    month: number;
    year: number;
  };
  occupiedCount: number;
  month: number;
  year: number;
  occupancyRate: number;
}

interface MonthlyRent {
  exp: number;
  rev: number;
}

interface RentCollectionGraph {
  monthly: {
    jan: MonthlyRent;
    feb: MonthlyRent;
    mar: MonthlyRent;
    apr: MonthlyRent;
    may: MonthlyRent;
    jun: MonthlyRent;
    jul: MonthlyRent;
    aug: MonthlyRent;
    sep: MonthlyRent;
    oct: MonthlyRent;
    nov: MonthlyRent;
    dec: MonthlyRent;
  };
  yearly: {
    exp: number;
    rev: number;
  };
}

interface MaintenanceExpenseMonthly {
  _id: {
    year: number;
    month: number;
  };
  totalMonthlyExpense: number;
}

interface MaintenanceExpenseYearly {
  _id: {
    year: number;
  };
  totalYearlyExpense: number;
}

interface MaintenanceExpenseGraph {
  monthly: MaintenanceExpenseMonthly[];
  yearly: MaintenanceExpenseYearly[];
}

interface DashboardData {
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
  maintenanceExpenseGraph: MaintenanceExpenseGraph[];
}

interface DashboardState {
  data: DashboardData | null;
}

const initialState: DashboardState = {
  data: null,
};

const DashboardSlice = createSlice({
  name: "DashboardSlice",
  initialState,
  reducers: {
    dashboarddata: (state, action: PayloadAction<DashboardData>) => {
      state.data = action.payload;
    },
  },
});

export const { dashboarddata } = DashboardSlice.actions;
export default DashboardSlice.reducer;
