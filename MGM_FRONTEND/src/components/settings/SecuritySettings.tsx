import { FONTS } from "../../constants/ui constants";
import { TbLockPassword } from "react-icons/tb";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { updatePassword } from "../../features/settings/service"; // <-- adjust path if needed
import toast from "react-hot-toast";
import { GetLocalStorage } from "../../utils/localstorage";

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
     
      await updatePassword( {
        old_password: currentPassword,
        new_password: newPassword
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const role = GetLocalStorage('role')

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold mb-4 flex items-center gap-2">
          <TbLockPassword size={22} className="text-blue-600" /> Change Password
        </h2>
        <div className="border-[0.5px] mb-5 text-[#EBEFF3]"></div>
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[18px] font-medium text-[#7D7D7D] mb-1">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[18px] text-[#7D7D7D] font-medium mb-1">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-[14px]"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[18px] text-[#7D7D7D] font-medium mb-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-[14px]"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            className={`mt-4 bg-red-700 text-white px-6 py-2 rounded-md hover:bg-[#ed3237] ${role === 'owner' ? ``: `bg-red-700 opacity-50 cursor-not-allowed`}`}
            style={FONTS.button_Text}
            onClick={role === 'owner' ? handleUpdatePassword : undefined}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
