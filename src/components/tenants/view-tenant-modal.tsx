'use client';

import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { X } from 'lucide-react';
import type { TenantFormData } from './create-tenant-form';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../components/ui/card';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleTenantData } from '../../features/tenants/reducers/Thunks';
import { singleTenantSelector } from '../../features/tenants/reducers/Selector';

export interface Tenant {
	id: string;
	name: string;
	email: string;
	phone: string;
	rent: string;
	deposit: string;
	leaseStart: string;
	leaseEnd: string;
	status: 'Paid' | 'Pending' | 'Overdue';
	daysRemaining: number;
	emergency: string;
	emergencyPhone: string;
	avatar: string;
	fullData?: TenantFormData;
}

interface ViewTenantModalProps {
	isOpen: boolean;
	tenant: any | null;
	onClose: () => void;
}

export default function ViewTenantModal({
	isOpen,
	tenant,
	onClose,
}: ViewTenantModalProps) {
	if (!isOpen || !tenant) return null;

	const dispatch = useDispatch<any>();
	const singleTenantData = useSelector(singleTenantSelector)?.data;

	useEffect(() => {
		const fetchTenantId = async () => {
			await dispatch(
				getSingleTenantData({
					uuid: tenant?.uuid,
				})
			);
		};
		fetchTenantId();
	}, []);

	return (
		<>
			<div
				className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40'
				onClick={onClose}
			></div>
			<div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
				<div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar'>
					<div className='space-y-6 p-6'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold text-gray-800'>
								Tenant Details -{' '}
								{singleTenantData?.personal_information?.full_name}
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
									Personal Information
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Full Name</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.personal_information?.full_name}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Email Address</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.personal_information?.email}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Phone Number</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.personal_information?.phone}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Address</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.personal_information?.address}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Tenant Type</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.tenant_type === 'rent'
											? 'Rent'
											: 'Lease'}
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
									Property Information
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Property Name</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.unit?.propertyId?.property_name || singleTenantData?.unit?.land_name}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Property Type</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.unit?.propertyId?.property_type || 
										"Land"}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Unit</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.unit?.unit_name || "--"}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Property Information</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.unit?.unit_address || singleTenantData?.unit?.land_address}
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										3
									</div>
									Financial Information
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Monthly Rent</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										₹
										{singleTenantData?.financial_information
											? Number.parseInt(singleTenantData?.rent).toLocaleString()
											: '0'}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Security Deposit</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										₹
										{singleTenantData?.deposit
											? Number.parseInt(
													singleTenantData?.deposit
											  ).toLocaleString()
											: '0'}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Bank Name</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.bank_details?.bank_name}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Account Number</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.bank_details?.account_number}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Bank Branch</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.bank_details?.bank_branch}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>IFSC Number</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.bank_details?.bank_IFSC}
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className='bg-blue-50 rounded-t-lg'>
								<CardTitle className='flex items-center gap-2 text-blue-700'>
									<div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold'>
										4
									</div>
									{singleTenantData?.tenant_type === 'rent' ? 'Rent & Contract Details' : 'Lease & Contract Details'}
								</CardTitle>
							</CardHeader>
							<CardContent className='p-6 grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>{singleTenantData?.tenant_type === 'rent' ? 'Rent Start Date' : 'Lease Start Date'}</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.lease_duration?.start_date.split('T')[0]}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>{singleTenantData?.tenant_type === 'rent' ? 'Rent End Date' : 'Lease End Date'}</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.lease_duration?.end_date.split('T')[0]}
									</div>
								</div>
								{singleTenantData?.tenant_type === 'rent' && (<div className='space-y-2'>
									<Label>Rent Due Date</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.lease_duration?.due_date}
									</div>
								</div>)}
								<div className='space-y-2'>
									<Label>Emergency Contact Name</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.emergency_contact?.name}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Emergency Contact Phone</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.emergency_contact?.phone}
									</div>
								</div>
								<div className='space-y-2'>
									<Label>Relationship</Label>
									<div className='p-2 bg-gray-50 rounded border text-sm'>
										{singleTenantData?.emergency_contact?.relation}
									</div>
								</div>
							</CardContent>
						</Card>

						<div className='flex justify-end pt-4'>
							<Button
								onClick={onClose}
								className='px-8 hover:bg-[#ed3237] bg-red-700 text-white'
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
