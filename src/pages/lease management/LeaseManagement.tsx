import { useEffect, useState } from "react"
import { Search, Eye, Building2, Clock, FileX, Shield, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import cardimg1 from "../../assets/image 315.png"
// import cardimg2 from "../../assets/image 315.png"
// import cardimg3 from "../../assets/image 315.png"
// import cardimg4 from "../../assets/image 315.png"
// import man from "../../assets/Ellipse 276.png"
import { Leaseviewform } from "../../components/LeaseManagement/Leaseviewform"
import { useDispatch, useSelector } from "react-redux"
import { selectLeasemanagement } from "../../features/Leasemanagement/reducer/selector"
import { getAllLeasemanagementThunk } from "../../features/Leasemanagement/reducer/thunks"

interface LeaseData {
  id: string
  name: string
  unit: string
  avatar: string
  period: string
  duration: string
  rent: string
  deposit: string
  status: string
  expiry: string
  expiryNote: string
  email?: string
  phone?: string
  address?: string
  propertyType?: string
  propertyName?: string
  paymentStatus?: string
  maintenanceCharge?: string
  emergencyContact?: {
    name: string
    phone: string
    relation: string
  }
  bankDetails?: {
    accountNumber: string
    bankName: string
    ifscCode: string
    accountHolderName: string
  }
}

function LeaseManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showLeaseForm, setShowLeaseForm] = useState(false)
  const [selectedLease, setSelectedLease] = useState<LeaseData | null>(null)

  const dispatch = useDispatch<any>();
  const LeasemanagementData = useSelector(selectLeasemanagement)
  const Leases = LeasemanagementData?.Leases || []
  const statsData = LeasemanagementData || {}

  useEffect(() => {
    dispatch(getAllLeasemanagementThunk({}));
  }, [dispatch]);

  const handleViewLease = (lease: LeaseData) => {
    setSelectedLease(lease)
    setShowLeaseForm(true)
  }

  const handleCloseForm = () => {
    setShowLeaseForm(false)
    setSelectedLease(null)
  }


  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  const getDaysDifference = (dateString: string) => {
    if (!dateString) return 0
    const targetDate = new Date(dateString)
    const currentDate = new Date()
    const timeDiff = targetDate.getTime() - currentDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff
  }


  const getExpiryNote = (endDate: string) => {
    if (!endDate) return "N/A"
    const daysDiff = getDaysDifference(endDate)
    if (daysDiff < 0) {
      return `Expired ${Math.abs(daysDiff)} Days Ago`
    } else if (daysDiff === 0) {
      return "Expires Today"
    } else if (daysDiff <= 30) {
      return `Expires in ${daysDiff} Days`
    } else {
      return `${daysDiff} Days Remaining`
    }
  }


  const transformedLeaseData: LeaseData[] = Leases.filter(
    (lease: any) => lease._id && lease._id !== null
  ).map((lease: any) => {
    const unit = lease.unit
    const personalInfo = lease.personal_information
    const leaseDuration = lease.lease_duration

    let duration = "N/A"
    let period = "N/A"

    if (leaseDuration?.start_date && leaseDuration?.end_date) {
      const start = new Date(leaseDuration.start_date)
      const end = new Date(leaseDuration.end_date)

      if (start.getTime() === end.getTime()) {
        const actualEnd = new Date(start)
        actualEnd.setFullYear(actualEnd.getFullYear() + 1)
        period = `${formatDate(leaseDuration.start_date)} - ${formatDate(actualEnd.toISOString())}`
        duration = "1Yr"
      } else {
        period = `${formatDate(leaseDuration.start_date)} - ${formatDate(leaseDuration.end_date)}`
        const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
        duration = monthsDiff >= 12 ? `${Math.floor(monthsDiff / 12)}Yr` : `${monthsDiff}Mth`
      }
    }

    const formattedDeposit =
      lease.deposit != null
        ? `₹${Number(lease.deposit).toLocaleString("en-IN")}`
        : "N/A"

    return {
      id: lease._id || lease.uuid,
      name: personalInfo?.full_name || "No Name",
      unit: `${unit?.unit_name || unit?.land_name || "N/A"}`,
      avatar: "",
      period,
      duration,
      rent:
        lease.rent != null
          ? `₹${Number(lease.rent).toLocaleString("en-IN")}`
          : "N/A",
      deposit: formattedDeposit,
      status: lease.is_active ? "Active" : "Inactive",
      expiry: leaseDuration?.end_date
        ? formatDate(leaseDuration.end_date)
        : "N/A",
      expiryNote: leaseDuration?.end_date
        ? getExpiryNote(leaseDuration.end_date)
        : "N/A",
      email: personalInfo?.email,
      phone: personalInfo?.phone,
      address: personalInfo?.address,

      propertyType: unit?.unit_type || "Not Available",
      propertyName: unit?.land_name || "Not Available",

      paymentStatus: "Not Available",

      maintenanceCharge:
        lease.financial_information?.maintenance != null
          ? `₹${Number(
            lease.financial_information.maintenance
          ).toLocaleString("en-IN")}`
          : "Not Available",

      emergencyContact: {
        name: lease.emergency_contact?.name || "Not Available",
        phone: lease.emergency_contact?.phone || "Not Available",
        relation: lease.emergency_contact?.relation || "Not Available",
      },

      bankDetails: {
        accountNumber: lease.bank_details?.account_number || "Not Available",
        bankName: lease.bank_details?.bank_name || "Not Available",
        ifscCode: lease.bank_details?.bank_IFSC || "Not Available",
        accountHolderName:
          personalInfo?.full_name || "Not Available",
      },
    }
  })

  const formatIndianNumber = (num: number | string): string => {
    if (typeof num !== "number") {
      const parsed = Number(num);
      if (isNaN(parsed)) return String(num);
      num = parsed;
    }

    if (num >= 10000000) {
      return (num / 10000000).toFixed(1).replace(/\.0$/, "") + " Cr";
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1).replace(/\.0$/, "") + " L";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + " K";
    }
    return String(num);
  };

  const activeLeasesCount = transformedLeaseData.filter(lease => lease.status === 'Active').length

  const cardData = [
    {
      id: 1,
      title: "Active Leases",
      value: (statsData.activeLeases !== undefined ? statsData.activeLeases : activeLeasesCount).toString(),
      icon: Building2,
      iconBgColor: "bg-red-500",
      gradient: "from-yellow-100 via-orange-50 to-yellow-50",
      backgroundImage: "",
    },
    {
      id: 2,
      title: "Expiring Soon",
      value: (statsData.expiringSoonThisMonth || 0).toString(),
      icon: Clock,
      iconBgColor: "bg-orange-500",
      gradient: "from-pink-100 via-red-50 to-pink-50",
      backgroundImage: "",
    },
    {
      id: 3,
      title: "Expired",
      value: (statsData.expiredLeases || 0).toString(),
      icon: FileX,
      iconBgColor: "bg-blue-500",
      gradient: "from-green-100 via-teal-50 to-green-50",
      backgroundImage: "",
    },
    {
      id: 4,
      title: "Security Deposits",
      value: formatIndianNumber(statsData.totalDepositAmount),
      icon: Shield,
      iconBgColor: "bg-red-600",
      gradient: "from-red-100 via-pink-50 to-red-50",
      backgroundImage: "",
    },
  ]

  const filteredLeaseData = transformedLeaseData.filter((lease) => {
    const matchesSearch =
      lease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.rent.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || lease.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const resetSearch = () => {
    setSearchTerm('');
  };


  return (
    <div className="min-h-screen p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lease</h1>
            <p className="text-gray-600 mt-1">Manage Tenant Leases And Agreements</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card) => {
            const IconComponent = card.icon
            return (
              <Card key={card.id} className="relative overflow-hidden shadow-md border w-[298px] h-[127px]">


                <div className="absolute inset-0 bg-white opacity-30"></div>

                <CardContent className="relative h-full flex flex-col justify-between pb-5">
                  <div className="flex items-center gap-3 ">
                    <div className={`p-2  ${card.iconBgColor} rounded-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[20px] font-medium text-gray-700">{card.title}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 pt-4">{card.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md  items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 w-[19px] h-[19px] mt-2" />
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 w-[80%] bg-[#ed32370d] border-[#ed32370d] text-[#333333] placeholder-[#333333] rounded-lg focus-visible:ring-[#000] focus-visible:border-[#000]"
            />
            {searchTerm && (
              <button
                onClick={resetSearch}
                className='absolute right-24 top-7 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:ring-[#000] focus-visible:border-[#000]'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] bg-[#ed32371A]/5 border-gray-300   rounded-lg h-10 text-red-600 font-medium hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-gray-400 ">
              <SelectValue>
                <span className="text-red-600">
                  {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="all" className="text-gray-700 hover:bg-[#ed32371A]/5">
                All Status
              </SelectItem>
              <SelectItem value="active" className="text-gray-700 hover:bg-[#ed32371A]/5">
                Active
              </SelectItem>
              <SelectItem value="expired" className="text-gray-700 hover:bg-[#ed32371A]/5">
                Expired
              </SelectItem>
              <SelectItem value="terminated" className="text-gray-700 hover:bg-[#ed32371A]/5">
                Terminated
              </SelectItem>
              <SelectItem value="renewed" className="text-gray-700 hover:bg-[#ed32371A]/5">
                Renewed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-lg border rounded-2xl overflow-hidden ">
          <CardContent className="pl-3 pr-3 ">
            <div className="border shadow-md rounded-xl mb-[30px] overflow-hidden ">

              <div className="overflow-x-auto ">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[25%]" />
                    <col className="w-[20%]" />
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                    <col className="w-[15%]" />
                    <col className="w-[10%]" />
                  </colgroup>
                  <thead>
                    <tr className="text-left ">
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Tenant & Unit</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Leases Period</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Rent & Deposit</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Expiry</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            <div className="space-y-6 ">
              {filteredLeaseData.length > 0 ? (
                filteredLeaseData.map((lease) => (
                  <div
                    key={lease.id}
                    className="border shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow "
                  >
                    <div className="overflow-x-auto ">
                      <table className="w-full table-fixed ">
                        <colgroup>
                          <col className="w-[25%]" />
                          <col className="w-[20%]" />
                          <col className="w-[18%]" />
                          <col className="w-[12%]" />
                          <col className="w-[15%]" />
                          <col className="w-[10%]" />
                        </colgroup>
                        <tbody>
                          <tr className="hover:bg-gray-50 transition-colors ">
                            <td className="px-6 py-4  ">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={lease.avatar || "/placeholder.svg"} alt={lease.name} />
                                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                                    {lease.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{lease.name}</p>
                                  <p className="text-xs text-gray-500">{lease.unit}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{lease.period}</p>
                              <p className="text-xs text-gray-500">Duration: {lease.duration}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900 font-medium">{lease.rent}</p>
                              <p className="text-sm text-green-600 font-medium">Deposit: {formatIndianNumber(lease.deposit)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={
                                  lease.status === "Active"
                                    ? "bg-[#0D35D41A]/10 text-blue-700 border border-blue-200 font-medium px-3 py-1 rounded-lg "
                                    : "bg-[#EE2F2F1A]/10 text-red-700 border border-red-200 font-medium px-3 py-1 rounded-lg"
                                }
                              >
                                {lease.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{lease.expiry}</p>
                              <p className="text-xs text-gray-500">{lease.expiryNote}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                                  onClick={() => handleViewLease(lease)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 h-8 w-8"
                                >
                                  <Download className="w-4 h-4" />
                                </Button> */}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No leases found matching your search criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {showLeaseForm && selectedLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-md" onClick={handleCloseForm} />

          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <Leaseviewform leaseData={selectedLease} onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaseManagement