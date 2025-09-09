import { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select';
import {
	Phone,
	Mail,
	// DollarSign,
	X,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import AddTenantForm from '../../components/tenants/create-tenant-form';
import EditTenantForm from '../../components/tenants/edit-tenant-form';
import ViewTenantModal from '../../components/tenants/view-tenant-modal';
import trash from '../../assets/properties/trash.png';
import edit from '../../assets/properties/edit.png';
import searchImg from '../../assets/properties/search.png';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '../../components/ui/dialog';
import cardimg1 from '../../assets/image 313.png';
import cardimg2 from '../../assets/image 313.png';
import cardimg3 from '../../assets/image 313.png';
import cardimg4 from '../../assets/image 313.png';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTenantData } from '../../features/tenants/reducers/Thunks';
import { tenantSelector } from '../../features/tenants/reducers/Selector';
import { deleteTenants } from '../../features/tenants/services';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/card';
import { GetLocalStorage } from '../../utils/localstorage';

interface Tenant {
	id: string;
	uuid: string;
	personal_information: {
		full_name: string;
		email: string;
		phone: string;
		address: string;
	};
	lease_duration: {
		start_date: string;
		end_date: string;
	};
	emergency_contact: {
		name: string;
		phone: string;
		relation: string;
	};
	tenant_type: string;
	unit: {
		unit_name: string;
	};
	rent: string;
	deposit: string;
	financial_information: {
		rent: string;
		cgst: string;
		sgst: string;
		tds: string;
		maintenance: string;
	};
	bank_details: {
		bank_name: string;
		account_number: string;
		bank_branch: string;
		bank_IFSC: string;
	};
	is_active: boolean;
	is_deleted: boolean;
}

export default function Tenants() {
	const [showForm, setShowForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);
	const { data, loading, error } = useSelector(tenantSelector);
	const [selectedType, setSelectedType] = useState<string>('All Types');
	const dispatch = useDispatch<any>();
	const rowsPerPageOptions = [5, 10, 15];

	const [pagination, setPagination] = useState({
		currentPage: 1,
		rowsPerPage: 5,
		totalPages: 1,
		totalRecords: 1,
	});

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

	const stats = [
		{
			label: 'Total Tenants',
			value: data?.totalRecords?.toString() || '0',
			bgColor: 'bg-orange-100',
			circleColor1: 'bg-orange-200',
			circleColor2: 'bg-orange-300',
			backgroundimage: cardimg1,
		},
		{
			label: 'Paid this Month',
			value: formatIndianNumber(data?.paidThisMonth?.length) || '0',
			bgColor: 'bg-red-100',
			circleColor1: 'bg-red-200',
			circleColor2: 'bg-red-300',
			backgroundimage: cardimg2,
		},
		{
			label: 'Pending Payments',
			value: formatIndianNumber(data?.pendingThisMonth?.length) || '0',
			bgColor: 'bg-green-100',
			circleColor1: 'bg-green-200',
			circleColor2: 'bg-green-300',
			backgroundimage: cardimg3,
		},
		{
			label: 'Overdue',
			value: data?.overDueThisMonth?.length.toString() || '0',
			bgColor: 'bg-pink-100',
			circleColor1: 'bg-pink-200',
			circleColor2: 'bg-pink-300',
			backgroundimage: cardimg4,
		},
	];

	const handleEditTenant = (tenant: Tenant) => {
		setSelectedTenant(tenant);
		setShowEditForm(true);
	};

	const handleDeleteClick = (tenant: Tenant) => {
		setIsDeleteModalOpen(true);
		setTenantToDelete(tenant);
	};

	const handleConfirmDelete = async () => {
		if (tenantToDelete) {
			try {
				const response = await deleteTenants({ uuid: tenantToDelete?.uuid });
				if (response) {
					toast.success('Tenant deleted successfully!');
					fetchTenants();
					setIsDeleteModalOpen(false);
					setTenantToDelete(null);
				}
			} catch (error) {
				toast.error('Failed to delete tenant');
			}
		}
	};

	const handleViewTenant = (tenant: Tenant) => {
		setSelectedTenant(tenant);
		setShowViewModal(true);
	};

	const resetSearch = () => {
		setSearchTerm('');
	};

	const fetchTenants = async () => {
		try {
			const response = await dispatch(
				getAllTenantData({
					page: pagination.currentPage,
					limit: pagination.rowsPerPage,
				})
			);

			if (response) {
				setPagination((prev) => ({
					...prev,
					totalPages: response.data.totalPages,
					totalRecords: response.data.totalRecords,
				}));
			}
		} catch (error) {
			toast.error('Failed to fetch tenants');
		}
	};

	useEffect(() => {
		fetchTenants();
	}, [
		pagination.currentPage,
		pagination.rowsPerPage,
		searchTerm,
		selectedType,
	]);

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, currentPage: page }));
	};

	const handleRowsPerPageChange = (newRowsPerPage: number) => {
		setPagination((prev) => ({
			...prev,
			rowsPerPage: newRowsPerPage,
			currentPage: 1,
		}));
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 p-8'>Loading tenants...</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 p-8'>Error loading tenants</div>
		);
	}

	const filteredTenants = data?.tenants?.filter((tenant: any) => {
		const typeMatch =
			selectedType === 'All Types' ||
			tenant.tenant_type.toLowerCase() === selectedType.toLowerCase();

		const searchMatch =
			searchTerm === '' ||
			tenant.personal_information.full_name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

		return typeMatch && searchMatch;
	});

	const getItemClassName = (value: string) => {
		const baseClasses = 'hover:bg-[#B200FF] hover:text-white mb-0.5';
		const selectedClasses =
			selectedType === value ? 'bg-[#B200FF] text-white' : '';
		return `${baseClasses} ${selectedClasses}`;
	};


	const role = GetLocalStorage("role")

	return (
		<div className='min-h-screen bg-gray-50 p-3'>
			<div className=''>
				{/* Header */}
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-2xl font-bold mb-2'>Tenants</h1>
						<p className='text-gray-600'>Manage your property tenants</p>
					</div>
					<Button
						onClick={() => { role === 'admin' || role === 'manager' ? undefined : setShowForm(true) }}
						className={`hover:bg-[#ed3237] bg-red-700 text-white px-6 py-2 focus-visible:ring-[#000] focus-visible:border-[#000] ${role === 'admin' || role === 'manager' ? `bg-red-700 opacity-50 cursor-not-allowed` : ``}`}
					>
						+ Add Tenant
					</Button>
				</div>

				<AddTenantForm
					isOpen={showForm}
					onClose={() => setShowForm(false)}
					fetchTenants={fetchTenants}
				/>

				<EditTenantForm
					isOpen={showEditForm}
					tenant={selectedTenant}
					onClose={() => {
						setSelectedTenant(null);
						setShowEditForm(false);
					}}
					fetchTenants={fetchTenants}
				/>

				<ViewTenantModal
					isOpen={showViewModal}
					tenant={selectedTenant}
					onClose={() => {
						setSelectedTenant(null);
						setShowViewModal(false);
					}}
				/>

				{/* Stats Cards */}
				<div className='grid grid-cols-4 gap-6 mb-8'>
					{stats?.map((stat, index) => (
						<div
							key={index}
							className={`${stat.bgColor} rounded-xl p-6 relative overflow-hidden`}
						>
							<div className='flex items-center justify-between relative z-10'>
								<div>
									<p className='text-gray-600 text-sm mb-1'>{stat.label}</p>
									<p className='text-3xl font-bold'>{stat.value}</p>
								</div>
							</div>
							<div
								className='absolute inset-0 bg-no-repeat bg-[length:150%] opacity-35'
								style={{
									backgroundImage: `url('${stat.backgroundimage}')`,
									backgroundPosition:
										stat.backgroundimage === cardimg1
											? '100px 10px'
											: stat.backgroundimage === cardimg2
												? '-162px -130px'
												: stat.backgroundimage === cardimg3
													? '-340px -110px'
													: stat.backgroundimage === cardimg4
														? '-192px -150px'
														: '10px 10px',
									transform:
										stat.backgroundimage === cardimg2
											? 'rotate(180deg)'
											: stat.backgroundimage === cardimg3
												? 'rotate(180deg)'
												: stat.backgroundimage === cardimg4
													? 'rotate(180deg)'
													: 'none',
									backgroundSize:
										stat.backgroundimage === cardimg2
											? '110%'
											: stat.backgroundimage === cardimg3
												? '185%'
												: stat.backgroundimage === cardimg4
													? '140%'
													: 'none',
								}}
							></div>
						</div>
					))}
				</div>

				{/* Search and Filter */}
				<div className='flex gap-4 justify-between mb-6'>
					<div className='relative max-w-md flex-1 '>
						<img
							src={searchImg}
							className='absolute left-3 top-7 transform -translate-y-1/2 text-gray-400 w-4 h-4'
						/>
						<Input
							placeholder='Search by tenant name'
							className='pl-10 h-10 w-[80%] bg-[#ed32370d] border-[#ed32370d] text-[#333333] placeholder-[#333333] rounded-lg focus-visible:ring-[#000] focus-visible:border-[#000]'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
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
					<Select value={selectedType} onValueChange={setSelectedType}>
						<SelectTrigger className='w-48 border-gray-200 bg-[#ed3237] text-white '>
							<SelectValue placeholder='All Types' />
						</SelectTrigger>
						<SelectContent className='bg-white'>
							<SelectItem
								value='All Types'
								className={getItemClassName('All Types')}
							>
								All Types
							</SelectItem>
							<SelectItem value='rent' className={getItemClassName('rent')}>
								Rent
							</SelectItem>
							<SelectItem value='lease' className={getItemClassName('lease')}>
								Lease
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Tenant Cards */}
				<div className='grid grid-cols-2 gap-6'>
					{filteredTenants?.length ? (
						filteredTenants?.map((tenant: any) => {
							const daysRemaining = tenant?.lease_duration?.end_date
								? Math.ceil(
									(new Date(tenant?.lease_duration?.end_date).getTime() -
										Date.now()) /
									(1000 * 60 * 60 * 24)
								)
								: 0;
							const avatar = tenant?.personal_information?.full_name
								.split(' ')
								.map((n: any) => n[0])
								.join('')
								.toUpperCase()
								.slice(0, 2);

							return (
								<div
									key={tenant.uuid}
									className='bg-white border border-gray-100 shadow-sm p-6 rounded-lg'
								>
									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm'>
												{avatar}
											</div>
											<div>
												<h3 className='font-semibold'>
													{tenant?.personal_information?.full_name}
												</h3>
												<p className='text-gray-500 text-xs'>
													{tenant?.unit?.unit_name}
												</p>
											</div>
										</div>
										<div className='flex gap-1'>
											<div
												className={`w-8 h-8 bg-[#0062ff] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors ${role === 'admin' || role === 'manager' ? `bg-[#0062ff] opacity-50 cursor-not-allowed` : ``}`}
												onClick={() => { role === 'admin' || role === 'manager' ? undefined : handleEditTenant(tenant) }}
											>
												<img src={edit} className='w-4 h-4 text-white' />
											</div>
											<div
												className={`w-8 h-8 bg-[#ee2f2f] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors ${role === 'owner' ? `` : `bg-[#ee2f2f] opacity-50 cursor-not-allowed`}`}
												onClick={() => { role === 'owner' ? handleDeleteClick(tenant) : undefined }}
											>
												<img src={trash} className='w-4 h-4 text-white' />
											</div>
										</div>
									</div>

									<div className='flex justify-between mb-4'>
										<div className='flex gap-3'>
											<div className='flex items-center gap-2 text-xs text-gray-600'>
												<Mail className='w-3 h-3' />
												{tenant.personal_information.email}
											</div>
											<div className='flex items-center gap-2 text-xs text-gray-600'>
												<Phone className='w-3 h-3' />
												{tenant.personal_information.phone}
											</div>
										</div>
									</div>

									<div
										className={`grid ${tenant?.tenant_type === 'rent'
												? 'grid-cols-3'
												: 'grid-cols-2'
											} gap-3 mb-4`}
									>
										{tenant?.tenant_type === 'rent' ? (
											<>
												<div className='bg-blue-50 p-3 rounded-lg'>
													<div className='flex items-center gap-2 mb-1'>
														<div className='w-5 h-5 bg-blue-100 rounded flex items-center justify-center'>
															₹
														</div>
														<p className='text-xs text-gray-600'>
															Monthly Rent
														</p>
													</div>
													<p className='font-bold ml-8 text-lg text-[#006aff]'>
														₹
														{Number(
															tenant?.financial_information?.rent
														).toLocaleString()}
													</p>
												</div>
												<div className='bg-yellow-50 p-3 rounded-lg relative'>
													<div className='flex items-center gap-2 mb-1'>
														<div className='w-5 h-5 bg-yellow-100 rounded flex items-center justify-center'>
															₹
														</div>
														<p className='text-xs text-[#c9c61e]'>
															Total Monthly Rent
														</p>
													</div>
													<p className='font-bold ml-8 text-lg text-[#c9c61e]'>
														₹{Number(tenant?.rent).toLocaleString()}
													</p>
													<span
														className=' text-black font-normal absolute bottom-1.5 right-1.5'
														style={{ fontSize: '8px' }}
													>
														{' '}
														(include GST)
													</span>
												</div>
												{/* <div className='bg-yellow-50 p-3 rounded-lg relative'>
													<div className='flex items-center gap-2 mb-1'>
														<div className='w-5 h-5 bg-yellow-100 rounded flex items-center justify-center'>
															<FiCalendar/>
														</div>
														<p className='text-xs text-[#c9c61e]'>
															Monthly Due Date
														</p>
													</div>
													<p className='font-bold ml-8 text-lg text-[#c9c61e]'>
														{tenant?.lease_duration?.due_date}
													</p>
												</div> */}
											</>
										) : (
											<>
												<div className='bg-blue-50 p-3 rounded-lg'>
													<div className='flex items-center gap-2 mb-1'>
														<div className='w-5 h-5 bg-blue-100 rounded flex items-center justify-center'>
															₹
														</div>
														<p className='text-xs text-gray-600'>
															Maintenance Charge
														</p>
													</div>
													<p className='font-bold ml-8 text-lg text-[#006aff]'>
														₹
														{Number(
															tenant?.financial_information?.maintenance
														).toLocaleString()}
													</p>
												</div>
											</>
										)}
										<div className='bg-green-50 p-3 rounded-lg'>
											<div className='flex items-center gap-2 mb-1'>
												<div className='w-5 h-5 bg-green-100 rounded flex items-center justify-center'>
													₹
												</div>
												<p className='text-xs text-[#1ec95a]'>
													Security Deposit
												</p>
											</div>
											<p className='font-bold ml-8 text-lg text-[#1ec95a]'>
												₹{Number(tenant.deposit).toLocaleString()}
											</p>
										</div>
									</div>

									<div className='mb-4'>
										<div className='flex justify-between items-center mb-2'>
											<span className='text-xs text-gray-600'>
												{tenant?.tenant_type === 'rent' ? 'Rent' : 'Lease'}{' '}
												Duration
											</span>
											<span className='text-xs text-gray-600 ml-20'>
												Monthly due date
											</span>
											<span className='text-xs text-gray-600'>
												Days Remaining
											</span>
										</div>

										<div className='flex justify-between items-center mb-2'>
											<p className='text-lg font-bold text-gray-700'>
												{new Date(
													tenant.lease_duration.start_date
												).toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												})}{' '}
												-{' '}
												{new Date(
													tenant?.lease_duration?.end_date
												).toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												})}
											</p>
											<p className='text-xl font-bold text-[#e1ee2f] mt-1'>{tenant?.lease_duration?.due_date}</p>
											<p className='text-xl font-bold text-[#ee2f2f] mt-1'>
												{daysRemaining > 0
													? `${daysRemaining} Days`
													: 'Expired'}
											</p>
										</div>
									</div>

									<div className='mb-4 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl'>
										<p className='text-[#ee2f2f] text-lg font-medium mb-1'>
											Emergency
										</p>
										<div className='flex justify-between'>
											<p className='text-xs font-bold'>
												{tenant.emergency_contact.name}
											</p>
											<p className='text-xs text-gray-500'>
												{tenant.emergency_contact.phone}
											</p>
										</div>
									</div>

									<Button
										onClick={() => handleViewTenant(tenant)}
										className='w-full bg-red-600 hover:bg-[#ed3237] text-white'
									>
										View
									</Button>
								</div>
							);
						})
					) : (
						<div className='col-span-2'>
							<Card className='bg-white border-0 shadow-lg hover:shadow-lg transition-shadow p-8 text-center'>
								<p className='text-lg'>
									No tenants found matching your criteria
								</p>
							</Card>
						</div>
					)}
				</div>

				{data?.tenants?.length > 0 && (
					<div className='flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4'>
						<div className='flex items-center gap-2'>
							<span className='text-sm text-[#7D7D7D]'>Rows per page:</span>
							<Select
								value={pagination.rowsPerPage.toString()}
								onValueChange={(value) =>
									handleRowsPerPageChange(Number(value))
								}
							>
								<SelectTrigger className='border-gray-200 bg-white focus-visible:ring-[#000] focus-visible:border-[#000]'>
									<SelectValue
										placeholder={pagination.rowsPerPage.toString()}
									/>
								</SelectTrigger>
								<SelectContent className='bg-white'>
									{rowsPerPageOptions.map((option) => (
										<SelectItem
											key={option}
											value={option.toString()}
											className={`hover:bg-[#ed3237] hover:text-white mb-0.5 ${pagination.rowsPerPage === option
													? 'bg-[#ed3237] text-white'
													: ''
												}`}
										>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className='text-sm text-[#7D7D7D]'>
							Showing{' '}
							{(pagination.currentPage - 1) * pagination.rowsPerPage + 1} to{' '}
							{Math.min(
								pagination.currentPage * pagination.rowsPerPage,
								pagination.totalRecords
							)}{' '}
							of {pagination.totalRecords} entries
						</div>

						<div className='flex items-center gap-2'>
							<button
								onClick={() => handlePageChange(pagination.currentPage - 1)}
								disabled={pagination.currentPage === 1}
								className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
							>
								<ChevronLeft className='w-4 h-4' />
							</button>

							<div className='flex gap-1'>
								{Array.from(
									{ length: pagination.totalPages },
									(_, i) => i + 1
								).map((page) => {
									if (
										page === 1 ||
										page === pagination.totalPages ||
										(page >= pagination.currentPage - 1 &&
											page <= pagination.currentPage + 1)
									) {
										return (
											<button
												key={page}
												onClick={() => handlePageChange(page)}
												className={`px-3 py-2 text-sm rounded-lg border transition-colors ${page === pagination.currentPage
														? 'bg-[#ed3237] text-white border-[#ed3237]'
														: 'border-gray-300 hover:bg-gray-50'
													}`}
											>
												{page}
											</button>
										);
									} else if (
										page === pagination.currentPage - 2 ||
										page === pagination.currentPage + 2
									) {
										return (
											<span key={page} className='px-2 py-2 text-gray-400'>
												...
											</span>
										);
									}
									return null;
								})}
							</div>

							<button
								onClick={() => handlePageChange(pagination.currentPage + 1)}
								disabled={pagination.currentPage === pagination.totalPages}
								className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
							>
								<ChevronRight className='w-4 h-4' />
							</button>
						</div>
					</div>
				)}
			</div>

			<Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
				<DialogContent className='max-w-md fixed top-10/15 left-11/15 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6'>
					<DialogHeader className='space-y-0 pb-2'>
						<DialogTitle className='text-xl font-semibold text-[#000000]'>
							Delete Tenant
						</DialogTitle>
					</DialogHeader>

					<div className='space-y-4'>
						<p className='text-[#7D7D7D] leading-relaxed'>
							Are you sure you want to delete "
							{tenantToDelete?.personal_information.full_name}"? This action
							cannot be undone and will also remove all associated data.
						</p>

						<div className='flex gap-3 justify-end'>
							<Button
								variant='outline'
								onClick={() => setIsDeleteModalOpen(false)}
								className='px-6 rounded-lg bg-[#EBEFF3] text-[#7D7D7D] border border-[#7D7D7D] focus-visible:ring-[#000] focus-visible:border-[#000]'
							>
								Cancel
							</Button>
							<Button
								className='bg-[#EE2F2F] hover:bg-[#EE2F2F] text-white focus-visible:ring-[#000] focus-visible:border-[#000] px-6 rounded-lg'
								onClick={handleConfirmDelete}
							>
								Delete
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
