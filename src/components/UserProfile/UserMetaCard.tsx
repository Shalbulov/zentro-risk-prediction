import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { 
  FiEdit, 
  FiCalendar, 
  FiPhone, 
  FiMapPin, 
  FiUser, 
  FiShield, 
  FiClock, 
  FiLogIn,
  FiMail,
  FiGlobe,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiAlertCircle
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import Switch from "../ui/switch/Switch";
import { toast } from "react-hot-toast";

// Types
interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  city: string;
  role: string;
  status: string;
  registrationDate: string;
  lastActivity: string;
  loginCount: number;
  avatar: string;
  email: string;
  birthDate: string;
  twoFactorEnabled: boolean;
  sessions: Session[];
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const userId = 1;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarScale, setAvatarScale] = useState(1);
  const [avatarEditor, setAvatarEditor] = useState<AvatarEditor | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState<'basic' | 'security'>('basic');
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState<'sessions' | 'security'>('sessions');

  // Mock data fetch
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserData({
        firstName: "Alex",
        lastName: "Johnson",
        phone: "+1 (555) 123-4567",
        bio: "Senior Product Designer",
        city: "San Francisco",
        role: "admin",
        status: "active",
        registrationDate: "2022-05-15",
        lastActivity: "2023-06-20 14:30",
        loginCount: 142,
        avatar: "/images/user/owner.png",
        email: "alex.johnson@example.com",
        birthDate: "1990-08-24",
        twoFactorEnabled: false,
        sessions: [
          {
            id: "1",
            device: "MacBook Pro",
            browser: "Chrome",
            ip: "192.168.1.1",
            location: "San Francisco, US",
            lastActive: "2023-06-20T14:30:00Z",
            current: true
          },
          {
            id: "2",
            device: "iPhone 13",
            browser: "Safari",
            ip: "192.168.1.2",
            location: "New York, US",
            lastActive: "2023-06-18T09:15:00Z",
            current: false
          },
          {
            id: "3",
            device: "Windows PC",
            browser: "Firefox",
            ip: "192.168.1.3",
            location: "London, UK",
            lastActive: "2023-06-10T22:45:00Z",
            current: false
          }
        ]
      });
      setLoading(false);
    };
    
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (avatarEditor && tempAvatar) {
        const canvas = avatarEditor.getImageScaledToCanvas();
        const newAvatarUrl = canvas.toDataURL();
        setUserData((prev) => prev ? { ...prev, avatar: newAvatarUrl } : null);
      }
      
      toast.success("Profile updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserData({
        ...userData,
        twoFactorEnabled: !userData.twoFactorEnabled
      });
      
      toast.success(
        userData.twoFactorEnabled 
          ? "Two-factor authentication disabled" 
          : "Two-factor authentication enabled"
      );
    } catch (error) {
      toast.error("Failed to update two-factor settings");
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    if (!userData) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserData({
        ...userData,
        sessions: userData.sessions.filter(session => session.id !== sessionId)
      });
      
      toast.success("Session terminated successfully");
    } catch (error) {
      toast.error("Failed to terminate session");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setTempAvatar(url);
    }
  };


  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-sm dark:bg-gray-900 dark:shadow-none">
        <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 overflow-hidden border-2 border-white rounded-full shadow-lg dark:border-gray-800">
                <img 
                  src={userData.avatar} 
                  alt="user" 
                  className="object-cover w-full h-full"
                />
              </div>
              <label className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 p-1 transition-all duration-200 bg-green-600 rounded-full cursor-pointer hover:bg-green-700 group-hover:opacity-100 opacity-0">
                <FiEdit className="w-3 h-3 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                {userData.firstName} {userData.lastName}
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                  {userData.role}
                </span>
              </h4>
              <p className="text-gray-500 dark:text-gray-400">{userData.bio}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEditMode('basic');
                openModal();
              }}
            >
              <FiEdit className="mr-2" />
              Edit Profile
            </Button>

          </div>
        </div>

        {/* Detailed Info Sections */}
<div className="grid gap-6 mb-6 md:grid-cols-2">
          {/* Personal Info Card */}
          <div className="p-5 border border-gray-200 rounded-xl dark:border-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Personal Information
            </h5>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiMail className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-800 dark:text-white/90">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-800 dark:text-white/90">{userData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiCalendar className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-gray-800 dark:text-white/90">
                    {new Date(userData.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-800 dark:text-white/90">
                    {userData.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="p-5 border border-gray-200 rounded-xl dark:border-gray-800">
            <h5 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Security Overview
            </h5>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <FiShield className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Password</p>
                    <p className="text-gray-800 dark:text-white/90">
                      {showPassword ? userData.password : '••••••••'}
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-green-600 dark:text-green-400"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setEditMode('security');
                    openModal();
                  }}
                >
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <FiGlobe className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="text-gray-800 dark:text-white/90">
                      {new Date(userData.lastActivity).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
                  Secure
                </span>
              </div>
              <div className="p-3 text-sm text-center text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-400">
                Last password change: 3 months ago
              </div>
            </div>
          </div>
        </div>
          
          {/* Enhanced Security Card */}
          <div className="p-5 border border-gray-200 rounded-xl dark:border-gray-800">
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4">
              <button
                className={`flex-1 py-2 font-medium text-center ${activeTab === 'sessions' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('sessions')}
              >
                Active Sessions
              </button>
              <button
                className={`flex-1 py-2 font-medium text-center ${activeTab === 'security' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </div>

            {activeTab === 'sessions' ? (
              <div className="space-y-4">
                {userData.sessions.map((session) => (
                  <div key={session.id} className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${session.current ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {session.current ? (
                            <FiUser className="w-4 h-4" />
                          ) : (
                            <FiGlobe className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {session.device} • {session.browser}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.location} • {session.ip}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Last active: {new Date(session.lastActive).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Terminate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FiShield className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">Password</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last changed 3 months ago
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setEditMode('security');
                      openModal();
                    }}
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FiShield className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={userData.twoFactorEnabled}
                    onChange={toggleTwoFactor}
                  />
                </div>

                {/* <div className="p-3 text-sm text-center text-gray-500 bg-green-50 rounded-lg dark:bg-green-900/20 dark:text-gray-400">
                  <FiAlertCircle className="inline-block w-4 h-4 mr-1" />
                  For security, we recommend enabling two-factor authentication.
                </div> */}
                      <div className="p-5 mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl dark:from-blue-900/20 dark:to-emerald-900/20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h5 className="font-medium text-gray-800 dark:text-white/90">Security Tips</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                  For security, we recommend enabling two-factor authentication.
            </p>
          </div>
          <Button size="sm" variant="outline" className="whitespace-nowrap">
            Learn More
          </Button>
        </div>
      </div>
              </div>
            )}
          </div>
        </div>

        {/* ... (rest of the component remains the same until the modal) ... */}

        {/* Enhanced Edit Modal */}
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl">
          <div className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
            {/* ... (modal header and tabs remain the same) ... */}
            <div className="p-6 pb-0">
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {editMode === 'basic' ? 'Edit Profile' : 'Security Settings'}
            </h4>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {editMode === 'basic' ? 
                'Update your personal information' : 
                'Manage your account security settings'}
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            <button
              className={`flex-1 py-3 font-medium text-center ${editMode === 'basic' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setEditMode('basic')}
            >
              Profile
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center ${editMode === 'security' ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400 dark:border-green-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setEditMode('security')}
            >
              Security
            </button>
          </div>
            <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={editMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                {editMode === 'basic' ? (
                  <div className="space-y-6 pt-6">
                    {/* Avatar Editor */}
                    {tempAvatar && (
                      <div className="flex flex-col items-center gap-4">
                        <AvatarEditor
                          ref={(ref) => setAvatarEditor(ref)}
                          image={tempAvatar}
                          width={150}
                          height={150}
                          border={50}
                          borderRadius={100}
                          color={[255, 255, 255, 0.6]}
                          scale={avatarScale}
                          rotate={0}
                        />
                        <div className="w-full max-w-xs">
                          <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">Zoom</label>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={avatarScale}
                            onChange={(e) => setAvatarScale(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <Label>First Name</Label>
                        <Input 
                          type="text" 
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input 
                          type="text" 
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input 
                          type="email" 
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input 
                          type="tel" 
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input 
                          type="date" 
                          name="birthDate"
                          value={userData.birthDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input 
                          type="text" 
                          name="city"
                          value={userData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Bio</Label>
                        <Input 
                          type="text" 
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                    <div className="space-y-6 pt-6">
                      <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                        <h5 className="mb-2 font-medium text-gray-800 dark:text-white/90">Password Change</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Update your password to keep your account secure. Make sure it's at least 8 characters long.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Current Password</Label>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordInputChange}
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            onIconClick={() => setShowPassword(!showPassword)}
                          />
                        </div>
                        <div>
                          <Label>New Password</Label>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Enter new password"
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            onIconClick={() => setShowPassword(!showPassword)}
                          />
                        </div>
                        <div>
                          <Label>Confirm New Password</Label>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            placeholder="Re-enter new password"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-white/90">Two-Factor Authentication</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {userData.twoFactorEnabled
                                ? "Currently enabled for your account"
                                : "Add an extra layer of security to your account"}
                            </p>
                          </div>
                          <Switch 
                            checked={userData.twoFactorEnabled}
                            onChange={toggleTwoFactor}
                          />
                        </div>
                        {!userData.twoFactorEnabled && (
                          <button className="mt-2 text-sm text-green-600 hover:underline dark:text-green-400">
                            Learn how to set up 2FA
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-0 mt-6">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button 
                onClick={editMode === 'basic' ? handleSave : handlePasswordChange} 
                loading={loading}
              >
                {editMode === 'basic' ? 'Save Changes' : 'Update Password'}
              </Button>
            </div>
          </div>
        {/* ... rest of your modal content ... */}
        </Modal>
      {/* Remove this extra closing div: </div> */}
    </>
  );
}