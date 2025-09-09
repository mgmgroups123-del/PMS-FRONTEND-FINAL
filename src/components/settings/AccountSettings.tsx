import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { BsCloudUpload } from "react-icons/bs";
import profilePlaceholder from "../../assets/profileicon.png";
import { FONTS } from "../../constants/ui constants";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getProfileThunk } from "../../features/settings/reducers/thunks";
import { selectProfile } from "../../features/settings/reducers/selectors";
import { updateProfileData } from "../../features/settings/service";
import { GetLocalStorage } from "../../utils/localstorage";
import axios from "axios";
import { getImageUrl } from "../../utils/getImage";

export default function AccountSettings() {
  const dispatch = useDispatch<any>();
  const profileData = useSelector(selectProfile);
  console.log("Prf", profileData)
  const [isEditing, setIsEditing] = useState(false);
  const [, setProfileImage] = useState(profilePlaceholder);
  const [formData, setFormData] = useState({
    first_name: profileData?.first_name,
    last_name: profileData?.last_name,
    role: profileData?.role,
    email: profileData?.email,
    phone_number: profileData?.phone_number || "--",
    address: profileData?.address || "--",
    image: getImageUrl(profileData?.image),
  });
  const [, setFileUrl] = useState();
  const fileInputRef = useRef<any>(null);

  // Fetch profile data
  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  // Update form state when profileData changes
  useEffect(() => {
    if (profileData?.data) {
      const data = profileData.data;
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        role: data.role || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        image: getImageUrl(profileData?.image) || "",
      });
      setProfileImage(data.image || profilePlaceholder);
    }
  }, [profileData]);

  const handleUploadClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  // const handleFileChange = (event: any) => {
  //   const file = event.target.files[0];
  //   if (file && file.type.startsWith("image/")) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const imageData = reader.result as string;
  //       setProfileImage(imageData);
  //       setFormData((prev) => ({ ...prev, image: imageData }));
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     toast.error("Please upload a valid image file (JPG or PNG).");
  //   }
  // };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      if (!profileData?.uuid) return toast.error("User ID not found");
      await updateProfileData(profileData?.uuid, formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      dispatch(getProfileThunk()); // refresh data
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

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
      if (res?.data?.status === 'success') {
        toast.success("Uploaded to S3");
        setFileUrl(res.data.data)
        setFormData((prev) => ({ ...prev, image: res?.data?.data }));
      }
      console.log("S3 URL 2:", res.data.data);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    };
  };

  const role = GetLocalStorage('role')

  return (
    <>
      <div className="flex justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-[24px] mb-4">
          <CgProfile size={22} className="text-blue-600" /> Profile Information
        </h2>

        <div>
          {!isEditing ? (
            <Button
              className={`bg-red-700 text-white px-6 py-2 rounded-md hover:bg-[#ed3237] ${role === 'owner' ? ``: `bg-red-700 opacity-50 cursor-not-allowed`}`}
              style={FONTS.button_Text}
              onClick={() => {role === 'owner' ? setIsEditing(true) : undefined}}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:opacity-90"
              style={FONTS.button_Text}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="border-[0.5px] mb-5 text-[#EBEFF3]"></div>

      {/* Profile Picture Upload */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={getImageUrl(profileData?.image)}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <p className="text-[16px] text-[#716F6F] font-semibold">
            JPG, PNG, up to 5 MB
          </p>
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-white mt-2 ${isEditing
                ? "bg-[#13A5A5] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
              }`}
            onClick={handleUploadClick}
          >
            <BsCloudUpload size={18} />
            <span>Upload Photo</span>
          </div>
          <Input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Account Form */}
      <form className="grid grid-cols-2 gap-4 text-[#7D7D7D]">
        <div>
          <label className="block text-[18px] font-medium mb-1">
            Full Name
          </label>
          <Input
            type="text"
            value={`${formData.first_name} ${formData.last_name}`.trim()}
            onChange={(e) => {
              const [first = "", ...last] = e.target.value.split(" ");
              handleInputChange("first_name", first);
              handleInputChange("last_name", last.join(" "));
            }}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-[18px] font-medium mb-1">Role</label>
          <Input
            type="text"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            disabled={true}
          />
        </div>
        <div>
          <label className="block text-[18px] font-medium mb-1">
            Email Address
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={true}
          />
        </div>

        <div>
          <label className="block text-[18px] font-medium mb-1">
            Phone Number
          </label>
          <Input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[18px] font-medium mb-1">Address</label>
          <Input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </form>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end mt-6">
          <Button
            className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-[#ed3237] "
            style={FONTS.button_Text}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      )}
    </>
  );
}
