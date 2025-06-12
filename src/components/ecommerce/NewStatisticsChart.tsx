// NewStatisticsChart.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import classNames from "classnames";

type MetricType = "turnover" | "checks" | "profit";
type SegmentType = "all" | "leaders" | "outsiders";

interface ApiPayload {
  series: { name: string; data: number[] }[];
  categories: string[]; // full store names
}

interface MetricConfig {
  id: MetricType;
  label: string;
  color: string;
  unit: string;
}

const METRICS_CONFIG: MetricConfig[] = [
  { id: "turnover", label: "Изменение оборота",    color: "#629731", unit: "%" },
  { id: "checks",   label: "Изменение кол-ва чеков", color: "#4C8BF5", unit: "%" },
  { id: "profit",   label: "Изменение прибыли",     color: "#FF6B6B", unit: "%" },
];

export default function NewStatisticsChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("turnover");
  const [segment, setSegment] = useState<SegmentType>("all");
  const [data, setData] = useState<ApiPayload>({ series: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentMetric = useMemo(
    () => METRICS_CONFIG.find(m => m.id === selectedMetric)!,
    [selectedMetric]
  );

  // Fetch API
  const fetchData = useCallback(async (metric: MetricType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/statistics?metric=${metric}`);
      if (!res.ok) throw new Error(res.statusText);
      const payload: ApiPayload = await res.json();
      setData(payload);
    } catch {
      setError("Не удалось загрузить данные.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(selectedMetric); }, [selectedMetric, fetchData]);

  // Prepare categories + sorting + segmentation
  const processed = useMemo(() => {
    const values = data.series[0]?.data || [];
    const paired = data.categories.map((full, i) => ({
      full,
      short: full.length > 10 ? full.slice(0, 10) + "…" : full,
      value: values[i] ?? 0,
    }));
    // sort descending for ranking
    const desc = [...paired].sort((a, b) => b.value - a.value);
    let list = segment === "leaders"
      ? desc.slice(0, 5)
      : segment === "outsiders"
        ? [...desc].reverse().slice(0, 5)
        : desc;
    return {
      series: [{ name: currentMetric.label, data: list.map(p => p.value) }],
      catsShort: list.map(p => p.short),
      catsFull: list.map(p => p.full),
    };
  }, [data, segment, currentMetric.label]);

  // Chart options
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: { type: "bar", animations: { enabled: true, speed: 500 }, fontFamily: "Outfit, sans-serif" },
    colors: [currentMetric.color],
    xaxis: {
      categories: processed.catsShort,
      labels: { style: { colors: "#51565e", fontSize: "12px" } },
    },
    yaxis: {
      min: Math.min(0, ...processed.series[0].data),
      max: Math.max(0, ...processed.series[0].data),
      labels: { formatter: v => `${v}${currentMetric.unit}`, style: { colors: "#51565e" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    annotations: {
      yaxis: [{ y: 0, borderColor: "#cbd5e1", strokeDashArray: 4 }],
    },
    plotOptions: { bar: { columnWidth: "50%", borderRadius: 4 } },
    dataLabels: {
      enabled: true,
      formatter: v => `${v}${currentMetric.unit}`,
      offsetY: -6,
      style: { fontSize: "10px", colors: ["#51565e"] },
    },
    tooltip: {
      theme: "light",
      x: {
        formatter: (_val, { dataPointIndex }) => processed.catsFull[dataPointIndex],
      },
      y: { formatter: v => `${v}${currentMetric.unit}` },
    },
    grid: {
      borderColor: "#e5e7eb",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    noData: {
      text: loading ? "Загрузка..." : error || "Нет данных",
      style: { color: "#51565e", fontFamily: "Outfit, sans-serif" },
    },
    responsive: [{ breakpoint: 640, options: { chart: { height: 240 }, dataLabels: { enabled: false } } }],
  }), [processed, currentMetric, loading, error]);

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-5 sm:p-6">
      {/* Header + Metric Toggle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {currentMetric.label}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Просмотр по месяцам</p>
        </div>
        <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
          {METRICS_CONFIG.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={classNames(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                selectedMetric === m.id
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              )}
              style={selectedMetric === m.id ? { backgroundColor: m.color } : undefined}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Segmentation Tabs */}
      <div className="flex gap-4 mb-4">
        {[
          { id: "all", label: "Все" },
          { id: "leaders", label: "Лидеры" },
          { id: "outsiders", label: "Аутсайдеры" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSegment(tab.id as SegmentType)}
            className={classNames(
              "px-3 py-1 rounded-md text-sm",
              segment === tab.id
                ? "bg-gray-200 dark:bg-gray-700 font-medium"
                : "bg-transparent text-gray-600 dark:text-gray-400 hover:underline"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {loading && "Загрузка данных..."}
          {error && <span className="text-red-500">{error}</span>}
        </div>
        <div className="relative">
          <button onClick={() => setIsDropdownOpen(o => !o)} aria-label="Опции графика">
            <MoreDotIcon className="size-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} align="right">
            <DropdownItem onItemClick={() => setIsDropdownOpen(false)}>Смотреть детали</DropdownItem>
            <DropdownItem onItemClick={() => setIsDropdownOpen(false)}>Экспорт данных</DropdownItem>
            <DropdownItem onItemClick={() => setIsDropdownOpen(false)}>Настроить</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <Chart options={chartOptions} series={processed.series} type="bar" height={300} />
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-800 dark:border-gray-200" />
          </div>
        )}
      </div>
    </div>
  );
}
