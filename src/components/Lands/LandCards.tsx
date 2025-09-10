import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import buildingBlue from '../../assets/properties/building-blue.png';
import buildingGreen from '../../assets/properties/building-green.png';
import buildingPink from '../../assets/properties/building-pink.png';
import locationImg from '../../assets/properties/location.png';
import callImg from '../../assets/properties/call.svg';
import editImg from '../../assets/properties/edit.png';
import trashImg from '../../assets/properties/trash.png';
import eyeImg from '../../assets/properties/eye.png';
import type { LandsDetails } from '../../features/lands/type';
// import property1 from '../../assets/properties/property1.png'
import { GetLocalStorage } from '../../utils/localstorage';
import { getImageUrl } from '../../utils/getImage';

type ModalMode = 'add' | 'view' | 'edit';

interface Props {
    property: LandsDetails;
    setOpenViewModal: (data: boolean) => void;
    setModalMode: (data: ModalMode) => void;
    setIsDeleteModalOpen: (data: boolean) => void;
    setSelectedProperty: (data: LandsDetails) => void;
    setDeleteUUID: (data: string) => void;
}

const LandCards: React.FC<Props> = ({ 
    property, 
    setOpenViewModal, 
    setModalMode, 
    setIsDeleteModalOpen, 
    setSelectedProperty, 
    setDeleteUUID,
}) => {
    const openEditModal = () => {
        setSelectedProperty(property);
        setModalMode('edit');
        setOpenViewModal(true);
    };

    const handleDeleteClick = () => {
        setDeleteUUID(property?.uuid ?? '');
        setIsDeleteModalOpen(true);
    };

    const openViewModal = () => {
        setSelectedProperty(property);
        setModalMode('view');
        setOpenViewModal(true);
    };

    const role = GetLocalStorage('role')

    return (
        <Card className='bg-white border-0 shadow-[0px_0px_15px_0px_#0000001A] px-2'>
            <CardContent className='p-0'>
                <div className='flex items-center justify-between mb-3 mx-3 -mt-3'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <p className='font-semibold text-[#000000] text-[22px]'>
                                {property.owner_information?.full_name}
                            </p>
                            <div className='flex items-center gap-2 mt-2'>
                                <img
                                    src={callImg}
                                    alt='phone icon'
                                    className='w-4 h-4 object-cover'
                                />
                                <p className='text-[14px] font-medium text-gray-500'>
                                    {property.owner_information?.phone}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            size='sm'
                            variant='outline'
                            className={`w-8 h-8 p-0 rounded-full border-[#0062FF] bg-[#0062FF] ${role === 'admin' || role === 'manager' ? `bg-[#0062FF] opacity-50 cursor-not-allowed`: ``}`}
                            onClick={role === 'admin' || role === 'manager' ? undefined : openEditModal}
                        >
                            <img src={editImg} className='w-4 h-4' alt='edit' />
                        </Button>
                        <Button
                            size='sm'
                            variant='outline'
                            className={`w-8 h-8 p-0 rounded-full border-[#EE2F2F] bg-[#EE2F2F] ${role === 'owner' ? `` : `bg-[#EE2F2F] opacity-50 cursor-not-allowed`}`}
                            onClick={role === 'owner' ? handleDeleteClick : undefined}
                        >
                            <img src={trashImg} className='w-4 h-4' alt='trash' />
                        </Button>
                    </div>
                </div>

                <div className='relative'>
                    <div className="h-58 w-full">
                        <img
                            src={getImageUrl(property?.image)}
                            alt={property.land_name || "Land Image"}
                            className="w-full h-56 rounded-xl object-cover"
                        />
                    </div>
                    <Badge className='absolute top-3 right-3 bg-white text-[#ed3237] hover:bg-white/90'>
                        {property.acre} acre
                    </Badge>
                </div>

                <div className='p-1'>
                    <div className='mb-4 flex items-center justify-between mx-1'>
                        <h3 className='font-semibold text-[#000000] mb-1'>
                            {property.land_name}
                        </h3>
                        <div className='flex items-center gap-1'>
                            <img
                                src={locationImg}
                                alt='location icon'
                                className='w-4 h-4'
                            />
                            <p className='text-sm text-[#7D7D7D]'>
                                {property.land_address}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-row justify-between gap-4 mb-3 px-2'>
                        <div className='text-center flex items-center gap-2'>
                            <div className='mb-1 bg-[#006AFF26] p-2 rounded-full'>
                                <img src={buildingBlue} alt='building' className='w-4 h-4' />
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold text-[#716F6F]'>Square Feet</p>
                                <p className='text-[#006AFF] ml-1'>{property.square_feet}</p>
                            </div>
                        </div>
                        <div className='text-center flex items-center gap-2'>
                            <div className='mb-1 bg-[#1EC95A26] p-2 rounded-full'>
                                <img src={buildingGreen} alt='building' className='w-4 h-4' />
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold text-[#716F6F]'>Cent</p>
                                <p className='text-[#1EC95A] ml-1'>{property.cent}</p>
                            </div>
                        </div>
                        <div className='text-center flex items-center gap-2'>
                            <div className='mb-1 bg-[#FF00E126] p-2 rounded-full'>
                                <img src={buildingPink} alt='building' className='w-4 h-4' />
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold text-[#716F6F]'>Acre</p>
                                <p className='text-[#FF00E1] ml-1'>{property.acre}</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        className='w-full hover:bg-[#ed3237] bg-red-700 text-white'
                        onClick={openViewModal}
                    >
                        <img src={eyeImg} alt='eye' className='w-4 h-4 mr-2' />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LandCards