import { useEffect, useState } from 'react';
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
import {
	createTenants,
	getPropertyByIdData,
	getPropertyData,
} from '../../features/tenants/services';
import toast from 'react-hot-toast';
import {
	Heart,
	HelpCircle,
	Smile,
	UserRound,
	UsersRound,
	X,
} from 'lucide-react';
import { GetByIdLandService, GetLandsDetails } from '../../features/lands/service';

export interface TenantFormData {
	fullName: string;
	emailAddress: string;
	address: string;
	propertytype: string;
	propertyName: string;
	tenantType: string;
	phoneNumber: string;
	unit: string;
	propertyInformation: string;
	rent: string;
	securityDeposit: string;
	hasGst: boolean;
	cgst: string;
	sgst: string;
	tds: string;
	maintanance: string;
	totalmonthlyrent: string;
	teamSpecialized: string;
	leaseStartDate: string;
	leaseEndDate: string;
	contactName: string;
	contactPhone: string;
	relationship: string;
	bankName: string;
	accountNumber: string;
	branch: string;
	ifscNumber: string;
	rentDueDate: string;
}

interface AddTenantFormProps {
	isOpen: boolean;
	onClose: () => void;
	fetchTenants: () => void;
}

export default function
	AddTenantForm({
		isOpen,
		onClose,
		fetchTenants,
	}: AddTenantFormProps) {
	const [formData, setFormData] = useState<TenantFormData>({
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
		hasGst: false,
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

	const [errors, setErrors] = useState<Partial<TenantFormData>>({});
	const [commercial, setCommercial] = useState<any>();
	const [unitData, setUnitData] = useState<any>();
	const [selectedProperty, setSelectedProperty] = useState<any>('');
	const [selectedPropertyId, setSelectedPropertyId] = useState<any>('');
	const [landId, setLandId] = useState<string>()

	const validateField = (field: keyof TenantFormData, value: string) => {
		let error = '';

		switch (field) {
			case 'fullName':
				if (!value.trim()) error = 'Full name is required';
				else if (value.length < 3)
					error = 'Full name must be at least 3 characters';
				break;
			case 'emailAddress':
				if (!value.trim()) error = 'Email is required';
				else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
					error = 'Invalid email format';
				break;
			case 'phoneNumber':
				if (!value.trim()) error = 'Phone number is required';
				else if (!/^[0-9]{10}$/.test(value))
					error = 'Phone number must be 10 digits';
				break;
			case 'address':
				if (!value.trim()) error = 'Address is required';
				break;
			case 'propertytype':
				if (!value.trim()) error = 'Property type is required';
				break;
			case 'propertyName':
				if (!value.trim()) error = 'Property name is required';
				break;
			case 'tenantType':
				if (!value.trim()) error = 'Tenant type is required';
				break;
			// case 'unit':
			// 	if (!value.trim()) error = 'Unit is required';
			// 	break;
			// case 'rent':
			// 	if (formData.tenantType === "rent" && !value.trim()) error = 'Rent amount is required';
			// 	else if (isNaN(Number(value))) error = 'Rent must be a number';
			// 	else if (Number(value) <= 0) error = 'Rent must be greater than 0';
			// 	break;
			case 'securityDeposit':
				if (!value.trim()) error = 'Security deposit is required';
				else if (isNaN(Number(value)))
					error = 'Security deposit must be a number';
				else if (Number(value) < 0)
					error = 'Security deposit cannot be negative';
				break;
			case 'maintanance':
				if (!value.trim()) error = 'Maintenance charge is required';
				else if (isNaN(Number(value))) error = 'Maintenance must be a number';
				else if (Number(value) < 0) error = 'Maintenance cannot be negative';
				break;
			case 'cgst':
			case 'sgst':
				if (formData.hasGst && !value.trim())
					error = 'This field is required when GST is enabled';
				else if (isNaN(Number(value))) error = 'Must be a number';
				else if (Number(value) < 0) error = 'Cannot be negative';
				break;
			case 'tds':
				if (!value.trim()) error = 'TDS is required';
				else if (isNaN(Number(value))) error = 'TDS must be a number';
				break;
			case 'leaseStartDate':
			case 'leaseEndDate':
				if (!value.trim()) error = 'This field is required';
				else if (new Date(value) < new Date())
					error = 'Date cannot be in the past';
				else if (
					field === 'leaseEndDate' &&
					formData.leaseStartDate &&
					new Date(value) <= new Date(formData.leaseStartDate)
				) {
					error = 'End date must be after start date';
				}
				break;
			case 'rentDueDate':
				if (!value.trim()) error = 'Rent due date is required';
				break;
			case 'contactName':
				if (!value.trim()) error = 'Contact name is required';
				break;
			case 'contactPhone':
				if (!value.trim()) error = 'Contact phone is required';
				else if (!/^[0-9]{10}$/.test(value))
					error = 'Phone number must be 10 digits';
				break;
			case 'bankName':
				if (!value.trim()) error = 'Bank name is required';
				break;
			case 'accountNumber':
				if (!value.trim()) error = 'Account number is required';
				else if (!/^[0-9]{9,18}$/.test(value)) error = 'Invalid account number';
				break;
			case 'ifscNumber':
				if (!value.trim()) error = 'IFSC code is required';
				else if (!/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(value))
					error = 'Invalid IFSC format';
				break;
			default:
				break;
		}

		setErrors((prev) => ({ ...prev, [field]: error }));
		return !error;
	};

	const handleInputChange = (field: keyof TenantFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		validateField(field, value);

		if (['rent', 'maintanance', 'cgst', 'sgst', 'tds'].includes(field)) {
			calculateTotalRent();
		}
	};

	const getUnit = async () => {
		if (selectedProperty === "land") {
			const data: any = { uuid: selectedPropertyId };
			const response = await GetByIdLandService(data);
			setLandId(response?.data?._id)
		} else {
			const data = { uuid: selectedPropertyId };
			const response = await getPropertyByIdData(data);
			setUnitData(response?.data);
		}
	};

	const getProperty = async () => {
		if (selectedProperty === "land") {
			const response = await GetLandsDetails();
			setCommercial(response?.data)
		} else {
			const data = { property_type: selectedProperty };
			const response = await getPropertyData(data);
			setCommercial(response?.data);
		}
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
		const deposit = parseFloat(formData.securityDeposit) || 0;

		let subtotal = rent

		let cgstAmount = 0;
		let sgstAmount = 0;
		let tdsAmount = 0;
		let total = subtotal;

		if (formData.hasGst && formData.tenantType === 'rent') {
			cgstAmount = (subtotal * cgstPercentage) / 100;
			sgstAmount = (subtotal * sgstPercentage) / 100;
			total = subtotal + cgstAmount + sgstAmount;
			tdsAmount = (total * Math.abs(tdsPercentage)) / 100;
			total -= tdsAmount;
			total += maintenance;
		} else if (formData.tenantType === 'lease') {
			total = maintenance + deposit
		}

		setFormData((prev) => ({
			...prev,
			subtotal: subtotal.toFixed(2),
			cgstAmount: cgstAmount.toFixed(2),
			sgstAmount: sgstAmount.toFixed(2),
			tdsAmount: tdsAmount.toFixed(2),
			totalmonthlyrent: total.toFixed(2),
		}));
	};

	useEffect(() => {
		getUnit();
	}, [selectedPropertyId]);

	useEffect(() => {
		getProperty();
	}, [selectedProperty]);

	const validateForm = () => {
		let isValid = true;

		const requiredFields: Array<keyof TenantFormData> = [
			'fullName',
			'emailAddress',
			'phoneNumber',
			'address',
			'propertytype',
			'propertyName',
			'tenantType',
			'unit',
			'rent',
			'securityDeposit',
			'maintanance',
			'leaseStartDate',
			'leaseEndDate',
			'contactName',
			'contactPhone',
			'bankName',
			'accountNumber',
			'ifscNumber',
			'rentDueDate'
		];

		requiredFields.forEach((field) => {
			if (!validateField(field, String(formData[field]))) {
				isValid = false;
			}
		});

		if (formData.hasGst) {
			if (
				!validateField('cgst', formData.cgst) ||
				!validateField('sgst', formData.sgst)
			) {
				isValid = false;
			}
		}

		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error('Please fix all validation errors before submitting');
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
					relation: formData.relationship,
				},
				tenant_type: formData.tenantType,
				unit_type: selectedProperty === "land" ? "land" : "unit",
				unit: selectedProperty === "land" ? landId : formData.unit,
				rent: formData.totalmonthlyrent,
				deposit: formData.securityDeposit,
				is_active: true,
				is_deleted: false,
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

			const response = await createTenants(payload);
			if (response) {
				toast.success('New tenant created successfully!');
				fetchTenants();
				setFormData({
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
					hasGst: false,
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
				setErrors({});
				onClose();
			} else {
				toast.error(
					'Already occupied this unit, please select different unit.'
				);
			}
		} catch (error) {
			toast.error('Failed to create tenant. Please try again.');
		}
	};

	const handleCancel = () => {
		setFormData({
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
			hasGst: false,
			cgst: '',
			sgst: '',
			tds: '',
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
		setErrors({});
		onClose();
	};

	if (!isOpen) return null;

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
								Add Tenant Details
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
							<CardHeader className='bg-blue-50 rounded-t-lg flex items-center justify-between'>
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
											className={errors.fullName ? 'border-red-500' : ''}
										/>
										{errors.fullName && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.fullName}
											</p>
										)}
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
											className={errors.emailAddress ? 'border-red-500' : ''}
										/>
										{errors.emailAddress && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.emailAddress}
											</p>
										)}
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
											className={errors.phoneNumber ? 'border-red-500' : ''}
										/>
										{errors.phoneNumber && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.phoneNumber}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='address'>Address *</Label>
										<Input
											id='address'
											value={formData.address}
											onChange={(e) =>
												handleInputChange('address', e.target.value)
											}
											placeholder='Enter address'
											className={errors.address ? 'border-red-500' : ''}
										/>
										{errors.address && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.address}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='propertytype'>Property Type *</Label>
										<Select
											value={formData.propertytype}
											onValueChange={(value) => {
												handleInputChange('propertytype', value);
												setSelectedProperty(value);
											}}
										>
											<SelectTrigger
												className={`w-full ${errors.propertytype
													? 'border-red-500'
													: 'border-gray-200'
													} bg-white focus-visible:ring-[#000] focus-visible:border-[#000]`}
											>
												<SelectValue placeholder='Select Property type' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{[
													{ value: 'commercial', label: 'Commercial' },
													{ value: 'villa', label: 'Villa' },
													{ value: 'apartment', label: 'Apartment' },
													{ value: 'house', label: 'House' },
													{ value: 'land', label: 'Land' },
												].map((item) => (
													<SelectItem
														key={item.value}
														value={item.value}
														className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.propertytype === item.value
															? 'bg-[#ed3237] text-white'
															: ''
															}`}
													>
														{item.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{errors.propertytype && (
											<p className='mt-1 text-sm text-red-500'>
												{errors.propertytype}
											</p>
										)}
										{errors.propertytype && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.propertytype}
											</p>
										)}
									</div>

									<div className='space-y-2'>
										<Label htmlFor='propertyName'>Property Name *</Label>
										<Select
											value={formData.propertyName}
											onValueChange={(value) => {
												setSelectedPropertyId(value);
												handleInputChange('propertyName', value);
											}}
											disabled={!commercial?.length} // Disable if no options
										>
											<SelectTrigger
												className={`w-full ${errors.propertyName
													? 'border-red-500 focus:ring-red-500'
													: 'border-gray-200 focus:ring-[#ed3237]'
													} bg-white`}
											>
												<SelectValue
													placeholder={
														commercial?.length
															? 'Select Property'
															: 'Loading properties...'
													}
												/>
											</SelectTrigger>
											<SelectContent className='bg-white max-h-60 overflow-y-auto'>
												{commercial?.length ? (
													commercial.map((property: any) => (
														<SelectItem
															key={property.uuid}
															value={property.uuid}
															className={`hover:bg-[#ed3237] hover:text-white mb-0.5 ${formData.propertyName === property.uuid
																? 'bg-[#ed3237] text-white'
																: ''
																}`}
														>
															<div className='flex items-center gap-2'>
																<span>{property.property_name || property.land_name}</span>
															</div>
														</SelectItem>
													))
												) : (
													<div className='py-2 text-center text-sm text-gray-500'>
														No properties available
													</div>
												)}
											</SelectContent>
										</Select>
										{errors.propertyName && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.propertyName}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='tenantType'>Tenant Type *</Label>
										<Select
											value={formData.tenantType}
											onValueChange={(value) =>
												handleInputChange('tenantType', value)
											}
										>
											<SelectTrigger
												className={`w-full ${errors.tenantType
													? 'border-red-500 focus:ring-red-500'
													: 'border-gray-200 focus:ring-[#ed3237]'
													} bg-white`}
											>
												<SelectValue placeholder='Select tenant type' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												<SelectItem
													value='lease'
													className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.tenantType === 'lease'
														? 'bg-[#ed3237] text-white'
														: ''
														}`}
												>
													<div className='flex items-center gap-2'>
														<span>Lease</span>
													</div>
												</SelectItem>
												<SelectItem
													value='rent'
													className={`hover:bg-[#ed3237] hover:text-white transition-colors ${formData.tenantType === 'rent'
														? 'bg-[#ed3237] text-white'
														: ''
														}`}
												>
													<div className='flex items-center gap-2'>
														<span>Rent</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										{errors.tenantType && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.tenantType}
											</p>
										)}
									</div>
									{selectedProperty === "land" ? (<></>) : (<div className='space-y-2'>
										<Label htmlFor='unit'>Unit *</Label>
										<Select
											value={formData.unit}
											onValueChange={(value) =>
												handleInputChange('unit', value)
											}
											disabled={!unitData?.length} // Disable if no units available
										>
											<SelectTrigger
												className={`w-full ${errors.unit
													? 'border-red-500 focus:ring-red-500'
													: 'border-gray-200 focus:ring-[#ed3237]'
													} bg-white`}
											>
												<SelectValue
													placeholder={
														unitData?.length
															? 'Select Unit'
															: 'Loading units...'
													}
												/>
											</SelectTrigger>
											<SelectContent className='bg-white max-h-60 overflow-y-auto'>
												{unitData?.length ? (
													unitData.map((unit: any) => (
														<SelectItem
															key={unit._id}
															value={unit._id}
															className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.unit === unit._id
																? 'bg-[#ed3237] text-white'
																: ''
																}`}
														>
															<div className='flex items-center justify-between'>
																<span>{unit.unit_name}</span>
																{unit.unit_status && (
																	<span
																		className={`text-xs px-2 py-1 rounded-full ${unit.unit_status === 'occupied'
																			? 'bg-red-100 text-red-800'
																			: 'bg-green-100 text-green-800'
																			}`}
																	>
																		{unit.unit_status}
																	</span>
																)}
															</div>
														</SelectItem>
													))
												) : (
													<div className='py-2 text-center text-sm text-gray-500'>
														{unitData
															? 'No units available'
															: 'Loading units...'}
													</div>
												)}
											</SelectContent>
										</Select>
										{errors.unit && (
											<p className='text-red-500 text-xs mt-1'>{errors.unit}</p>
										)}
									</div>)}
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
												className={errors.rent ? 'border-red-500' : ''}
											/>
											{errors.rent && (
												<p className='text-red-500 text-xs mt-1'>
													{errors.rent}
												</p>
											)}
										</div>
									)}
									<div className='space-y-2'>
										<Label htmlFor='securityDeposit'>Security Deposit *</Label>
										<Input
											id='securityDeposit'
											value={formData.securityDeposit}
											onChange={(e) =>
												handleInputChange('securityDeposit', e.target.value)
											}
											placeholder='Enter security deposit'
											className={errors.securityDeposit ? 'border-red-500' : ''}
										/>
										{errors.securityDeposit && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.securityDeposit}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='maintanance'>Maintenance Charge *</Label>
										<Input
											id='maintanance'
											value={formData.maintanance}
											onChange={(e) =>
												handleInputChange('maintanance', e.target.value)
											}
											placeholder='Enter maintanance charge'
											className={errors.maintanance ? 'border-red-500' : ''}
										/>
										{errors.maintanance && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.maintanance}
											</p>
										)}
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
														setFormData((prev) => ({
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
															className={errors.cgst ? 'border-red-500' : ''}
														/>
														{errors.cgst && (
															<p className='text-red-500 text-xs mt-1'>
																{errors.cgst}
															</p>
														)}
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
															className={errors.sgst ? 'border-red-500' : ''}
														/>
														{errors.sgst && (
															<p className='text-red-500 text-xs mt-1'>
																{errors.sgst}
															</p>
														)}
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
															className={errors.tds ? 'border-red-500' : ''}
														/>
														{errors.tds && (
															<p className='text-red-500 text-xs mt-1'>
																{errors.tds}
															</p>
														)}
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
									{`${formData.tenantType.charAt(0).toUpperCase() + formData.tenantType.slice(1)} Information`}
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='leaseStartDate'>{`${formData.tenantType.charAt(0).toUpperCase() + formData.tenantType.slice(1)} Start Date *`}</Label>
										<Input
											id='leaseStartDate'
											type='date'
											value={formData.leaseStartDate}
											onChange={(e: any) =>
												handleInputChange('leaseStartDate', e.target.value)
											}
											className={`pr-10 gap-3 ${errors.leaseStartDate ? 'border-red-500' : ''
												}`}
										/>
										{errors.leaseStartDate && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.leaseStartDate}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='leaseEndDate'>{`${formData.tenantType.charAt(0).toUpperCase() + formData.tenantType.slice(1)} End Date *`}</Label>
										<Input
											id='leaseEndDate'
											type='date'
											value={formData.leaseEndDate}
											onChange={(e: any) =>
												handleInputChange('leaseEndDate', e.target.value)
											}
											className={`pr-10 ${errors.leaseEndDate ? 'border-red-500' : ''
												}`}
										/>
										{errors.leaseEndDate && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.leaseEndDate}
											</p>
										)}
									</div>
									{formData.tenantType === 'rent' && (<div className='space-y-2'>
										<Label htmlFor='leaseEndDate'>Rent Due Date *</Label>
										<Input
											id='leaseEndDate'
											type="number"
											value={formData.rentDueDate}
											placeholder='Enter due date'
											onChange={(e: any) => {
												const value = parseInt(e.target.value, 10);

												// Only allow 1-31
												if (value >= 1 && value <= 31) {
													handleInputChange('rentDueDate', value.toString());
												} else if (e.target.value === '') {
													// Allow clearing input
													handleInputChange('rentDueDate', '');
												}

											}
											}
											className={`pr-10 ${errors.rentDueDate ? 'border-red-500' : ''
												}`}
										/>
										{errors.rentDueDate && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.rentDueDate}
											</p>
										)}
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
										<Label htmlFor='contactName'>Contact Name *</Label>
										<Input
											id='contactName'
											value={formData.contactName}
											onChange={(e) =>
												handleInputChange('contactName', e.target.value)
											}
											placeholder='Enter contact name'
											className={errors.contactName ? 'border-red-500' : ''}
										/>
										{errors.contactName && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.contactName}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='contactPhone'>Contact Phone *</Label>
										<Input
											id='contactPhone'
											value={formData.contactPhone}
											onChange={(e) =>
												handleInputChange('contactPhone', e.target.value)
											}
											placeholder='Enter contact phone'
											className={errors.contactPhone ? 'border-red-500' : ''}
										/>
										{errors.contactPhone && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.contactPhone}
											</p>
										)}
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
										<SelectTrigger
											className={`w-full ${errors.relationship
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-200 focus:ring-[#ed3237]'
												} bg-white`}
										>
											<SelectValue placeholder='Select relationship' />
										</SelectTrigger>
										<SelectContent className='bg-white'>
											<SelectItem
												value='parent'
												className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.relationship === 'parent'
													? 'bg-[#ed3237] text-white'
													: ''
													}`}
											>
												<div className='flex items-center gap-2'>
													<UserRound className='w-4 h-4' />{' '}
													{/* Optional icon */}
													<span>Parent</span>
												</div>
											</SelectItem>
											<SelectItem
												value='sibling'
												className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.relationship === 'sibling'
													? 'bg-[#ed3237] text-white'
													: ''
													}`}
											>
												<div className='flex items-center gap-2'>
													<UsersRound className='w-4 h-4' />{' '}
													{/* Optional icon */}
													<span>Sibling</span>
												</div>
											</SelectItem>
											<SelectItem
												value='spouse'
												className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.relationship === 'spouse'
													? 'bg-[#ed3237] text-white'
													: ''
													}`}
											>
												<div className='flex items-center gap-2'>
													<Heart className='w-4 h-4' /> {/* Optional icon */}
													<span>Spouse</span>
												</div>
											</SelectItem>
											<SelectItem
												value='friend'
												className={`hover:bg-[#ed3237] hover:text-white transition-colors mb-0.5 ${formData.relationship === 'friend'
													? 'bg-[#ed3237] text-white'
													: ''
													}`}
											>
												<div className='flex items-center gap-2'>
													<Smile className='w-4 h-4' /> {/* Optional icon */}
													<span>Friend</span>
												</div>
											</SelectItem>
											<SelectItem
												value='other'
												className={`hover:bg-[#ed3237] hover:text-white transition-colors ${formData.relationship === 'other'
													? 'bg-[#ed3237] text-white'
													: ''
													}`}
											>
												<div className='flex items-center gap-2'>
													<HelpCircle className='w-4 h-4' />{' '}
													{/* Optional icon */}
													<span>Other</span>
												</div>
											</SelectItem>
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
										<Label htmlFor='bankName'>Bank Name *</Label>
										<Input
											id='bankName'
											value={formData.bankName}
											onChange={(e) =>
												handleInputChange('bankName', e.target.value)
											}
											placeholder='Enter Bank name'
											className={errors.bankName ? 'border-red-500' : ''}
										/>
										{errors.bankName && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.bankName}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='accountNumber'>Account Number *</Label>
										<Input
											id='accountNumber'
											value={formData.accountNumber}
											onChange={(e) =>
												handleInputChange('accountNumber', e.target.value)
											}
											placeholder='Enter Account Number'
											className={errors.accountNumber ? 'border-red-500' : ''}
										/>
										{errors.accountNumber && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.accountNumber}
											</p>
										)}
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
										<Label htmlFor='ifscNumber'>IFSC Code *</Label>
										<Input
											id='ifscNumber'
											value={formData.ifscNumber}
											onChange={(e) =>
												handleInputChange('ifscNumber', e.target.value)
											}
											placeholder='Enter IFSC code'
											className={errors.ifscNumber ? 'border-red-500' : ''}
										/>
										{errors.ifscNumber && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.ifscNumber}
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						<div className='flex justify-between gap-4 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={handleCancel}
								className='px-8 bg-transparent'
							>
								Cancel
							</Button>
							<Button
								type='button'
								onClick={handleSubmit}
								className='px-8 hover:bg-[#ed3237] bg-red-700 text-white'
							>
								Add Tenant
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
