import { useState } from "react";
import { FiUpload, FiDatabase, FiActivity, FiCheckCircle, FiMoreVertical } from "react-icons/fi";
import Badge from "../ui/badge/Badge";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

type ModelVersion = {
  id: string;
  name: string;
  algorithm: string;
  datasetVersion: string;
  metrics: {
    auc: number;
    accuracy: number;
    f1: number;
  };
  status: 'training' | 'success' | 'failed';
  timestamp: string;
  isProduction: boolean;
};

export default function EcommerceCard() {
  const [activeTab, setActiveTab] = useState<'datasets' | 'models'>('datasets');
  const [isOpen, setIsOpen] = useState(false);

  // Mock data
  const datasets = [
    { version: 'v1.2', rows: 12543, features: 28, uploaded: '2023-05-15' },
    { version: 'v1.1', rows: 11200, features: 28, uploaded: '2023-04-10' },
    { version: 'v1.0', rows: 9800, features: 25, uploaded: '2023-03-01' }
  ];

  const models: ModelVersion[] = [
    {
      id: 'm5',
      name: 'XGBoost v1.2',
      algorithm: 'XGBoost',
      datasetVersion: 'v1.2',
      metrics: { auc: 0.92, accuracy: 0.88, f1: 0.89 },
      status: 'success',
      timestamp: '2023-05-16 14:30',
      isProduction: true
    },
    {
      id: 'm4',
      name: 'LightGBM v1.2',
      algorithm: 'LightGBM',
      datasetVersion: 'v1.2',
      metrics: { auc: 0.91, accuracy: 0.87, f1: 0.88 },
      status: 'success',
      timestamp: '2023-05-16 12:15',
      isProduction: false
    },
    {
      id: 'm3',
      name: 'XGBoost v1.1',
      algorithm: 'XGBoost',
      datasetVersion: 'v1.1',
      metrics: { auc: 0.89, accuracy: 0.85, f1: 0.86 },
      status: 'success',
      timestamp: '2023-04-11 09:45',
      isProduction: false
    }
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const promoteToProduction = (modelId: string) => {
    // In a real app, this would call an API
    alert(`Promoting model ${modelId} to production`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Model Management Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white/90">
              Model Management
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Version control and model lifecycle management
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-orange-500 text-white text-sm md:text-base rounded-lg hover:bg-orange-600 transition-colors">
              <FiUpload className="text-sm md:text-lg" />
              <span>New Dataset</span>
            </button>
            <div className="relative">
              <button onClick={toggleDropdown} className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiMoreVertical className="text-gray-500 dark:text-gray-400" />
              </button>
              <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 md:w-48">
                <DropdownItem className="flex items-center px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiActivity className="mr-2 text-sm md:text-base" />
                  <span className="text-sm md:text-base">Train New Model</span>
                </DropdownItem>
                <DropdownItem className="flex items-center px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiDatabase className="mr-2 text-sm md:text-base" />
                  <span className="text-sm md:text-base">View All Versions</span>
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="flex mt-4 md:mt-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('datasets')}
            className={`pb-2 md:pb-3 px-3 md:px-4 text-sm md:text-base font-medium ${activeTab === 'datasets' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Datasets
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-2 md:pb-3 px-3 md:px-4 text-sm md:text-base font-medium ${activeTab === 'models' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Model Versions
          </button>
        </div>
      </div>

      {/* Current Production Model Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90">
              Production Model
            </h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Currently active model serving predictions
            </p>
          </div>
          <Badge color="success" className="mt-2 md:mt-0">
            <FiCheckCircle className="mr-1" />
            Active
          </Badge>
        </div>

        {models.filter(m => m.isProduction).map(model => (
          <div key={model.id} className="mt-3 p-3 md:p-4 bg-orange-50 rounded-lg dark:bg-orange-900/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white/90 text-sm md:text-base">{model.name}</h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Trained on {model.datasetVersion} • {model.timestamp}
                </p>
              </div>
              <div className="flex gap-2 md:gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">AUC</p>
                  <p className="font-bold text-orange-500 text-sm md:text-base">{model.metrics.auc.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
                  <p className="font-bold text-orange-500 text-sm md:text-base">{model.metrics.accuracy.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">F1</p>
                  <p className="font-bold text-orange-500 text-sm md:text-base">{model.metrics.f1.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset or Model List */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
        {activeTab === 'datasets' ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <div className="grid grid-cols-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-900 gap-2 md:gap-4">
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm">Version</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm">Rows</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm">Features</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm">Uploaded</div>
            </div>
            {datasets.map((dataset, index) => (
              <div key={index} className="grid grid-cols-4 p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-900 gap-2 md:gap-4">
                <div className="font-medium text-orange-500 text-xs md:text-sm">{dataset.version}</div>
                <div className="text-xs md:text-sm">{dataset.rows.toLocaleString()}</div>
                <div className="text-xs md:text-sm">{dataset.features}</div>
                <div className="text-xs md:text-sm">{dataset.uploaded}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <div className="grid grid-cols-12 p-3 md:p-4 bg-gray-50 dark:bg-gray-900 gap-2 md:gap-4">
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm col-span-3">Model</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm col-span-2">Algorithm</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm col-span-2">Dataset</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm col-span-3">Metrics</div>
              <div className="font-medium text-gray-700 dark:text-gray-300 text-xs md:text-sm col-span-2">Actions</div>
            </div>
            {models.map((model) => (
              <div key={model.id} className="grid grid-cols-12 p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-900 gap-2 md:gap-4 items-center">
                <div className="font-medium text-xs md:text-sm col-span-3">{model.name}</div>
                <div className="text-xs md:text-sm col-span-2">{model.algorithm}</div>
                <div className="text-xs md:text-sm col-span-2">{model.datasetVersion}</div>
                <div className="flex flex-wrap gap-1 col-span-3">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                    AUC: {model.metrics.auc.toFixed(2)}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                    F1: {model.metrics.f1.toFixed(2)}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                    Acc: {model.metrics.accuracy.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-2">
                  {!model.isProduction && (
                    <button 
                      onClick={() => promoteToProduction(model.id)}
                      className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded whitespace-nowrap"
                    >
                      Promote
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}