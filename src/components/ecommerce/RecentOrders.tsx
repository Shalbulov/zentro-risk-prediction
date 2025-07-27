import React, { useState } from "react";
import { FiUpload, FiDownload, FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import Papa from "papaparse";
import Badge from "../ui/badge/Badge";

// ProgressBar component remains the same
type ProgressBarProps = {
  value: number;
  color?: 'orange' | 'success' | 'error';
  className?: string;
  barClassName?: string;
};

const ProgressBar = ({ 
  value, 
  color = 'orange', 
  className = '', 
  barClassName = '' 
}: ProgressBarProps) => {
  const width = Math.min(100, Math.max(0, value));
  const colorClasses = {
    orange: 'bg-orange-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 ${className}`}>
      <div
        className={`h-full transition-all duration-300 ${colorClasses[color]} ${barClassName}`}
        style={{ width: `${width}%` }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

// Main component
type FileStatus = 'empty' | 'uploaded' | 'validating' | 'valid' | 'invalid' | 'scoring' | 'complete';
type ValidationError = { row?: number; field: string; message: string };

export default function BatchScoringUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FileStatus>('empty');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<{total: number; highRisk: number; mediumRisk: number} | null>(null);

const requiredColumns = [
  { name: 'age', type: 'number' },
  { name: 'income', type: 'number' },
  { name: 'loan_amount', type: 'number' },
  { name: 'credit_history', type: 'number' },
  { name: 'employment_length', type: 'number' },
  { name: 'debt_to_income', type: 'number' }
];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      
      // Validate file size
      if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors([{ field: 'file', message: 'File size exceeds 10MB limit' }]);
        setStatus('invalid');
        return;
      }

      setFile(uploadedFile);
      setStatus('uploaded');
      setErrors([]);
      
      // Parse CSV for preview
      Papa.parse(uploadedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreviewData(results.data);
          validateFile(results.meta.fields || []);
        },
        error: (error) => {
          setErrors([{ field: 'file', message: error.message }]);
          setStatus('invalid');
        }
      });
    }
  };

const validateFile = (columns: string[], sampleData: any) => {
  setStatus('validating');
  
  // Check for missing columns
  const missingColumns = requiredColumns.filter(col => 
    !columns.includes(col.name)
  );
  
  if (missingColumns.length > 0) {
    setErrors(missingColumns.map(col => ({
      field: col.name,
      message: `Required column missing: ${col.name}`
    })));
    setStatus('invalid');
    return;
  }
  
  // Check data types in the first row
  const typeErrors = requiredColumns.filter(col => {
    const value = sampleData[0][col.name];
    return isNaN(value) && col.type === 'number';
  });
  
  if (typeErrors.length > 0) {
    setErrors(typeErrors.map(col => ({
      field: col.name,
      message: `Column ${col.name} must contain numeric values`
    })));
    setStatus('invalid');
  } else {
    setStatus('valid');
  }
};


  const processFile = async () => {
    if (!file) return;
    
    setStatus('scoring');
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/batch-score');
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.min(95, (event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setProgress(100);
          setStats({
            total: response.rows_processed,
            highRisk: response.high_risk,
            mediumRisk: response.medium_risk
          });
          
          // Fetch the processed data
          fetchResults(response.download_link);
        } else {
          setErrors([{ field: 'processing', message: xhr.responseText || 'Processing failed' }]);
          setStatus('invalid');
          setProgress(0);
        }
      };

      xhr.onerror = () => {
        setErrors([{ field: 'network', message: 'Network error occurred' }]);
        setStatus('invalid');
        setProgress(0);
      };

      xhr.send(formData);
    } catch (error) {
      setErrors([{ field: 'processing', message: error.message }]);
      setStatus('invalid');
      setProgress(0);
    }
  };

  const fetchResults = async (downloadLink: string) => {
    try {
      const response = await fetch(downloadLink);
      if (!response.ok) throw new Error('Failed to fetch results');
      
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        complete: (results) => {
          setProcessedData(results.data);
          setStatus('complete');
        },
        error: (error) => {
          throw error;
        }
      });
    } catch (error) {
      setErrors([{ field: 'results', message: error.message }]);
      setStatus('invalid');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStatus('empty');
    setPreviewData([]);
    setProcessedData([]);
    setErrors([]);
    setProgress(0);
    setStats(null);
  };

  const downloadResults = () => {
    const csv = Papa.unparse(processedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `scored_${file?.name || 'results.csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Batch Credit Scoring
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload applicant data for risk assessment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={resetUpload}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiX className="text-lg" />
            </button>
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
                or drag and drop file here
              </p>
              <a 
                href="/templates/credit_applicants_template.csv" 
                download
                className="text-xs text-orange-500 hover:underline"
              >
                Download CSV template
              </a>
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
                    {(file?.size || 0) > 1024 * 1024 
                      ? `${((file?.size || 0) / 1024 / 1024).toFixed(1)} MB` 
                      : `${Math.round((file?.size || 0) / 1024)} KB`}
                  </p>
                </div>
              </div>
              <Badge 
                color={
                  status === 'valid' ? 'success' : 
                  status === 'invalid' ? 'error' : 'orange'
                }
              >
                {status === 'uploaded' && 'Uploaded'}
                {status === 'validating' && 'Validating...'}
                {status === 'valid' && 'Valid'}
                {status === 'invalid' && 'Invalid'}
                {status === 'scoring' && 'Processing'}
                {status === 'complete' && 'Complete'}
              </Badge>
            </div>

            {status === 'invalid' && (
              <div className="p-3 bg-red-50 rounded-lg dark:bg-red-900/20">
                <h4 className="flex items-center gap-2 font-medium text-red-700 dark:text-red-400">
                  <FiAlertCircle className="text-lg" />
                  Validation Errors
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-red-600 dark:text-red-400">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error.message}</li>
                  ))}
                </ul>
                <button
                  onClick={resetUpload}
                  className="w-full mt-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {status === 'valid' && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  Data Preview (first 5 rows)
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {previewData[0] && Object.keys(previewData[0]).map((key) => (
                          <th 
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {previewData.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {Object.values(row).map((value: any, colIdx) => (
                            <td 
                              key={colIdx}
                              className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={processFile}
                  disabled={status === 'scoring'}
                  className={`w-full py-2 ${status === 'scoring' ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-lg transition-colors`}
                >
                  {status === 'scoring' ? 'Processing...' : 'Process File'}
                </button>
              </div>
            )}

            {(status === 'scoring' || status === 'complete') && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {status === 'scoring' ? 'Processing...' : 'Processing complete'}
                    </span>
                    <span className="font-medium">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={progress} 
                    color={status === 'complete' ? 'success' : 'orange'}
                  />
                </div>

                {status === 'complete' && stats && (
                  <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
                    <div className="flex items-center gap-3 mb-3">
                      <FiCheckCircle className="text-green-500 dark:text-green-400 text-lg" />
                      <div>
                        <h4 className="font-medium text-green-700 dark:text-green-400">
                          Scoring Complete
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {stats.total} records processed
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 bg-red-50 rounded dark:bg-red-900/20">
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">High Risk</p>
                        <p className="text-lg font-bold">{stats.highRisk}</p>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded dark:bg-yellow-900/20">
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Medium Risk</p>
                        <p className="text-lg font-bold">{stats.mediumRisk}</p>
                      </div>
                    </div>
                    <button
                      onClick={downloadResults}
                      className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiDownload />
                      Download Results
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Requirements Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <FaShieldAlt className="h-5 w-5 text-orange-500 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white/90">
              File Requirements
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ensure your CSV meets these specifications
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs">1</span>
            </div>
            <span>
              <strong>Required columns:</strong> {requiredColumns.join(', ')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </div>
            <span>
              <strong>Max file size:</strong> 10MB (~10,000 records)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs">3</span>
            </div>
            <span>
              <strong>Supported formats:</strong> CSV (UTF-8 encoded)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white text-xs">4</span>
            </div>
            <span>
              <strong>Processing time:</strong> ~1 second per 100 records
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}