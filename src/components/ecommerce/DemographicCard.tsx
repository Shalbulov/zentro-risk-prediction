import { useState, useEffect, useMemo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import CountryMap from "./CountryMap";

interface RegionData {
  id: string;
  code: string; // Region code for map (e.g., "KZ-ALA")
  name: string;
  customers: number;
  percentage: number;
  icon: string;
  color?: string;
  latLng: [number, number];
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prepare map markers from regions data
  const mapMarkers = useMemo(() => {
    return regions.map(region => ({
      name: region.name,
      latLng: region.latLng,
      value: region.customers
    }));
  }, [regions]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData: RegionData[] = [
          {
            id: "almaty",
            code: "KZ-ALA",
            name: "Алматинская область",
            customers: 1234,
            percentage: 65,
            icon: "./images/regions/almaty.svg",
            color: "#4F46E5",
            latLng: [45, 78]
          },
          {
            id: "nur-sultan",
            code: "KZ-AST",
            name: "Нур-Султан",
            customers: 589,
            percentage: 31,
            icon: "./images/regions/almaty.svg",
            color: "#10B981",
            latLng: [51.16, 71.47]
          },
          {
            id: "shymkent",
            code: "KZ-SHY",
            name: "Шымкент",
            customers: 342,
            percentage: 18,
            icon: "./images/regions/almaty.svg",
            color: "#F59E0B",
            latLng: [42.3, 69.6]
          },
        ];

        const total = mockData.reduce((sum, region) => sum + region.customers, 0);
        setRegions(mockData);
        setTotalCustomers(total);
        setSelectedRegion(mockData[0]); // Select first region by default
      } catch (err) {
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleRegionClick = (region: RegionData) => {
    setSelectedRegion(region);
  };

  const handleMapRegionClick = (regionCode: string) => {
    const region = regions.find(r => r.code === regionCode);
    if (region) {
      setSelectedRegion(region);
    }
  };

  const handleMarkerClick = (event: any, markerIndex: number) => {
    const clickedRegion = regions[markerIndex];
    if (clickedRegion) {
      setSelectedRegion(clickedRegion);
    }
  };

  const handleGenerateReport = () => {
    closeDropdown();
    console.log("Генерация полного отчёта...", { regions, totalCustomers });
    alert(`Отчёт сгенерирован. Всего клиентов: ${totalCustomers}`);
  };

  const handleDelete = () => {
    closeDropdown();
    console.log("Удаление демографической карты...");
    alert("Карта демографии удалена");
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="text-center py-6 text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mx-auto mt-2 block rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Демография клиентов
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            {selectedRegion
              ? `${selectedRegion.name}: ${selectedRegion.customers.toLocaleString()} клиентов (${selectedRegion.percentage}%)`
              : `Всего клиентов по Казахстану: ${totalCustomers.toLocaleString()}`}
          </p>
        </div>
        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle p-1">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-6 w-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={handleGenerateReport}
              className="flex w-full text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Полный отчёт
            </DropdownItem>
            <DropdownItem
              onItemClick={handleDelete}
              className="flex w-full text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Удалить
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
{/* Replace the current map container with this simplified version */}
<div className="relative my-6 w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
  <div className="h-0 pb-[60%]"> {/* Maintain aspect ratio */}
    <div className="absolute inset-0 flex items-center justify-center">
      <CountryMap
        markers={mapMarkers}
        onRegionClick={handleMapRegionClick}
        onMarkerClick={handleMarkerClick}
        selectedRegionCode={selectedRegion?.code}
        mapColor="#E5E7EB"
        className="h-full w-full"
      />
    </div>
  </div>
</div>

      <div className="space-y-5">
        {regions.map((region) => (
          <div 
            key={region.id} 
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedRegion?.id === region.id ? 'bg-gray-100 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/3'}`}
            onClick={() => handleRegionClick(region)}
          >
            <div className="flex items-center gap-3">
              <img
                src={region.icon}
                alt={region.name}
                className="w-6 h-6 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
                  {region.name}
                </p>
                <span className="block text-gray-500 text-xs dark:text-gray-400">
                  {region.customers.toLocaleString()} Клиентов
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative block h-2 w-[100px] rounded bg-gray-200 dark:bg-gray-800">
                <div 
                  className="absolute left-0 top-0 h-full rounded"
                  style={{
                    width: `${region.percentage}%`,
                    backgroundColor: region.color || '#4F46E5'
                  }}
                ></div>
              </div>
              <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                {region.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}