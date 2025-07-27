import React, { useState, useEffect } from 'react';
import { FiUpload, FiDownload, FiCheckCircle, FiAlertCircle, FiX, FiBarChart2 } from 'react-icons/fi';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Badge from '../ui/badge/Badge';
import ProgressBar from '../ui/progress/ProgressBar';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type FileStatus = 'empty' | 'uploaded' | 'validating' | 'valid' | 'invalid' | 'scoring' | 'complete';
type RiskLabel = 'Low' | 'Medium' | 'High';
type Applicant = {
  age: string;
  income: string;
  loan_amount: string;
  credit_history: string;
  employment_length: string;
  debt_to_income: string;
  score?: string;
  risk_label?: RiskLabel;
  explanation?: string;
  id?: string; // Added for unique identification
};

type ShapValues = {
  feature: string;
  value: number;
};

export default function ZentroScoring() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FileStatus>('empty');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [sortedApplicants, setSortedApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [shapValues, setShapValues] = useState<ShapValues[]>([]);
  const [progress, setProgress] = useState(0);

  const requiredColumns = [
    'age', 'income', 'loan_amount', 'credit_history', 
    'employment_length', 'debt_to_income'
  ];

  // Sort applicants by risk level when they change
  useEffect(() => {
    const sorted = [...applicants].sort((a, b) => {
      // Sort order: High > Medium > Low
      const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (riskOrder[b.risk_label || 'Low'] - riskOrder[a.risk_label || 'Low']) ||
             (parseFloat(b.score || '0') - parseFloat(a.score || '0'));
    });
    setSortedApplicants(sorted);
    
    // Auto-select the first applicant when sorted
    if (sorted.length > 0 && !selectedApplicant) {
      setSelectedApplicant(sorted[0]);
      if (sorted[0].explanation) {
        try {
          setShapValues(JSON.parse(sorted[0].explanation));
        } catch {
          setShapValues([]);
        }
      }
    }
  }, [applicants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const uploadedFile = e.target.files[0];
      
      // Validate file size
      if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setStatus('invalid');
        return;
      }

      setFile(uploadedFile);
      setStatus('uploaded');
      
      Papa.parse(uploadedFile, {
        header: true,
        complete: (results) => {
          const limitedApplicants = results.data.slice(0, 20).map((app, idx) => ({
            ...app,
            id: `applicant-${idx}` // Add unique identifier
          }));
          setApplicants(limitedApplicants);
          validateFile(results.meta.fields || []);
        },
        error: (error) => {
          setStatus('invalid');
        }
      });
    }
  };

  const validateFile = (columns: string[]) => {
    setStatus('validating');
    setTimeout(() => {
      const missingColumns = requiredColumns.filter(col => !columns.includes(col));
      setStatus(missingColumns.length > 0 ? 'invalid' : 'valid');
    }, 1000);
  };

  const processFile = async () => {
    setStatus('scoring');
    setProgress(0);
    
    // Simulate batch scoring with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 10, 100);
        if (newProgress === 100) {
          clearInterval(interval);
          scoreApplicants();
        }
        return newProgress;
      });
    }, 300);
  };

  const scoreApplicants = async () => {
    try {
      // In a real app, this would call your backend API
      const scoredApplicants = await Promise.all(
        applicants.map(async applicant => {
          const score = Math.random().toFixed(4);
          let risk_label: RiskLabel = 'Low';
          if (parseFloat(score) > 0.7) risk_label = 'High';
          else if (parseFloat(score) > 0.4) risk_label = 'Medium';

          // Mock SHAP values
          const mockShapValues: ShapValues[] = [
            { feature: 'Income', value: (Math.random() * 0.3) },
            { feature: 'Credit History', value: -(Math.random() * 0.2) },
            { feature: 'Debt Ratio', value: -(Math.random() * 0.15) },
            { feature: 'Employment', value: (Math.random() * 0.1) },
            { feature: 'Age', value: (Math.random() * 0.05) }
          ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

          return { 
            ...applicant, 
            score, 
            risk_label, 
            explanation: JSON.stringify(mockShapValues) 
          };
        })
      );

      setApplicants(scoredApplicants);
      setStatus('complete');
    } catch (error) {
      console.error('Scoring failed:', error);
      setStatus('invalid');
    }
  };

  const selectApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    if (applicant.explanation) {
      try {
        setShapValues(JSON.parse(applicant.explanation));
      } catch {
        setShapValues([]);
      }
    }
  };

  const shapChartData = {
    labels: shapValues.map(item => item.feature),
    datasets: [
      {
        label: 'Feature Impact',
        data: shapValues.map(item => item.value),
        backgroundColor: shapValues.map(item => 
          item.value > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
        borderColor: shapValues.map(item => 
          item.value > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        ),
        borderWidth: 1,
      }
    ]
  };

  const shapChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${value > 0 ? '+' : ''}${value.toFixed(3)}`;
          }
        }
      }
    },
    scales: {
      x: {
        min: -0.3,
        max: 0.3,
        ticks: {
          callback: (value: number) => `${value > 0 ? '+' : ''}${value}`
        }
      }
    }
  };

  const downloadResults = () => {
    const csv = Papa.unparse(applicants);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zentro_scores_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Upload Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              ZENTRO Credit Scoring
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload applicant data for risk assessment with explainability
            </p>
          </div>
        </div>

        {status === 'empty' ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-700">
            <div className="flex flex-col items-center justify-center space-y-3">
              <FiUpload className="h-10 w-10 text-gray-400" />
              <label className="cursor-pointer">
                <span className="text-orange-500 hover:text-orange-600 font-medium">
                  Select CSV file
                </span>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use our template with required columns
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <FiUpload className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {file?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {applicants.length} records found
                  </p>
                </div>
              </div>
              <Badge color={
                status === 'valid' ? 'success' : 
                status === 'invalid' ? 'error' : 'orange'
              }>
                {status.toUpperCase()}
              </Badge>
            </div>

            {status === 'valid' && (
              <button
                onClick={processFile}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Score Applicants
              </button>
            )}

            {(status === 'scoring' || status === 'complete') && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {status === 'scoring' ? 'Processing...' : 'Processing complete'}
                    </span>
                    <span className="font-medium">
                      {progress}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={progress} 
                    color={status === 'complete' ? 'success' : 'orange'}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {status === 'complete' && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Scoring Results
            </h3>
            <button 
              onClick={downloadResults}
              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <FiDownload size={14} />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Applicant List */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="overflow-y-auto flex-1 border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Risk
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {sortedApplicants.map((applicant) => (
                      <tr 
                        key={applicant.id}
                        className={`cursor-pointer transition-colors ${selectedApplicant?.id === applicant.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        onClick={() => selectApplicant(applicant)}
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {applicant.id?.replace('applicant-', 'Applicant #')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                          {applicant.score}
                        </td>
                        <td className="px-4 py-3">
                          <Badge 
                            color={
                              applicant.risk_label === 'High' ? 'error' : 
                              applicant.risk_label === 'Medium' ? 'warning' : 'success'
                            }
                            className="min-w-[70px] justify-center"
                          >
                            {applicant.risk_label}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanation Panel */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <FiBarChart2 className="text-orange-500" />
                  <h4 className="font-medium text-gray-800 dark:text-white/90">
                    Risk Explanation
                  </h4>
                </div>

                {selectedApplicant && (
                  <div className="flex flex-col flex-1 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Final Score</span>
                          <h3 className="text-2xl font-bold">
                            {selectedApplicant.score}
                            <span className="ml-2 text-sm font-normal">
                              ({selectedApplicant.risk_label} Risk)
                            </span>
                          </h3>
                        </div>
                        <Badge 
                          color={
                            selectedApplicant.risk_label === 'High' ? 'error' : 
                            selectedApplicant.risk_label === 'Medium' ? 'warning' : 'success'
                          }
                          size="lg"
                        >
                          {selectedApplicant.risk_label} Risk
                        </Badge>
                      </div>
                      <div className="flex-1 min-h-[250px]">
                        <Bar data={shapChartData} options={shapChartOptions} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {shapValues.map((item, index) => (
                        <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{item.feature}</span>
                            <span className={`text-sm font-medium ${item.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {item.value > 0 ? '+' : ''}{item.value.toFixed(3)}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.value > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ 
                                width: `${Math.min(100, Math.abs(item.value) * 300)}%`,
                                marginLeft: item.value > 0 ? '0' : 'auto'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}