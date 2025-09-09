import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@radix-ui/react-dialog'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { DialogHeader } from '../ui/dialog'
import buildingBlue from '../../assets/properties/building-blue.png';
import uploadImg from '../../assets/properties/upload.png';
import toast from 'react-hot-toast'
import { useAppDispatch } from '../../Hooks/redux'
import { CreateLandsThunks, GetLandsDetailsThunks, UpdateLandsThunks } from '../../features/lands/redux/thunks'
import type { LandsDetails } from '../../features/lands/type'
import { IoMdClose } from 'react-icons/io'
import axios from 'axios'
import { getImageUrl } from '../../utils/getImage'

export type LandsDetailsForm = {
  land_name: string;
  square_feet: string;
  acre: string;
  cent: string;
  land_address: string;
  owner_full_name: string;
  owner_email: string;
  owner_phone: string;
  owner_address: string;
  uuid?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  image: string;
  land_type: string;
};

interface Props {
  setOpenViewModal: (data: boolean) => void;
  modalMode: string;
  openViewModal: boolean;
  selectedProperty?: LandsDetails | null;
  setSelectedProperty?: (data: null) => void;
}

const LandView: React.FC<Props> = ({ openViewModal, setOpenViewModal, modalMode, selectedProperty, setSelectedProperty }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const dispatch = useAppDispatch()
  const [fileUrl, setFileUrl] = useState()



  const [formData, setFormData] = useState<LandsDetailsForm>({
    land_name: "",
    square_feet: "",
    acre: "",
    cent: "",
    land_address: "",
    image: "",
    owner_full_name: "",
    owner_email: "",
    owner_phone: "",
    owner_address: "",
    land_type: "land",
  });

  useEffect(() => {
    if (selectedProperty) {
      setFormData({
        land_name: selectedProperty.land_name || "",
        square_feet: selectedProperty.square_feet || "",
        acre: selectedProperty.acre || "",
        cent: selectedProperty.cent || "",
        land_address: selectedProperty.land_address || "",
        image: getImageUrl(selectedProperty?.image) || "",
        owner_full_name: selectedProperty.owner_information?.full_name || "",
        owner_email: selectedProperty.owner_information?.email || "",
        owner_phone: selectedProperty.owner_information?.phone || "",
        owner_address: selectedProperty.owner_information?.address || "",
        land_type: "land",
        uuid: selectedProperty.uuid,
      });

      if (selectedProperty.image) {
        setUploadedImage(selectedProperty.image);
      }
    } else {
      // Reset form when adding new land
      setFormData({
        land_name: "",
        square_feet: "",
        acre: "",
        cent: "",
        land_address: "",
        image: "",
        owner_full_name: "",
        owner_email: "",
        owner_phone: "",
        owner_address: "",
        land_type: "land",
      });
      setUploadedImage(null);
    }
  }, [selectedProperty]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;

    // // Preview locally
    // const reader = new FileReader();
    // reader.onload = (e) => setUploadedImage(e.target?.result as string);
    // reader.readAsDataURL(file);

    // Upload to S3
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res: any = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === 'success') {
        toast.success("Uploaded to S3");
        setFileUrl(res.data.data)
      }
      console.log("S3 URL 2:", res.data.data);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    };
  };

  const handleSubmit = async () => {
    if (!formData.land_name || !formData.acre || !formData.land_address || !formData.owner_full_name || !formData.owner_phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      land_name: formData.land_name,
      square_feet: formData.square_feet,
      acre: formData.acre,
      cent: formData.cent,
      land_address: formData.land_address,
      owner_information: {
        full_name: formData.owner_full_name,
        email: formData.owner_email,
        phone: formData.owner_phone,
        address: formData.owner_address
      },
      image: fileUrl || "",
      land_type: "land",
    }

    try {
      if (modalMode === 'edit' && selectedProperty?.uuid) {
        await dispatch(UpdateLandsThunks(
          data,
          selectedProperty.uuid
        ));
        await dispatch(GetLandsDetailsThunks())
        toast.success(`${formData.land_name} details updated`);
      } else {
        await dispatch(CreateLandsThunks(data));
        toast.success('New land added successfully!');
      }

      setUploadedImage(null);
      setFormData({
        land_name: "",
        square_feet: "",
        acre: "",
        cent: "",
        land_address: "",
        image: "",
        owner_full_name: "",
        owner_email: "",
        owner_phone: "",
        owner_address: "",
        land_type: "land",
      });
      setOpenViewModal(false);
      setSelectedProperty?.(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (field: keyof LandsDetailsForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case 'add': return 'Add New Land';
      case 'view': return 'Land Details';
      case 'edit': return 'Edit Land Details';
      default: return 'Land';
    }
  };

  return (
    <Dialog open={openViewModal} onOpenChange={setOpenViewModal} modal={true}>
      <DialogOverlay className="fixed inset-0 bg-black/40 z-40" />
      <DialogContent className='min-w-3xl p-4 max-h-[95vh] overflow-y-auto fixed top-11/12 mt-10 left-12/16 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl no-scrollbar'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-[#3065A426] rounded-full'>
              <img src={buildingBlue} alt='building' className='w-4 h-4' />
            </div>
            <DialogTitle className='text-lg font-semibold'>
              {getModalTitle()}
            </DialogTitle>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setOpenViewModal(false);
                setSelectedProperty?.(null);
              }}
              className="rounded-full bg-gray-200 p-1 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </DialogHeader>

        <div className='space-y-1'>
          <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
            <div className='w-16 h-16 rounded-full flex items-center justify-center overflow-hidden'>
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt='Land preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-[#D9D9D9] rounded-full'></div>
              )}
            </div>
            {modalMode !== 'view' && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    className="bg-[#13A5A5] hover:bg-[#13A5A5] text-white px-4 py-2 cursor-pointer"
                    asChild
                  >
                    <span>
                      <img
                        src={uploadImg}
                        alt="upload"
                        className="w-4 h-4"
                      />
                      Upload Image
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='p-2 bg-[#3065A426] rounded-full'>
                <img src={buildingBlue} alt='building' className='w-4 h-4' />
              </div>
              <h3 className='font-semibold text-[#000000]'>
                Land Information
              </h3>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Land Name <span className='text-red-500'>*</span>
                </label>
                <Input
                  placeholder='Land Name'
                  value={formData.land_name}
                  onChange={(e) => handleInputChange('land_name', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Acre <span className='text-red-500'>*</span>
                </label>
                <Input
                  placeholder='Land Acre'
                  value={formData.acre}
                  onChange={(e) => handleInputChange('acre', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Cent
                </label>
                <Input
                  placeholder='Cent'
                  value={formData.cent}
                  onChange={(e) => handleInputChange('cent', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Square Feet
                </label>
                <Input
                  placeholder='Square Feet'
                  value={formData.square_feet}
                  onChange={(e) => handleInputChange('square_feet', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-[#7D7D7D]'>
                Address <span className='text-red-500'>*</span>
              </label>
              <Textarea
                placeholder='Enter Complete Address'
                value={formData.land_address}
                onChange={(e) => handleInputChange('land_address', e.target.value)}
                className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000] min-h-[80px]'
                disabled={modalMode === 'view'}
                required
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='p-2 bg-[#3065A426] rounded-full'>
                <img src={buildingBlue} alt='building' className='w-4 h-4' />
              </div>
              <h3 className='font-semibold text-[#000000]'>
                Owner Information
              </h3>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Owner Name <span className='text-red-500'>*</span>
                </label>
                <Input
                  placeholder='Enter Owner Name'
                  value={formData.owner_full_name}
                  onChange={(e) => handleInputChange('owner_full_name', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='Enter Email Address'
                  value={formData.owner_email}
                  onChange={(e) => handleInputChange('owner_email', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Phone <span className='text-red-500'>*</span>
                </label>
                <Input
                  placeholder='Enter Phone Number'
                  value={formData.owner_phone}
                  onChange={(e) => handleInputChange('owner_phone', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                  required
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-[#7D7D7D]'>
                  Owner Address
                </label>
                <Input
                  placeholder='Enter Owner Address'
                  value={formData.owner_address}
                  onChange={(e) => handleInputChange('owner_address', e.target.value)}
                  className='bg-white border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>
          </div>

          <div className='flex justify-between gap-3 pt-4'>
            {modalMode === 'view' ? (
              <div className='flex justify-end w-full'>
                <Button
                  onClick={() => setOpenViewModal(false)}
                  className='bg-[#ed3237] hover:bg-[#ed3237] text-white px-6 rounded-lg'
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant='outline'
                  onClick={() => {
                    setOpenViewModal(false);
                    setSelectedProperty?.(null);
                  }}
                  className='px-6 rounded-lg bg-[#EBEFF3] text-[#7D7D7D] border border-[#7D7D7D] focus-visible:ring-[#000] focus-visible:border-[#000]'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className='hover:bg-[#ed3237] bg-red-700 text-white px-6 rounded-lg border-[#e5e5e5] focus-visible:ring-[#000] focus-visible:border-[#000]'
                >
                  {modalMode === 'edit' ? 'Update Land' : 'Create Land'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LandView