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
import { useDispatch } from 'react-redux';
import { DashboardThunks } from '../../features/Dashboard/Reducer/DashboardThunk';

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
	const dispatch = useDispatch<any>();
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
		rentDueDate: '',
	});

	const [commercial, setCommercial] = useState<any>([]);
	const [unitData, setUnitData] = useState<any>([]);
	const [selectedProperty, setSelectedProperty] = useState<any>('');
	const [selectedPropertyId, setSelectedPropertyId] = useState<any>('');

	useEffect(() => {
		if (tenant) {
			const tenantData = tenant;
			console.log("Tenant data for editing:", tenantData);
			
			// Extract property type from unitRelation
			const propertyType = tenantData?.unitRelation?.property?.property_type || '';
			
			// Extract property ID (uuid) from unitRelation
			const propertyId = tenantData?.unitRelation?.property?.uuid || '';
			
			// Extract property name from unitRelation
			// const propertyName = tenantData?.unitRelation?.property?.property_name || '';
			
			// Set form data
			setFormData({
				fullName: tenantData?.personal_information?.full_name || '',
				emailAddress: tenantData?.personal_information?.email || '',
				address: tenantData?.personal_information?.address || '',
				phoneNumber: tenantData?.personal_information?.phone || '',
				unit: tenantData?.unitRelation?.id || '', // This should be the unit UUID
				propertytype: propertyType,
				propertyName: propertyId, // Store property ID for Select value
				tenantType: tenantData?.tenant_type || '',
				propertyInformation: tenantData?.unitRelation?.unit_name || '',
				rent: tenantData?.financial_information?.rent || '',
				securityDeposit: tenantData?.deposit?.toString() || '',
				hasGst: tenantData?.hasGST || false,
				cgst: tenantData?.financial_information?.cgst?.toString() || '0',
				sgst: tenantData?.financial_information?.sgst?.toString() || '0',
				tds: tenantData?.financial_information?.tds?.toString() || '0',
				maintanance: tenantData?.financial_information?.maintenance?.toString() || '0',
				totalmonthlyrent: tenantData?.rent?.toString() || '0',
				teamSpecialized: '',
				leaseStartDate: tenantData?.lease_duration?.start_date
					? new Date(tenantData.lease_duration.start_date)
						.toISOString()
						.split('T')[0]
					: '',
				leaseEndDate: tenantData?.lease_duration?.end_date
					? new Date(tenantData.lease_duration.end_date).toISOString().split('T')[0]
					: '',
				contactName: tenantData?.emergency_contact?.name || '',
				contactPhone: tenantData?.emergency_contact?.phone || '',
				relationship: tenantData?.emergency_contact?.relation || '',
				bankName: tenantData?.bank_details?.bank_name || '',
				accountNumber: tenantData?.bank_details?.account_number || '',
				branch: tenantData?.bank_details?.bank_branch || '',
				ifscNumber: tenantData?.bank_details?.bank_IFSC || '',
				rentDueDate: tenantData?.lease_duration?.due_date || '',
			});

			// Set selected property and ID
			setSelectedProperty(propertyType);
			setSelectedPropertyId(propertyId);
		}
	}, [tenant]);

	const getUnit = async () => {
		if (!selectedPropertyId) return;
		
		try {
			const data = { uuid: selectedPropertyId };
			const response = await getPropertyByIdData(data);
			if (response?.data) {
				setUnitData(response.data);
			}
		} catch (error) {
			console.error('Error fetching units:', error);
			toast.error('Failed to load units');
		}
	};

	const getProperty = async () => {
		if (!selectedProperty) return;
		
		try {
			const data = { property_type: selectedProperty };
			const response = await getPropertyData(data);
			if (response?.data) {
				setCommercial(response.data);
			}
		} catch (error) {
			console.error('Error fetching properties:', error);
			toast.error('Failed to load properties');
		}
	};

	// Remove automatic calculation effect since you don't want GST calculations
	// useEffect(() => {
	// 	calculateTotalRent();
	// }, [
	// 	formData.rent,
	// 	formData.maintanance,
	// 	formData.cgst,
	// 	formData.sgst,
	// 	formData.tds,
	// 	formData.hasGst,
	// 	formData.tenantType,
	// ]);

	const handleInputChange = (field: keyof TenantFormData, value: string) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
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

	const handleSubmit = async () => {
		// Validation
		if (!formData.fullName || !formData.emailAddress || !formData.phoneNumber) {
			toast.error('Please fill in required fields (Name, Email, Phone)');
			return;
		}

		// Additional validation for rent tenants
		if (formData.tenantType === 'rent') {
			if (!formData.rent || parseFloat(formData.rent) <= 0) {
				toast.error('Please enter a valid monthly rent');
				return;
			}
			if (!formData.rentDueDate || parseInt(formData.rentDueDate) < 1 || parseInt(formData.rentDueDate) > 31) {
				toast.error('Please enter a valid rent due date (1-31)');
				return;
			}
		}

		try {
			const payload: any = {
				personal_information: {
					full_name: formData.fullName,
					email: formData.emailAddress,
					phone: formData.phoneNumber,
					address: formData.address || '',
				},
				lease_duration: {
					start_date: formData.leaseStartDate
						? new Date(formData.leaseStartDate).toISOString()
						: null,
					end_date: formData.leaseEndDate
						? new Date(formData.leaseEndDate).toISOString()
						: null,
					due_date: formData.rentDueDate || ''
				},
				tenant_type: formData.tenantType,
				unit: formData.unit,
				rent: parseFloat(formData.totalmonthlyrent) || 0,
				deposit: parseFloat(formData.securityDeposit) || 0,
				hasGST: formData.hasGst || false,
				financial_information: {
					rent: formData.rent || '',
					maintenance: parseFloat(formData.maintanance) || 0,
				}
			};

			// Add GST fields only for rent tenants with GST enabled
			if (formData.tenantType === 'rent' && formData.hasGst) {
				payload.financial_information.cgst = parseFloat(formData.cgst) || 0;
				payload.financial_information.sgst = parseFloat(formData.sgst) || 0;
				payload.financial_information.tds = parseFloat(formData.tds) || 0;
			}

			console.log('Update payload:', tenant);

			const response = await editTenants({
				uuid: tenant?.uuid,
				data: payload,
			});
			
			if (response) {
				toast.success('Tenant updated successfully!');
				fetchTenants();
				// Refresh dashboard data to update pending payments count
				dispatch(DashboardThunks());
				onClose();
			}
		} catch (error: any) {
			console.error('Error updating tenant:', error);
			toast.error(error?.response?.data?.message || 'Failed to update tenant. Please try again.');
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
												// Reset property name when property type changes
												setFormData((prev: any) => ({
													...prev,
													propertyName: '',
													unit: ''
												}));
												setSelectedPropertyId('');
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
												<SelectItem value='residency'>Residency</SelectItem>
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
												// Reset unit when property changes
												setFormData((prev: any) => ({
													...prev,
													unit: ''
												}));
											}}
											disabled={!selectedProperty}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder={selectedProperty ? 'Select Property' : 'Select property type first'} />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{commercial?.map((c: any) => (
													<SelectItem value={`${c?.uuid}`} key={c?.uuid}>
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
											onValueChange={(value) => {
												handleInputChange('tenantType', value);
												// Reset GST-related fields when tenant type changes
												if (value !== 'rent') {
													setFormData((prev: any) => ({
														...prev,
														hasGst: false,
														cgst: '0',
														sgst: '0',
														tds: '0'
													}));
												}
											}}
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
											disabled={!selectedPropertyId}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder={selectedPropertyId ? 'Select Unit' : 'Select property first'} />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{unitData?.map((item: any) => (
													<SelectItem key={item?.id} value={item?.id}>
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
									<div className='space-y-2'>
										<Label htmlFor='securityDeposit'>Security Deposit</Label>
										<Input
											id='securityDeposit'
											value={formData.securityDeposit}
											onChange={(e) =>
												handleInputChange('securityDeposit', e.target.value)
											}
											placeholder='Enter security deposit'
											type='number'
										/>
									</div>
									
									{formData.tenantType === 'rent' && (
										<>
											<div className='space-y-2'>
												<Label htmlFor='rent'>Monthly Rent *</Label>
												<Input
													id='rent'
													value={formData.rent}
													onChange={(e) =>
														handleInputChange('rent', e.target.value)
													}
													placeholder='Enter monthly rent'
													type='number'
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
													placeholder='Enter maintenance charge'
													type='number'
												/>
											</div>
										</>
									)}
									{formData.tenantType === 'lease' && (
										<div className='space-y-2'>
											<Label htmlFor='maintanance'>Maintenance Charge</Label>
											<Input
												id='maintanance'
												value={formData.maintanance}
												onChange={(e) =>
													handleInputChange('maintanance', e.target.value)
												}
												placeholder='Enter maintenance charge'
												type='number'
											/>
										</div>
									)}
								</div>

								{/* GST Section - Only for rent tenants */}
								{formData.tenantType === 'rent' && (
									<div className='space-y-4 pt-2'>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='gstCheckbox'
												checked={formData.hasGst}
												onCheckedChange={(checked: boolean) => {
													setFormData((prev: any) => ({
														...prev,
														hasGst: checked,
													}));
												}}
											/>
											<Label htmlFor='gstCheckbox'>Include GST</Label>
										</div>

										{/* {formData.hasGst && (
											<div className='grid grid-cols-3 gap-4'>
												<div className='space-y-2'>
													<Label htmlFor='cgst'>CGST (%)</Label>
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
													<Label htmlFor='sgst'>SGST (%)</Label>
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
													<Label htmlFor='tds'>TDS (%)</Label>
													<Input
														id='tds'
														value={formData.tds}
														onChange={(e) =>
															handleInputChange('tds', e.target.value)
														}
														placeholder='Enter TDS percentage'
														type='number'
													/>
												</div>
											</div>
										)} */}
									</div>
								)}
								
								{/* Manual total rent input */}
								{formData.tenantType === 'rent' && (
									<div className='space-y-2'>
										<Label htmlFor='totalmonthlyrent'>Total Monthly Rent *</Label>
										<Input
											id='totalmonthlyrent'
											value={formData.totalmonthlyrent}
											onChange={(e) =>
												handleInputChange('totalmonthlyrent', e.target.value)
											}
											placeholder='Enter total monthly rent'
											type='number'
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
									{formData.tenantType === 'rent' ? 'Rent Information' : 'Lease Information'}
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='leaseStartDate'>{formData.tenantType === 'rent' ? 'Rent Start Date' : 'Lease Start Date'}</Label>
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
										<Label htmlFor='leaseEndDate'>{formData.tenantType === 'rent' ? 'Rent End Date' : 'Lease End Date'}</Label>
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
									{formData.tenantType === 'rent' && (
										<div className='space-y-2'>
											<Label htmlFor='rentDueDate'>Rent Due Date (Day of month) *</Label>
											<Input
												id='rentDueDate'
												type="number"
												min="1"
												max="31"
												value={formData.rentDueDate}
												onChange={(e: any) => {
													const value: number = parseInt(e.target.value, 10);
													// Only allow 1-31 or empty
													if ((value >= 1 && value <= 31) || e.target.value === '') {
														handleInputChange('rentDueDate', e.target.value);
													}
												}}
												placeholder="1-31"
												className='pr-10'
											/>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* <Card>
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
						</Card> */}

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
								disabled={!formData.fullName || !formData.emailAddress || !formData.phoneNumber || 
									(formData.tenantType === 'rent' && (!formData.totalmonthlyrent || parseFloat(formData.totalmonthlyrent) <= 0))}
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