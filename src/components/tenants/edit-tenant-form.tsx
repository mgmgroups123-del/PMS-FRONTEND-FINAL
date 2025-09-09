import { useState, useEffect } from 'react';
import { Input } from '../../../src/components/ui/input';
import { Label } from '../../../src/components/ui/label';
import { Button } from '../../../src/components/ui/button';
import { Checkbox } from '../../../src/components/ui/checkbox';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../src/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../src/components/ui/select';
import { X } from 'lucide-react';
import type { TenantFormData } from './create-tenant-form';
import {
	editTenants,
	getPropertyByIdData,
	getPropertyData,
} from '../../features/tenants/services';
import toast from 'react-hot-toast';

interface EditTenantFormProps {
	isOpen: boolean;
	tenant: any | null;
	onClose: () => void;
	fetchTenants: () => void;
}

export default function EditTenantForm({
	isOpen,
	tenant,
	onClose,
	fetchTenants,
}: EditTenantFormProps) {
	const [formData, setFormData] = useState<any>({
		fullName: '',
		emailAddress: '',
		address: '',
		phoneNumber: '',
		unit: '',
		propertytype: '',
		propertyName: '',
		tenantType: '',
		propertyInformation: '',
		rent: '',
		securityDeposit: '',
		hasGst: true,
		cgst: '9',
		sgst: '9',
		tds: '-10',
		maintanance: '',
		totalmonthlyrent: '',
		teamSpecialized: '',
		leaseStartDate: '',
		leaseEndDate: '',
		contactName: '',
		contactPhone: '',
		relationship: '',
		bankName: '',
		accountNumber: '',
		branch: '',
		ifscNumber: '',
		rentDueDate: ''
	});

	const [commercial, setCommercial] = useState<any>();
	const [unitData, setUnitData] = useState<any>();
	const [selectedProperty, setSelectedProperty] = useState<any>('');
	const [selectedPropertyId, setSelectedPropertyId] = useState<any>('');

	useEffect(() => {
		if (tenant) {
			setFormData({
				fullName: tenant?.personal_information?.full_name || '',
				emailAddress: tenant?.personal_information?.email || '',
				address: tenant?.personal_information?.address || '',
				phoneNumber: tenant?.personal_information?.phone || '',
				unit: tenant?.unit?._id || '',
				propertytype: tenant?.unit?.propertyId?.property_type || '',
				propertyName: tenant?.unit?.propertyId?.uuid || '',
				tenantType: tenant?.tenant_type || '',
				propertyInformation: tenant?.unit?.unit_address || '',
				rent: tenant?.financial_information?.rent || '',
				securityDeposit: tenant?.deposit || '',
				hasGst: true,
				cgst: tenant?.financial_information?.cgst || '9',
				sgst: tenant?.financial_information?.sgst || '9',
				tds: tenant?.financial_information?.tds || '-10',
				maintanance: tenant?.financial_information?.maintenance || '',
				totalmonthlyrent: calculateInitialTotal(
					tenant?.financial_information?.rent,
					tenant?.financial_information?.maintenance,
					tenant?.financial_information?.cgst,
					tenant?.financial_information?.sgst,
					tenant?.financial_information?.tds
				),
				teamSpecialized: '',
				leaseStartDate: tenant?.lease_duration?.start_date
					? new Date(tenant.lease_duration.start_date)
						.toISOString()
						.split('T')[0]
					: '',
				leaseEndDate: tenant?.lease_duration?.end_date
					? new Date(tenant.lease_duration.end_date).toISOString().split('T')[0]
					: '',
				contactName: tenant?.emergency_contact?.name || '',
				contactPhone: tenant?.emergency_contact?.phone || '',
				relationship: tenant?.emergency_contact?.relation || '',
				bankName: tenant?.bank_details?.bank_name || '',
				accountNumber: tenant?.bank_details?.account_number || '',
				branch: tenant?.bank_details?.bank_branch || '',
				ifscNumber: tenant?.bank_details?.bank_IFSC || '',
				rentDueDate: tenant?.lease_duration?.due_date || ''
			});

			setSelectedProperty(tenant?.unit?.propertyId?.property_type || '');
			setSelectedPropertyId(tenant?.unit?.propertyId?.uuid || '');
		}
	}, [tenant]);

	const calculateInitialTotal = (
		rent: string,
		maintenance: string,
		cgst: string,
		sgst: string,
		tds: string
	) => {
		const rentNum = parseFloat(rent) || 0;
		const maintenanceNum = parseFloat(maintenance) || 0;
		const cgstNum = parseFloat(cgst) || 0;
		const sgstNum = parseFloat(sgst) || 0;
		const tdsNum = parseFloat(tds) || 0;
		let total = rentNum + maintenanceNum;
		const cgstAmount = (rentNum * cgstNum) / 100;
		const sgstAmount = (rentNum * sgstNum) / 100;
		total += cgstAmount + sgstAmount;
		const tdsAmount = (total * Math.abs(tdsNum)) / 100;
		total -= tdsAmount;
		return total.toFixed(2);
	};

	const getUnit = async () => {
		const data = { uuid: selectedPropertyId };
		const response = await getPropertyByIdData(data);
		setUnitData(response?.data);
	};

	const getProperty = async () => {
		const data = { property_type: selectedProperty };
		const response = await getPropertyData(data);
		setCommercial(response?.data);
	};

	useEffect(() => {
		calculateTotalRent();
	}, [
		formData.rent,
		formData.maintanance,
		formData.cgst,
		formData.sgst,
		formData.tds,
		formData.hasGst,
	]);

	const calculateTotalRent = () => {
		const rent = parseFloat(formData.rent) || 0;
		const maintenance = parseFloat(formData.maintanance) || 0;
		const cgstPercentage = parseFloat(formData.cgst) || 0;
		const sgstPercentage = parseFloat(formData.sgst) || 0;
		const tdsPercentage = parseFloat(formData.tds) || 0;

		let total = rent + maintenance;

		if (formData.hasGst && formData.tenantType === 'rent') {
			const cgstAmount = (rent * cgstPercentage) / 100;
			const sgstAmount = (rent * sgstPercentage) / 100;
			total += cgstAmount + sgstAmount;
		}

		const tdsAmount = (total * Math.abs(tdsPercentage)) / 100;
		total -= tdsAmount;

		setFormData((prev: any) => ({
			...prev,
			totalmonthlyrent: total.toFixed(2),
		}));
	};

	useEffect(() => {
		if (selectedPropertyId) {
			getUnit();
		}
	}, [selectedPropertyId]);

	useEffect(() => {
		if (selectedProperty) {
			getProperty();
		}
	}, [selectedProperty]);

	const handleInputChange = (field: keyof TenantFormData, value: string) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));

		if (['rent', 'maintanance', 'cgst', 'sgst', 'tds'].includes(field)) {
			calculateTotalRent();
		}
	};

	const handleSubmit = async () => {
		if (!formData.fullName || !formData.emailAddress || !formData.phoneNumber) {
			toast.error('Please fill in required fields');
			return;
		}
		try {
			const payload = {
				personal_information: {
					full_name: formData.fullName,
					email: formData.emailAddress,
					phone: formData.phoneNumber,
					address: formData.address,
				},
				lease_duration: {
					start_date: formData.leaseStartDate
						? new Date(formData.leaseStartDate)
						: null,
					end_date: formData.leaseEndDate
						? new Date(formData.leaseEndDate)
						: null,
					due_date: formData.rentDueDate
				},
				emergency_contact: {
					name: formData.contactName,
					phone: formData.contactPhone,
				},
				tenant_type: formData.tenantType,
				unit: formData.unit,
				rent: formData.totalmonthlyrent,
				deposit: formData.securityDeposit,
				financial_information: {
					rent: formData.rent,
					...(formData.tenantType === 'rent' &&
						formData.hasGst && {
						cgst: formData.cgst,
						sgst: formData.sgst,
						tds: formData.tds,
					}),
					maintenance: formData.maintanance,
				},
				bank_details: {
					bank_name: formData.bankName,
					account_number: formData.accountNumber,
					bank_branch: formData.branch,
					bank_IFSC: formData.ifscNumber,
				},
			};
			const response = await editTenants({
				uuid: tenant?.uuid,
				data: payload,
			});
			if (response) {
				toast.success('Tenant updated successfully!');
				fetchTenants();
				onClose();
			}
		} catch (error) {
			toast.error('Failed to update tenant. Please try again.');
		}
	};

	const handleCancel = () => {
		onClose();
	};

	if (!isOpen || !tenant) return null;

	return (
		<>
			<div
				className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40'
				onClick={handleCancel}
			></div>
			<div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
				<div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar'>
					<div className='space-y-6 p-6'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold text-gray-800'>
								Edit Tenant - {tenant.personal_information?.full_name}
							</h2>
							<Button
								variant='ghost'
								size='sm'
								onClick={onClose}
								className='bg-gray-500 w-5 h-5 hover:bg-gray-700 rounded-full'
							>
								<X className='w-4 h-4 text-white' />
							</Button>
						</div>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										1
									</div>
									Profile Information
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='fullName'>Full Name *</Label>
										<Input
											id='fullName'
											value={formData.fullName}
											onChange={(e) =>
												handleInputChange('fullName', e.target.value)
											}
											placeholder='Enter full name'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='emailAddress'>Email Address *</Label>
										<Input
											id='emailAddress'
											type='email'
											value={formData.emailAddress}
											onChange={(e) =>
												handleInputChange('emailAddress', e.target.value)
											}
											placeholder='Enter email address'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='phoneNumber'>Phone Number *</Label>
										<Input
											id='phoneNumber'
											value={formData.phoneNumber}
											onChange={(e) =>
												handleInputChange('phoneNumber', e.target.value)
											}
											placeholder='Enter phone number'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='address'>Address</Label>
										<Input
											id='address'
											value={formData.address}
											onChange={(e) =>
												handleInputChange('address', e.target.value)
											}
											placeholder='Enter address'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='propertytype'>Property Type</Label>
										<Select
											value={formData.propertytype}
											onValueChange={(value) => {
												handleInputChange('propertytype', value);
												setSelectedProperty(value);
											}}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select Property type' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												<SelectItem value='commercial'>Commercial</SelectItem>
												<SelectItem value='villa'>Villa</SelectItem>
												<SelectItem value='apartment'>Apartment</SelectItem>
												<SelectItem value='house'>House</SelectItem>
												<SelectItem value='land'>Land</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='propertyName'>Property Name</Label>
										<Select
											value={formData.propertyName}
											onValueChange={(value) => {
												setSelectedPropertyId(value);
												handleInputChange('propertyName', value);
											}}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select Property' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{commercial?.map((c: any) => (
													<SelectItem value={`${c?.uuid}`} key={c?._id}>
														{c?.property_name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='tenantType'>Tenant Type</Label>
										<Select
											value={formData.tenantType}
											onValueChange={(value) =>
												handleInputChange('tenantType', value)
											}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select tenant type' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												<SelectItem value='lease'>Lease</SelectItem>
												<SelectItem value='rent'>Rent</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='unit'>Unit</Label>
										<Select
											value={formData.unit}
											onValueChange={(value) =>
												handleInputChange('unit', value)
											}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select Unit' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{unitData?.map((item: any) => (
													<SelectItem key={item?._id} value={item?._id}>
														{item?.unit_name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										2
									</div>
									Financial Information
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-3 gap-4'>
									{formData.tenantType === 'rent' && (
										<div className='space-y-2'>
											<Label htmlFor='rent'>Monthly Rent *</Label>
											<Input
												id='rent'
												value={formData.rent}
												onChange={(e) =>
													handleInputChange('rent', e.target.value)
												}
												placeholder='Enter monthly rent'
											/>
										</div>
									)}
									<div className='space-y-2'>
										<Label htmlFor='securityDeposit'>Security Deposit</Label>
										<Input
											id='securityDeposit'
											value={formData.securityDeposit}
											onChange={(e) =>
												handleInputChange('securityDeposit', e.target.value)
											}
											placeholder='Enter security deposit'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='maintanance'>Maintenance Charge</Label>
										<Input
											id='maintanance'
											value={formData.maintanance}
											onChange={(e) =>
												handleInputChange('maintanance', e.target.value)
											}
											placeholder='Enter maintanance charge'
										/>
									</div>
								</div>

								{/* GST Section */}
								<div className='space-y-4 pt-2'>
									{formData?.tenantType === 'rent' && (
										<>
											<div className='flex items-center space-x-2'>
												<Checkbox
													id='gstCheckbox'
													checked={formData.hasGst}
													onCheckedChange={(checked: boolean) => {
														setFormData((prev: any) => ({
															...prev,
															hasGst: checked,
														}));
														calculateTotalRent();
													}}
												/>
												<Label htmlFor='gstCheckbox'>Include GST</Label>
											</div>

											{formData.hasGst && (
												<div className='grid grid-cols-3 gap-4'>
													<div className='space-y-2'>
														<Label htmlFor='cgst'>CGST (%) *</Label>
														<Input
															id='cgst'
															value={formData.cgst}
															onChange={(e) =>
																handleInputChange('cgst', e.target.value)
															}
															placeholder='Enter CGST percentage'
															type='number'
														/>
													</div>
													<div className='space-y-2'>
														<Label htmlFor='sgst'>SGST (%) *</Label>
														<Input
															id='sgst'
															value={formData.sgst}
															onChange={(e) =>
																handleInputChange('sgst', e.target.value)
															}
															placeholder='Enter SGST percentage'
															type='number'
														/>
													</div>
													<div className='space-y-2'>
														<Label htmlFor='tds'>TDS *</Label>
														<Input
															id='tds'
															value={formData.tds}
															onChange={(e) =>
																handleInputChange('tds', e.target.value)
															}
															placeholder='-10 %'
														/>
													</div>
												</div>
											)}
										</>
									)}
								</div>
								{formData.tenantType === 'rent' && (
									<div className='space-y-2 col-span-2'>
										<Label htmlFor='totalmonthlyrent'>Total Monthly Rent</Label>
										<Input
											id='totalmonthlyrent'
											value={formData.totalmonthlyrent}
											onChange={(e: any) =>
												handleInputChange('totalmonthlyrent', e.target.value)
											}
											placeholder='Calculated amount'
											readOnly
										/>
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										3
									</div>
									{tenant.tenant_type === 'rent' ? 'Rent Information' : 'Lease Information'}
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='leaseStartDate'>{tenant.tenant_type === 'rent' ? 'Rent Start Date' : 'Lease Start Date'}</Label>
										<Input
											id='leaseStartDate'
											type='date'
											value={formData.leaseStartDate}
											onChange={(e: any) =>
												handleInputChange('leaseStartDate', e.target.value)
											}
											className='pr-10 gap-3'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='leaseEndDate'>{tenant.tenant_type === 'rent' ? 'Rent End Date' : 'Lease End Date'}</Label>
										<Input
											id='leaseEndDate'
											type='date'
											value={formData.leaseEndDate}
											onChange={(e: any) =>
												handleInputChange('leaseEndDate', e.target.value)
											}
											className='pr-10'
										/>
									</div>
									{tenant.tenant_type === 'rent' && (<div className='space-y-2'>
										<Label htmlFor='leaseEndDate'> Rent Due Date *</Label>
										<Input
											id='rentDueDate'
											type="number"
											value={formData.rentDueDate}
											onChange={(e: any) => {
												const value:number = parseInt(e.target.value, 10);

												// Only allow 1-31
												if (value >= 1 && value <= 31) {
													handleInputChange('rentDueDate', value.toString());
												} else if (e.target.value === '') {
													// Allow clearing input
													handleInputChange('rentDueDate', '');
												}

											}

											}
											className='pr-10'
										/>
									</div>)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										4
									</div>
									Emergency Contact
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='contactName'>Contact Name</Label>
										<Input
											id='contactName'
											value={formData.contactName}
											onChange={(e) =>
												handleInputChange('contactName', e.target.value)
											}
											placeholder='Enter contact name'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='contactPhone'>Contact Phone</Label>
										<Input
											id='contactPhone'
											value={formData.contactPhone}
											onChange={(e) =>
												handleInputChange('contactPhone', e.target.value)
											}
											placeholder='Enter contact phone'
										/>
									</div>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='relationship'>Relationship</Label>
									<Select
										value={formData.relationship}
										onValueChange={(value) =>
											handleInputChange('relationship', value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select relationship' />
										</SelectTrigger>
										<SelectContent className='bg-white'>
											<SelectItem value='parent'>Parent</SelectItem>
											<SelectItem value='sibling'>Sibling</SelectItem>
											<SelectItem value='spouse'>Spouse</SelectItem>
											<SelectItem value='friend'>Friend</SelectItem>
											<SelectItem value='other'>Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										5
									</div>
									Bank Details
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='bankName'>Bank Name</Label>
										<Input
											id='bankName'
											value={formData.bankName}
											onChange={(e) =>
												handleInputChange('bankName', e.target.value)
											}
											placeholder='Enter Bank name'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='accountNumber'>Account Number</Label>
										<Input
											id='accountNumber'
											value={formData.accountNumber}
											onChange={(e) =>
												handleInputChange('accountNumber', e.target.value)
											}
											placeholder='Enter Account Number'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='branch'>Bank Branch</Label>
										<Input
											id='branch'
											value={formData.branch}
											onChange={(e) =>
												handleInputChange('branch', e.target.value)
											}
											placeholder='Enter Branch name'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='ifscNumber'>IFSC Code</Label>
										<Input
											id='ifscNumber'
											value={formData.ifscNumber}
											onChange={(e) =>
												handleInputChange('ifscNumber', e.target.value)
											}
											placeholder='Enter IFSC code'
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className='flex justify-between gap-4 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={handleCancel}
								className='px-6 border-gray-300 text-gray-700 hover:bg-gray-50'
							>
								Cancel
							</Button>
							<Button
								type='button'
								onClick={handleSubmit}
								className='px-6 hover:bg-[#ed3237] bg-red-700 text-white'
							>
								Update Tenant
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
