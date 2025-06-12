import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { CSVLink } from "react-csv";

interface Report {
  id: number;
  name: string;
  scope: string;
  metric: string;
  date: string;
  status: "Delivered" | "Pending" | "Canceled";
  image: string;
}

// Expanded dataset with 15 records
const initialData: Report[] = [
  { id: 1, name: "Daily Sales Summary", scope: "All Stores", metric: "Sales", date: "12 Jun 2025", status: "Delivered", image: "/images/reports/sales.svg" },
  { id: 2, name: "Inventory Turnover", scope: "Beverages", metric: "Inventory", date: "12 Jun 2025", status: "Pending", image: "/images/reports/inventory.svg" },
  { id: 3, name: "Monthly Profit Margin", scope: "Region North", metric: "Finance", date: "01 Jun 2025", status: "Delivered", image: "/images/reports/finance.svg" },
  { id: 4, name: "KPI Dashboard", scope: "Region West", metric: "KPI", date: "11 Jun 2025", status: "Canceled", image: "/images/reports/kpi.svg" },
  { id: 5, name: "Traffic & Conversion", scope: "All Stores", metric: "Marketing", date: "10 Jun 2025", status: "Delivered", image: "/images/reports/marketing.svg" },
  { id: 6, name: "Customer Retention", scope: "Loyalty", metric: "CRM", date: "09 Jun 2025", status: "Pending", image: "/images/reports/crm.svg" },
  { id: 7, name: "Supply Chain", scope: "Logistics", metric: "Operations", date: "08 Jun 2025", status: "Delivered", image: "/images/reports/operations.svg" },
  { id: 8, name: "Employee Performance", scope: "HR", metric: "Productivity", date: "07 Jun 2025", status: "Pending", image: "/images/reports/hr.svg" },
  { id: 9, name: "Website Analytics", scope: "Digital", metric: "Traffic", date: "06 Jun 2025", status: "Delivered", image: "/images/reports/digital.svg" },
  { id: 10, name: "Social Media Impact", scope: "Marketing", metric: "Engagement", date: "05 Jun 2025", status: "Canceled", image: "/images/reports/social.svg" },
  { id: 11, name: "Quarterly Forecast", scope: "All Departments", metric: "Projections", date: "04 Jun 2025", status: "Delivered", image: "/images/reports/forecast.svg" },
  { id: 12, name: "Customer Satisfaction", scope: "Service", metric: "NPS", date: "03 Jun 2025", status: "Pending", image: "/images/reports/nps.svg" },
  { id: 13, name: "Product Returns", scope: "Quality", metric: "Defects", date: "02 Jun 2025", status: "Delivered", image: "/images/reports/quality.svg" },
  { id: 14, name: "Market Share", scope: "Competition", metric: "Analysis", date: "01 Jun 2025", status: "Canceled", image: "/images/reports/market.svg" },
  { id: 15, name: "Budget Variance", scope: "Finance", metric: "Accounting", date: "31 May 2025", status: "Pending", image: "/images/reports/budget.svg" },
];

export default function RecentReports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<keyof Report | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Status options with icons
  const statusOptions = [
    { value: "All", label: "All Statuses", icon: "list" },
    { value: "Delivered", label: "Delivered", icon: "check-circle" },
    { value: "Pending", label: "Pending", icon: "clock" },
    { value: "Canceled", label: "Canceled", icon: "x-circle" }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "list":
        return (
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
      case "check-circle":
        return (
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "x-circle":
        return (
          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-14 0 9 9 0 0114 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Filter and sort data
  const filtered = useMemo(() => {
    let data = initialData.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.scope.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "All") {
      data = data.filter(r => r.status === statusFilter);
    }
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortKey] as string;
        const bVal = b[sortKey] as string;
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return data;
  }, [search, statusFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: keyof Report) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent BI Reports
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-600 transition-all"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-600 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-2.5">
              {renderIcon(statusOptions.find(opt => opt.value === statusFilter)?.icon || "list")}
            </div>
            <svg
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Export Button */}
          <CSVLink 
            data={filtered} 
            filename="BI_Reports.csv" 
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="whitespace-nowrap">Export CSV</span>
          </CSVLink>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b dark:border-gray-800">
            <TableRow>
              {['name','scope','metric','date','status'].map(col => (
                <TableCell
                  key={col}
                  isHeader
                  className="py-3 font-medium text-gray-500 text-xs dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  onClick={() => toggleSort(col as keyof Report)}
                >
                  <div className="flex items-center gap-1">
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {sortKey === col && (
                      <span className="text-gray-400">
                        {sortAsc ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y dark:divide-gray-800">
            {pageData.map(report => (
              <TableRow key={report.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img src={report.image} alt={report.name} className="h-8 w-8 object-contain" />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white/90 text-sm">
                      {report.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-sm dark:text-gray-400">
                  {report.scope}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-sm dark:text-gray-400">
                  {report.metric}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-sm dark:text-gray-400">
                  {report.date}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-sm dark:text-gray-400">
                  <Badge size="sm" color={
                    report.status === 'Delivered' ? 'success' : report.status === 'Pending' ? 'warning' : 'error'
                  }>
                    {report.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length} reports
        </span>
        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1} 
            className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 dark:text-white flex items-center gap-1 flex-1 sm:flex-none justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="sm:hidden">Prev</span>
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages} 
            className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 dark:text-white flex items-center gap-1 flex-1 sm:flex-none justify-center"
          >
            <span className="sm:hidden">Next</span>
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}