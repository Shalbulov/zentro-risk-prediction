import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiUpload, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiInfo, 
  FiBarChart2,
  FiSave,
  FiSettings,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';
import Badge from '../ui/badge/Badge';
import ProgressBar from '../ui/progress/ProgressBar';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  LineController
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  LineController
);

// Types
type Applicant = {
  age: number;
  income: number;
  loan_amount: number;
  credit_history: number;
  employment_length: number;
  debt_to_income: number;
};

type Result = {
  score: number;
  risk_label: string;
  confidence_interval: [number, number];
  feature_importance?: Array<{feature: string; importance: number}>;
};

type HistoryItem = {
  timestamp: string;
  applicant: Applicant;
  result: Result;
};

export default function CreditScoringDashboard() {
  // State
  const [applicant, setApplicant] = useState<Applicant>({
    age: 32,
    income: 54000,
    loan_amount: 12000,
    credit_history: 720,
    employment_length: 3,
    debt_to_income: 0.26
  });
  
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState({ reject: 0.2, review: 0.5 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'scoring' | 'analysis'>('scoring');
  const [showThresholdSettings, setShowThresholdSettings] = useState(false);
  const [tempThresholds, setTempThresholds] = useState(thresholds);
  const [showSampleData, setShowSampleData] = useState(false);

  // Sample data options
  const sampleApplicants = [
    {
      label: "Low Risk",
      data: {
        age: 35,
        income: 75000,
        loan_amount: 15000,
        credit_history: 780,
        employment_length: 5,
        debt_to_income: 0.18
      }
    },
    {
      label: "Medium Risk",
      data: {
        age: 28,
        income: 45000,
        loan_amount: 20000,
        credit_history: 650,
        employment_length: 2,
        debt_to_income: 0.35
      }
    },
    {
      label: "High Risk",
      data: {
        age: 45,
        income: 38000,
        loan_amount: 25000,
        credit_history: 580,
        employment_length: 1,
        debt_to_income: 0.45
      }
    }
  ];

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicant(prev => ({
      ...prev,
      [name]: name === 'debt_to_income' ? parseFloat(value) : parseInt(value)
    }));
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempThresholds(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const saveThresholds = () => {
    if (tempThresholds.reject >= tempThresholds.review) {
      setError("Reject threshold must be less than review threshold");
      return;
    }
    setThresholds(tempThresholds);
    setShowThresholdSettings(false);
    setError(null);
  };

  const loadSampleData = (sample: Applicant) => {
    setApplicant(sample);
    setShowSampleData(false);
  };

  const resetForm = () => {
    setApplicant({
      age: 32,
      income: 54000,
      loan_amount: 12000,
      credit_history: 720,
      employment_length: 3,
      debt_to_income: 0.26
    });
    setResult(null);
    setError(null);
  };

  // Scoring function with memoization
  const scoreApplicant = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Enhanced mock scoring logic with more realistic factors
      const mockScore = Math.min(0.99, Math.max(0.01, 
        (applicant.income / 100000) * 0.35 +
        (applicant.credit_history / 850) * 0.3 -
        (applicant.debt_to_income) * 0.25 +
        (applicant.employment_length / 10) * 0.15 -
        (applicant.loan_amount / (applicant.income * 3)) * 0.1 +
        (Math.min(applicant.age, 70) / 70) * 0.05
      ));

      // Determine risk label
      let risk_label = "Accept";
      if (mockScore < thresholds.reject) risk_label = "Reject";
      else if (mockScore < thresholds.review) risk_label = "Review";

      // Mock feature importance with more detailed factors
      const feature_importance = [
        { feature: "Income", importance: (applicant.income / 100000) * 0.35 },
        { feature: "Credit History", importance: (applicant.credit_history / 850) * 0.3 },
        { feature: "Debt-to-Income", importance: -(applicant.debt_to_income) * 0.25 },
        { feature: "Employment Length", importance: (applicant.employment_length / 10) * 0.15 },
        { feature: "Loan-to-Income Ratio", importance: -(applicant.loan_amount / (applicant.income * 3)) * 0.1 },
        { feature: "Age", importance: (Math.min(applicant.age, 70) / 70) * 0.05 }
      ].sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance));

      const newResult: Result = {
        score: parseFloat(mockScore.toFixed(3)),
        risk_label,
        confidence_interval: [
          parseFloat((mockScore * 0.95).toFixed(3)),
          parseFloat((mockScore * 1.05).toFixed(3))
        ],
        feature_importance
      };

      setResult(newResult);
      setHistory(prev => [{
        timestamp: new Date().toISOString(),
        applicant: {...applicant},
        result: newResult
      }, ...prev.slice(0, 4)]);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setIsLoading(false);
    }
  }, [applicant, thresholds]);

  // Chart data and options
  const featureChartData = {
    labels: result?.feature_importance?.map(f => f.feature) || [],
    datasets: [{
      label: 'Feature Impact',
      data: result?.feature_importance?.map(f => f.importance) || [],
      backgroundColor: result?.feature_importance?.map(f => 
        f.importance > 0 ? '#8db92e' : '#ff671b' // Using brand colors
      ) || [],
      borderColor: result?.feature_importance?.map(f => 
        f.importance > 0 ? '#8db92e' : '#ff671b'
      ) || [],
      borderWidth: 1
    }]
  };

  const featureChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const value = ctx.raw;
            return `${value > 0 ? '+' : ''}${value.toFixed(3)}`;
          }
        }
      }
    },
    scales: {
      x: {
        min: -0.4,
        max: 0.4,
        ticks: {
          callback: (value: number) => `${value > 0 ? '+' : ''}${value}`
        }
      }
    }
  };

  // Analysis tab charts
  const scoreDistributionData = {
    labels: ['Reject', 'Review', 'Accept'],
    datasets: [{
      data: [15, 25, 60],
      backgroundColor: ['#ff671b', '#f38b00', '#8db92e'],
      borderWidth: 0
    }]
  };

  const riskTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Reject Rate',
        data: [12, 19, 15, 11, 14, 8],
        borderColor: '#ff671b',
        backgroundColor: 'rgba(255, 103, 27, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Accept Rate',
        data: [65, 59, 62, 67, 64, 72],
        borderColor: '#8db92e',
        backgroundColor: 'rgba(141, 185, 46, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Effects
  useEffect(() => {
    // Load any saved thresholds from localStorage
    const savedThresholds = localStorage.getItem('creditScoreThresholds');
    if (savedThresholds) {
      try {
        const parsed = JSON.parse(savedThresholds);
        setThresholds(parsed);
        setTempThresholds(parsed);
      } catch (e) {
        console.error("Failed to parse saved thresholds", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save thresholds to localStorage when they change
    localStorage.setItem('creditScoreThresholds', JSON.stringify(thresholds));
  }, [thresholds]);

  // Utility functions
  const downloadResults = () => {
    if (!result) return;
    
    const data = {
      applicant,
      result,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-score-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printResults = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Credit Scoring Dashboard
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comprehensive credit risk assessment tool
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('scoring')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'scoring' 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Scoring
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analysis' 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Analysis
          </button>
        </div>
      </div>

      {activeTab === 'scoring' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Applicant Information</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSampleData(!showSampleData)}
                  className="p-2 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
                  title="Load sample data"
                >
                  <FiDownload size={16} />
                </button>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
                  title="Reset form"
                >
                  <FiRefreshCw size={16} />
                </button>
              </div>
            </div>

            {showSampleData && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Load Sample Data</h5>
                <div className="space-y-2">
                  {sampleApplicants.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => loadSampleData(sample.data)}
                      className="w-full py-1.5 px-3 text-left text-sm rounded border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                min="18"
                max="100"
                value={applicant.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Annual Income ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="income"
                min="0"
                value={applicant.income}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loan Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="loan_amount"
                min="0"
                value={applicant.loan_amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Credit Score (300-850) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="credit_history"
                min="300"
                max="850"
                value={applicant.credit_history}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Length (Years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="employment_length"
                min="0"
                max="50"
                value={applicant.employment_length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Debt-to-Income Ratio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  name="debt_to_income"
                  value={applicant.debt_to_income}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <span className="absolute right-3 top-2.5 text-gray-500 text-sm">%</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={scoreApplicant}
                disabled={isLoading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Calculate Credit Score"
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 rounded-lg dark:bg-red-900/20 flex items-start gap-2">
                <FiAlertCircle className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">Error</h4>
                  <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
                </div>
              </div>
            )}

            {isLoading && !error && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
                <ProgressBar value={75} color="orange" className="w-full mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing applicant data...</p>
              </div>
            )}

            {result && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Score Card */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Credit Score</h4>
                      <Badge 
                        color={
                          result.risk_label === 'Reject' ? 'error' : 
                          result.risk_label === 'Review' ? 'warning' : 'success'
                        }
                      >
                        {result.risk_label}
                      </Badge>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-800 dark:text-white">
                        {result.score.toFixed(3)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        / 1.000
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      Confidence: {result.confidence_interval[0].toFixed(3)} - {result.confidence_interval[1].toFixed(3)}
                    </div>
                  </div>

                  {/* Thresholds Card */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Risk Thresholds</h4>
                      <button 
                        onClick={() => setShowThresholdSettings(!showThresholdSettings)}
                        className="text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
                        title="Adjust thresholds"
                      >
                        <FiSettings size={16} />
                      </button>
                    </div>
                    
                    {showThresholdSettings ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-600 dark:text-gray-400">Reject Below</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            name="reject"
                            value={tempThresholds.reject}
                            onChange={handleThresholdChange}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-600 dark:text-gray-400">Review Below</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            name="review"
                            value={tempThresholds.review}
                            onChange={handleThresholdChange}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveThresholds}
                            className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setTempThresholds(thresholds);
                              setShowThresholdSettings(false);
                            }}
                            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Reject</span>
                          <span className="font-medium">{thresholds.reject}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Review</span>
                          <span className="font-medium">{thresholds.review}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Accept</span>
                          <span className="font-medium">≥ {thresholds.review}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Score Visualization */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Score Distribution</h4>
                    <div className="relative h-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                      <div 
                        className="absolute h-full bg-white dark:bg-gray-800"
                        style={{ 
                          left: `${thresholds.reject * 100}%`, 
                          right: `${(1 - thresholds.review) * 100}%`,
                          borderLeft: '2px solid #111827',
                          borderRight: '2px solid #111827'
                        }}
                      />
                      <div 
                        className="absolute top-0 h-full w-1 bg-gray-800 dark:bg-white"
                        style={{ left: `${result.score * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>0</span>
                      <span>0.5</span>
                      <span>1.0</span>
                    </div>
                  </div>
                </div>

                {/* Feature Importance */}
                <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FiBarChart2 className="text-orange-500" />
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Feature Importance</h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadResults}
                        className="p-1.5 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
                        title="Download results"
                      >
                        <FiDownload size={16} />
                      </button>
                      <button
                        onClick={printResults}
                        className="p-1.5 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400"
                        title="Print results"
                      >
                        <FiPrinter size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="h-64">
                    <Bar data={featureChartData} options={featureChartOptions} />
                  </div>
                </div>

                {/* Recent History */}
                {history.length > 0 && (
                  <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Scores</h4>
                    <div className="space-y-3">
                      {history.map((item, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            result.score === item.result.score 
                              ? 'bg-orange-50 dark:bg-orange-900/20' 
                              : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            setApplicant(item.applicant);
                            setResult(item.result);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white/90">
                                Score: {item.result.score.toFixed(3)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge 
                              color={
                                item.result.risk_label === 'Reject' ? 'error' : 
                                item.result.risk_label === 'Review' ? 'warning' : 'success'
                              }
                              size="sm"
                            >
                              {item.result.risk_label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FiInfo className="text-orange-500 text-xl" />
            <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
              Credit Analysis Insights
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Score Distribution</h5>
              <div className="h-64">
                <Pie 
                  data={scoreDistributionData} 
                  options={{
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Trends</h5>
              <div className="h-64">
                <Bar 
                  data={riskTrendsData} 
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Factors</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Income Level</span>
                    <span className="font-medium">High Impact</span>
                  </div>
                  <ProgressBar value={75} color="orange" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Credit History</span>
                    <span className="font-medium">Medium Impact</span>
                  </div>
                  <ProgressBar value={55} color="orange" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Debt Ratio</span>
                    <span className="font-medium">Negative Impact</span>
                  </div>
                  <ProgressBar value={65} color="red" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Recommendations</h5>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Applicants with credit scores below 600 have 3x higher default rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Debt-to-income ratios above 0.4 significantly increase risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Employment length less than 2 years correlates with higher delinquency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Consider offering lower interest rates for scores above 0.7 to attract quality applicants</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}