import { useState } from "react";
import { 
  FiShield,
  FiGlobe,
  FiUser,
  FiAlertCircle
} from "react-icons/fi";
import Button from "../ui/button/Button";
import Switch from "../ui/switch/Switch";
import { toast } from "react-hot-toast";

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface UserSessionsCardProps {
  sessions: Session[];
  twoFactorEnabled: boolean;
  onTerminateSession: (sessionId: string) => void;
  onToggleTwoFactor: () => void;
}

export default function UserSessionsCard({
  sessions,
  twoFactorEnabled,
  onTerminateSession,
  onToggleTwoFactor
}: UserSessionsCardProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'security'>('sessions');

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-sm dark:bg-gray-900 dark:shadow-none">
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
            {sessions.map((session) => (
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
                      onClick={() => onTerminateSession(session.id)}
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
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={twoFactorEnabled}
                onChange={onToggleTwoFactor}
              />
            </div>

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
  );
}