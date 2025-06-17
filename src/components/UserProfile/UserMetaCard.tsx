import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { FiEdit, FiCalendar, FiPhone, FiMapPin, FiUser, FiShield, FiClock, FiLogIn } from "react-icons/fi";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [userData, setUserData] = useState({
    firstName: "Admin",
    lastName: "Nurtayeva",
    phone: "+7 707 845 22 91",
    bio: "UX/UI Designer",
    birthDate: "",
    city: "Astana",
    country: "Kazakhstan",
    role: "UX/UI Designer",
    status: "Active",
    registrationDate: "2024-11-10",
    lastActivity: "2025-06-17 19:45",
    loginCount: 238
  });

  const handleSave = () => {
    // In a real app, you would save to API here
    console.log("Saved changes:", userData);
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload the file
      console.log("New avatar selected:", e.target.files[0]);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative group">
              <div className="w-20 h-20 overflow-hidden border-2 border-gray-200 rounded-full dark:border-gray-700">
                <img 
                  src="/images/user/owner.png" 
                  alt="user" 
                  className="object-cover w-full h-full"
                />
              </div>
              <label className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 p-1 transition-all duration-200 bg-[#61962e] rounded-full cursor-pointer group-hover:bg-[#4d7a25]">
                <FiEdit className="w-3 h-3 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {userData.firstName} {userData.lastName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData.role}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData.city}, {userData.country}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <FiEdit className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Additional User Info */}
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <FiCalendar className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
              <p className="text-gray-800 dark:text-white/90">
                {userData.birthDate || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <FiPhone className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-gray-800 dark:text-white/90">{userData.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <FiMapPin className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-gray-800 dark:text-white/90">
                {userData.city}, {userData.country}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <FiShield className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
              <p className="text-gray-800 dark:text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {userData.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <FiClock className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</p>
              <p className="text-gray-800 dark:text-white/90">{userData.registrationDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50">
            <FiLogIn className="flex-shrink-0 w-5 h-5 mt-0.5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Login Count</p>
              <p className="text-gray-800 dark:text-white/90">{userData.loginCount}</p>
            </div>
          </div>
        </div>

        {/* Help text */}
      <div className="p-5 mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl dark:from-blue-900/20 dark:to-emerald-900/20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h5 className="font-medium text-gray-800 dark:text-white/90">Tips</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
Update your contact details to avoid missing important notifications.
Your status determines access to functionality. In case of blocking - contact support.
            </p>
          </div>
          <Button size="sm" variant="outline" className="whitespace-nowrap">
            Learn More
          </Button>
        </div>
      </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>First Name</Label>
                  <Input 
                    type="text" 
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Last Name</Label>
                  <Input 
                    type="text" 
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Phone</Label>
                  <Input 
                    type="tel" 
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Date of Birth</Label>
                  <Input 
                    type="date" 
                    name="birthDate"
                    value={userData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Role</Label>
                  <Input 
                    type="text" 
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>City</Label>
                  <Input 
                    type="text" 
                    name="city"
                    value={userData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <Label>Country</Label>
                  <Input 
                    type="text" 
                    name="country"
                    value={userData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}