import { useState } from "react";
import { 
  FiAlertCircle, 
  FiBarChart2, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign, 
  FiPackage, 
  FiPlay, 
  FiSettings, 
  FiUsers,
  FiX,
  FiPlus
} from "react-icons/fi";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'history'>('overview');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    metric: '',
    condition: 'greater',
    value: '',
    notification: true
  });

  const handleCreateRule = () => {
    alert(`New rule created: ${JSON.stringify(newRule, null, 2)}`);
    setNewRule({
      name: '',
      metric: '',
      condition: 'greater',
      value: '',
      notification: true
    });
  };

  const videoData = {
    title: "How to Configure Rules for Threat Detection",
    description: "Learn how to set up notification rules for your analytics dashboards with this step-by-step tutorial.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/images/video-thumbnail.png"
  };

  return (
    <div>
      <PageMeta
        title="Korzinka BI - Rules"
        description="Configure notification rules for your analytics"
      />
      <PageBreadcrumb pageTitle="Rules" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-white/[0.05] dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white/90 sm:text-3xl">
            Rules
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure notification rules for your analytics dashboards
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <ul className="-mb-px flex flex-wrap">
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`inline-block rounded-t-lg p-4 ${activeTab === 'overview' ? 'border-b-2 border-[#61962e] text-[#61962e]' : 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Overview
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('rules')}
                className={`inline-block rounded-t-lg p-4 ${activeTab === 'rules' ? 'border-b-2 border-[#61962e] text-[#61962e]' : 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
                aria-current="page"
              >
                My Rules
              </button>
            </li>
            <li className="mr-2">
              <button
                onClick={() => setActiveTab('history')}
                className={`inline-block rounded-t-lg p-4 ${activeTab === 'history' ? 'border-b-2 border-[#61962e] text-[#61962e]' : 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Notification History
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800 dark:text-white/90">
                <FiAlertCircle className="mr-2 text-[#61962e]" />
                Rules Functionality
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Rules functionality notifies you about specific (configured) changes in your built visualizations 
                (notification rules are set up individually).
              </p>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                You configure recommendation analytics for prompt notification about emerging network threats. 
                For this, you define critical indicator values that signal problems requiring immediate attention. 
                As soon as such situations are detected by the system, you will receive a threat notification.
              </p>

              <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800 dark:text-white/90">
                <FiSettings className="mr-2 text-[#61962e]" />
                Functionality allows you to:
              </h3>
              <ul className="mb-6 space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <FiBarChart2 className="mr-2 mt-1 text-[#61962e]" />
                  <span>Track growth or decline in sales metrics</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mr-2 mt-1 text-[#61962e]" />
                  <span>Monitor plan fulfillment</span>
                </li>
                <li className="flex items-start">
                  <FiDollarSign className="mr-2 mt-1 text-[#61962e]" />
                  <span>Timely adjust prices</span>
                </li>
                <li className="flex items-start">
                  <FiPackage className="mr-2 mt-1 text-[#61962e]" />
                  <span>Minimize excess inventory</span>
                </li>
                <li className="flex items-start">
                  <FiUsers className="mr-2 mt-1 text-[#61962e]" />
                  <span>Monitor process participant obligations</span>
                </li>
              </ul>

              {/* Video Preview */}
              <div 
                className="group relative cursor-pointer rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-md dark:bg-gray-800"
                onClick={() => setShowVideoModal(true)}
              >
                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
                  <img 
                    src={videoData.thumbnail} 
                    alt="Video thumbnail" 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 group-hover:bg-black/40">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#61962e] text-white transition-transform duration-300 group-hover:scale-110">
                      <FiPlay className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="mb-1 font-medium text-gray-800 dark:text-white">{videoData.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{videoData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Cards */}
          <div className="space-y-6">
            {/* Create New Rule Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Create New Rule
              </h3>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Rule Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#61962e] focus:ring-[#61962e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="e.g. Sales Threshold Alert"
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Metric to Monitor</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#61962e] focus:ring-[#61962e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={newRule.metric}
                  onChange={(e) => setNewRule({...newRule, metric: e.target.value})}
                >
                  <option value="">Select a metric</option>
                  <option value="sales">Total Sales</option>
                  <option value="inventory">Inventory Level</option>
                  <option value="conversion">Conversion Rate</option>
                  <option value="traffic">Website Traffic</option>
                </select>
              </div>
              
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Condition</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#61962e] focus:ring-[#61962e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={newRule.condition}
                    onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                  >
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                    <option value="equal">Equal to</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#61962e] focus:ring-[#61962e] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={newRule.value}
                    onChange={(e) => setNewRule({...newRule, value: e.target.value})}
                    placeholder="Threshold value"
                  />
                </div>
              </div>
              
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="notification-toggle"
                  className="h-4 w-4 rounded border-gray-300 text-[#61962e] focus:ring-[#61962e] dark:border-gray-600 dark:bg-gray-700"
                  checked={newRule.notification}
                  onChange={(e) => setNewRule({...newRule, notification: e.target.checked})}
                />
                <label htmlFor="notification-toggle" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send email notification
                </label>
              </div>
              
              <button 
                onClick={handleCreateRule}
                disabled={!newRule.name || !newRule.metric || !newRule.value}
                className="w-full rounded-lg bg-[#61962e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4d7a25] focus:outline-none focus:ring-4 focus:ring-[#61962e]/50 disabled:opacity-50 dark:bg-[#61962e] dark:hover:bg-[#4d7a25] dark:focus:ring-[#4d7a25]"
              >
                Create Rule
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('rules')}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span>View Active Rules</span>
                  <FiClock className="text-gray-400" />
                </button>
                <button 
                  onClick={() => alert("Redirecting to notification settings...")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span>Notification Settings</span>
                  <FiSettings className="text-gray-400" />
                </button>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span>Watch Tutorial</span>
                  <FiPlay className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Documentation Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                Documentation
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Detailed guides and API references for advanced rule configuration.
              </p>
              <button 
                onClick={() => alert("Redirecting to documentation...")}
                className="text-sm font-medium text-[#61962e] hover:text-[#4d7a25] dark:text-[#8bc34a] dark:hover:text-[#7cb342]"
              >
                Read Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal — z-[100000] ensures it sits ABOVE z-99999 header */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-800">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
            >
              <FiX className="h-5 w-5" />
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={videoData.url}
                className="h-[500px] w-full rounded-t-xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{videoData.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{videoData.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
