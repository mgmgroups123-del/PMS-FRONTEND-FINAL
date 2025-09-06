export interface RentItem {
  uuid: string;
  tenantId: Tenant;
  paymentDueDay: string;
  status: string;
  bankDetails: string;
}

export interface Tenant {
  personal_information: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
  };
  rent: string;
  unit_number: number;
  security_deposit: string;
  lease_start_date: string;
  lease_end_date: string;
  emergency_contact: string;
}


export const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-[#1CAF191A] border-[#1CAF19] text-[#1CAF19]";
      case "Pending":
        return "bg-[#FFC3001A] border-[#FFC300] text-[#FFC300]";
      case "Overdue":
        return "bg-[#E212691A] border-[#E21269] text-[#E21269]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };