import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { 
  FiEdit, FiMail, FiLock, FiShield, 
  FiEye, FiEyeOff, FiClock, FiRefreshCw,
  FiMapPin, FiGlobe, FiActivity
} from "react-icons/fi";
import Switch from "../ui/switch/Switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
  { name: 'Jan', logins: 12 },
  { name: 'Feb', logins: 19 },
  { name: 'Mar', logins: 15 },
  { name: 'Apr', logins: 28 },
  { name: 'May', logins: 32 },
  { name: 'Jun', logins: 24 },
];

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState<'email' | 'password' | 'sessions' | 'activity'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [userData, setUserData] = useState({
    email: "anarbek.a@vkorzinka.kz",
    newEmail: "",
    password: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const validateEmail = () => {
    if (!userData.newEmail) {
      setErrors(prev => ({ ...prev, email: "New email is required" }));
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(userData.newEmail)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    if (userData.newEmail !== userData.confirmPassword) {
      setErrors(prev => ({ ...prev, email: "Emails don't match" }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = () => {
    if (!userData.password) {
      setErrors(prev => ({ ...prev, password: "Current password is required" }));
      return false;
    }
    if (!userData.newPassword) {
      setErrors(prev => ({ ...prev, password: "New password is required" }));
      return false;
    }
    if (userData.newPassword.length < 8) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
      return false;
    }
    if (userData.newPassword !== userData.confirmPassword) {
      setErrors(prev => ({ ...prev, password: "Passwords don't match" }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: "" }));
    return true;
  };

  const handleSave = () => {
    if (activeTab === 'email') {
      if (!validateEmail()) return;
      
      setUserData(prev => ({
        ...prev,
        email: prev.newEmail,
        newEmail: "",
        confirmPassword: ""
      }));
    } 
    else if (activeTab === 'password') {
      if (!validatePassword()) return;
      
      setUserData(prev => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
    
    closeModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    
    if (name === "newEmail" || name === "confirmPassword") {
      setErrors(prev => ({ ...prev, email: "" }));
    }
    if (name === "password" || name === "newPassword" || name === "confirmPassword") {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const handleChangeEmail = () => {
    setActiveTab('email');
    setErrors({ email: "", password: "" });
    setUserData(prev => ({ ...prev, newEmail: "", confirmPassword: "" }));
    openModal();
  };

  const handleChangePassword = () => {
    setActiveTab('password');
    setErrors({ email: "", password: "" });
    setUserData(prev => ({ ...prev, password: "", newPassword: "", confirmPassword: "" }));
    openModal();
  };

  const handleViewSessions = () => {
    setActiveTab('sessions');
    setSelectedSession(null);
    openModal();
  };

  const handleViewActivity = () => {
    setActiveTab('activity');
    openModal();
  };

  const toggleTwoFactorAuth = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const terminateSession = (id: number) => {
    console.log("Terminating session:", id);
    setSelectedSession(null);
  };

  const sessions = [
    { 
      id: 1, 
      device: "MacBook Pro (M1, 2020)", 
      os: "macOS 14.5", 
      browser: "Chrome 125",
      ip: "192.168.1.1", 
      location: "Astana, Kazakhstan", 
      coordinates: [51.1694, 71.4491],
      time: "2025-06-17 19:45", 
      current: true 
    },
    { 
      id: 2, 
      device: "iPhone 13", 
      os: "iOS 17.5", 
      browser: "Safari",
      ip: "85.255.123.45", 
      location: "Almaty, Kazakhstan", 
      coordinates: [43.2565, 76.9285],
      time: "2025-06-16 14:20", 
      current: false 
    },
    { 
      id: 3, 
      device: "Windows PC", 
      os: "Windows 11", 
      browser: "Firefox 120",
      ip: "92.113.45.67", 
      location: "Moscow, Russia", 
      coordinates: [55.7558, 37.6176],
      time: "2025-06-15 09:10", 
      current: false 
    }
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm dark:bg-gray-900 dark:shadow-none">
      <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Account Security
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your account security settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleViewActivity}>
            <FiActivity className="mr-2" />
            View Activity
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Section */}
        <div className="flex flex-col p-5 border border-gray-200 rounded-xl dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <FiMail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white/90">Email Address</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">Primary contact email</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-auto">
            <p className="text-gray-800 dark:text-white/90 truncate">{userData.email}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleChangeEmail}
              className="shrink-0"
            >
              <FiEdit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Password Section */}
        <div className="flex flex-col p-5 border border-gray-200 rounded-xl dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <FiLock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white/90">Password</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 2 weeks ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-auto">
            <p className="text-gray-800 dark:text-white/90">
              {showPassword ? "yourpassword123" : "••••••••"}
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-sm text-blue-600 dark:text-blue-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleChangePassword}
              className="shrink-0"
            >
              <FiRefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="flex flex-col p-5 border border-gray-200 rounded-xl dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <FiShield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white/90">Two-Factor Authentication</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">Extra layer of security</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${twoFactorEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                {twoFactorEnabled ? "Active" : "Inactive"}
              </span>
            </div>
            <Switch 
              checked={twoFactorEnabled}
              onChange={toggleTwoFactorAuth}
            />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="flex flex-col p-5 border border-gray-200 rounded-xl dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <FiClock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white/90">Active Sessions</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">{sessions.length} devices</p>
            </div>
          </div>
          <div className="mt-auto">
            <Button 
              variant="outline" 
              onClick={handleViewSessions}
              className="w-full"
            >
              Manage Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="p-5 mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl dark:from-blue-900/20 dark:to-emerald-900/20">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h5 className="font-medium text-gray-800 dark:text-white/90">Security Tips</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enable two-factor authentication and use a password manager for better security.
            </p>
          </div>
          <Button size="sm" variant="outline" className="whitespace-nowrap">
            Learn More
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl">
        <div className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-900">
          <div className="p-6 pb-0">
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {activeTab === 'email' && 'Change Email Address'}
              {activeTab === 'password' && 'Change Password'}
              {activeTab === 'sessions' && 'Active Sessions'}
              {activeTab === 'activity' && 'Account Activity'}
            </h4>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {activeTab === 'email' && 'Update your primary email address'}
              {activeTab === 'password' && 'Set a new secure password'}
              {activeTab === 'sessions' && 'Manage your active login sessions'}
              {activeTab === 'activity' && 'View your account activity history'}
            </p>
          </div>
          
          <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-6 pb-6">
            {activeTab === 'email' && (
              <div className="space-y-5">
                <div>
                  <Label>Current Email</Label>
                  <Input 
                    type="email" 
                    value={userData.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label>New Email Address</Label>
                  <Input 
                    type="email" 
                    name="newEmail"
                    value={userData.newEmail}
                    onChange={handleInputChange}
                    placeholder="Enter new email"
                    error={errors.email}
                  />
                </div>
                <div>
                  <Label>Confirm New Email</Label>
                  <Input 
                    type="email" 
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter new email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-5">
                <div>
                  <Label>Current Password</Label>
                  <Input 
                    type="password" 
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    name="newPassword"
                    value={userData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must be at least 8 characters
                  </p>
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input 
                    type="password" 
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter new password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedSession === session.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}
                    onClick={() => setSelectedSession(session.id === selectedSession ? null : session.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${session.current ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {session.current ? (
                          <FiShield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <FiGlobe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate text-gray-800 dark:text-white/90">
                          {session.device} {session.current && "(This device)"}
                        </h5>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedSession === session.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">IP Address</p>
                            <p className="text-gray-800 dark:text-white/90">{session.ip}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Browser</p>
                            <p className="text-gray-800 dark:text-white/90">{session.browser}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">OS</p>
                            <p className="text-gray-800 dark:text-white/90">{session.os}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Coordinates</p>
                            <p className="text-gray-800 dark:text-white/90">
                              {session.coordinates.join(", ")}
                            </p>
                          </div>
                        </div>
                        {!session.current && (
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                terminateSession(session.id);
                              }}
                            >
                              Terminate Session
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <h5 className="mb-4 font-medium text-gray-800 dark:text-white/90">
                    Login Activity (Last 6 Months)
                  </h5>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="logins" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ r: 4, fill: '#3b82f6' }}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h5 className="mb-3 font-medium text-gray-800 dark:text-white/90">
                    Recent Security Events
                  </h5>
                  <div className="space-y-3">
                    {[
                      { id: 1, action: "Password changed", time: "2 weeks ago", icon: <FiLock /> },
                      { id: 2, action: "Login from new device", time: "3 days ago", icon: <FiGlobe /> },
                      { id: 3, action: "Two-factor authentication enabled", time: "1 month ago", icon: <FiShield /> },
                      { id: 4, action: "Recovery email added", time: "1 month ago", icon: <FiMail /> },
                    ].map(event => (
                      <div key={event.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          {event.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-white/90">{event.action}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {(activeTab === 'email' || activeTab === 'password') && (
            <div className="flex items-center justify-end gap-3 p-6 pt-0 mt-6">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}