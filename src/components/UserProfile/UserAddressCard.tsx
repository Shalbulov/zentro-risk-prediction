import React, { lazy, Suspense, useState, useEffect } from "react";
import Select from "../form/Select";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

// Lazy-load charts
const LineChart = lazy(() => import("../charts/line/LineChartOne"));
const BarChart = lazy(() => import("../charts/bar/BarChartOne"));
const PieChart = lazy(() => import("../charts/PieChart"));

export default function UserAnalyticsDashboard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [language, setLanguage] = useState("Русский");
  const [activeTab, setActiveTab] = useState("analytics");
  const [mapData, setMapData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("Taraz");
  const [storeTypeFilter, setStoreTypeFilter] = useState("all");

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  // Mock data with realistic values
  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [85, 72, 91, 68, 77, 54, 62],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const roleEngagementData = [
    { role: "UX/UI Designer", percentage: 78 },
    { role: "Admin", percentage: 92 },
    { role: "Developer", percentage: 85 },
    { role: "Manager", percentage: 67 },
    { role: "Analyst", percentage: 58 },
  ];

  const languagePreferencesData = {
    labels: ['Русский', 'English', 'Қазақша'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B'
        ],
        hoverOffset: 4
      }
    ]
  };

  const regionData = {
    "Astana": { users: 12500, growth: 12, retention: 78 },
    "Almaty": { users: 9800, growth: 8, retention: 72 },
    "Shymkent": { users: 4500, growth: 15, retention: 65 },
    "Aktobe": { users: 3200, growth: 5, retention: 68 },
    "Taraz": { users: 3800, growth: 18, retention: 71, stores: 50 }
  };

  // Store data for Taraz
  const tarazStores = [
    { id: 1, name: "Magnum ЦУМ", type: "supermarket", location: [71.3964, 42.8989], customers: 1200 },
    { id: 2, name: "Small Mart", type: "convenience", location: [71.4021, 42.9012], customers: 450 },
    { id: 3, name: "Green Bazaar", type: "market", location: [71.3998, 42.8956], customers: 1800 },
    { id: 4, name: "ElectroWorld", type: "electronics", location: [71.4015, 42.9003], customers: 320 },
    // ... add more stores as needed (total 50)
  ];

  const storeTypes = [
    { value: "all", label: "All Store Types" },
    { value: "supermarket", label: "Supermarkets" },
    { value: "convenience", label: "Convenience Stores" },
    { value: "market", label: "Markets" },
    { value: "electronics", label: "Electronics" },
    { value: "specialty", label: "Specialty Stores" }
  ];

  useEffect(() => {
    // Simulate loading map data
    setTimeout(() => {
      setMapData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Astana' },
            geometry: { type: 'Point', coordinates: [71.4304, 51.1282] }
          },
          {
            type: 'Feature',
            properties: { name: 'Almaty' },
            geometry: { type: 'Point', coordinates: [76.9126, 43.2220] }
          },
          {
            type: 'Feature',
            properties: { name: 'Shymkent' },
            geometry: { type: 'Point', coordinates: [69.5901, 42.3000] }
          },
          {
            type: 'Feature',
            properties: { name: 'Aktobe' },
            geometry: { type: 'Point', coordinates: [57.1667, 50.2833] }
          },
          {
            type: 'Feature',
            properties: { name: 'Taraz', focus: true },
            geometry: { type: 'Point', coordinates: [71.3964, 42.8989] }
          }
        ]
      });
    }, 500);
  }, []);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const filteredStores = storeTypeFilter === "all" 
    ? tarazStores 
    : tarazStores.filter(store => store.type === storeTypeFilter);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        {/* Header with language selector and tabs */}
    

        {activeTab === 'analytics' ? (
          <div className="space-y-8">
            {/* User Address Section */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                    User Profile
                  </h4>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Country
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        Kazakhstan
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        City/State
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        Astana, Akmola Region
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Postal Code
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        010000
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        IIN (Individual ID)
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        850417301299
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={openModal}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    />
                  </svg>
                  Edit
                </button>
              </div>

            {/* Regional Analytics Section */}

          </div>
        ) : (
          <div className="p-6 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
              User Settings
            </h5>
            <div className="space-y-6">
              <div>
                <Label>Notification Preferences</Label>
                <Select
                  value="All notifications"
                  onChange={() => {}}
                  options={[
                    { value: "All notifications", label: "All notifications" },
                    { value: "Important only", label: "Important only" },
                    { value: "None", label: "None" },
                  ]}
                  className="w-full md:w-64"
                />
              </div>
              
              <div>
                <Label>Timezone</Label>

                <Select
                  value="Asia/Almaty (GMT+6)"
                  onChange={() => {}}
                  options={[
                    { value: "Asia/Almaty (GMT+6)", label: "Asia/Almaty (GMT+6)" },
                    { value: "UTC", label: "UTC" },
                  ]}
                  className="w-full md:w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="dark-mode" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <Button>Save Preferences</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Address Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input type="text" value="Kazakhstan" />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input type="text" value="Astana, Akmola Region" />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input type="text" value="010000" />
                </div>

                <div>
                  <Label>IIN (Individual ID)</Label>
                  <Input type="text" value="850417301299" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
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