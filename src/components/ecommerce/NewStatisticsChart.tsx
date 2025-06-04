// NewStatisticsChart.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";

// Типы для метрик
type MetricType = "turnover" | "checks" | "profit";

// Интерфейс ответа API
interface ApiPayload {
  series: { name: string; data: number[] }[];
  categories: string[];
}

export default function NewStatisticsChart() {
  // 1. Стейт для выбранной метрики
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("turnover");

  // 2. Стейт для данных (серии и категории)
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // 3. Стейт для Dropdown-меню (верхний правый угол)
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // 4. Функция для получения данных с сервера
  // Предполагаем, что сервер отдаёт данные по маршруту `/api/statistics?metric=...`
  const fetchMetricData = async (metric: MetricType) => {
    try {
      const response = await fetch(`/api/statistics?metric=${metric}`);
      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.status}`);
      }
      const payload: ApiPayload = await response.json();
      setSeries(payload.series);
      setCategories(payload.categories);
    } catch (err) {
      console.error(err);
      // В случае ошибки можно подставить «mock» данные или оставить пустыми
      setSeries([]);
      setCategories([]);
    }
  };

  // 5. При монтировании и при изменении метрики — запрашиваем данные
  useEffect(() => {
    fetchMetricData(selectedMetric);
  }, [selectedMetric]);

  // 6. Настройки ApexCharts
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      stacked: false,
    },
    colors: ["#629731", "#FF6B6B"],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#51565e",
          fontFamily: "Outfit, sans-serif",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      // Допустим, что все три метрики измеряются в процентах и укладываются в 100%
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#51565e",
          fontFamily: "Outfit, sans-serif",
        },
        formatter: (val: number) => `${val}%`,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      offsetY: -16,
      style: {
        fontSize: "10px",
        colors: ["#51565e"],
        fontFamily: "Outfit, sans-serif",
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Outfit, sans-serif",
      labels: {
        colors: "#51565e",
        useSeriesColors: false,
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      yaxis: {
        lines: { show: true },
      },
      xaxis: {
        lines: { show: false },
      },
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      x: {
        show: true,
        formatter: (val) => val,
      },
      y: {
        formatter: (val: number) => `${val}%`,
      },
      style: {
        fontFamily: "Outfit, sans-serif",
        fontSize: "12px",
        cssClass: "apexcharts-custom-tooltip",
      },
      marker: {
        show: true,
      },
      custom: ({ series, dataPointIndex, w }) => {
        const label = w.globals.categoryLabels[dataPointIndex] || "";
        const activeSeries = w.globals.seriesNames
          .map((name, i) => {
            const value = series[i]?.[dataPointIndex];
            // Если нет данных у серии или она скрыта — пропускаем
            const isVisible = w.globals.collapsedSeriesIndices.indexOf(i) === -1;
            if (value === undefined || !isVisible) return null;
            return `
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
              ">
                <div style="
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: ${w.globals.colors[i]};
                  flex-shrink: 0;
                "></div>
                <div style="font-weight: 500;">
                  ${name}: <span style="font-weight: 600">${value}%</span>
                </div>
              </div>
            `;
          })
          .filter(Boolean)
          .join("");

        return `
          <div style="
            padding: 10px;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            font-family: 'Outfit', sans-serif;
            font-size: 13px;
            color: #1a202c;
            min-width: 140px;
          ">
            <div style="font-weight: 600; margin-bottom: 6px;">${label}</div>
            ${activeSeries}
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 240 },
          dataLabels: { enabled: false },
        },
      },
    ],
  };

  // 7. Функция для отображения русского названия метрики в заголовке
  const getMetricTitle = (metric: MetricType) => {
    switch (metric) {
      case "turnover":
        return "Изменение оборота";
      case "checks":
        return "Изменение кол-ва чеков";
      case "profit":
        return "Изменение прибыли";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-6 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {/* ── Заголовок + кнопки выбора метрики ── */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {getMetricTitle(selectedMetric)}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {/* Подзаголовок можно менять динамически, если нужно */}
            Просмотр по месяцам
          </p>
        </div>

        {/* ── Три кнопки для выбора метрики ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedMetric("turnover")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selectedMetric === "turnover"
                  ? "bg-[#629731] text-white"
                  : "bg-[#b9bec5] text-[#51565e] hover:bg-[#9dbf7c]"
              }
            `}
          >
            Изменение оборота
          </button>
          <button
            onClick={() => setSelectedMetric("checks")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selectedMetric === "checks"
                  ? "bg-[#629731] text-white"
                  : "bg-[#b9bec5] text-[#51565e] hover:bg-[#9dbf7c]"
              }
            `}
          >
            Изменение кол-ва чеков
          </button>
          <button
            onClick={() => setSelectedMetric("profit")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selectedMetric === "profit"
                  ? "bg-[#629731] text-white"
                  : "bg-[#b9bec5] text-[#51565e] hover:bg-[#9dbf7c]"
              }
            `}
          >
            Изменение прибыли
          </button>
        </div>
      </div>

      {/* ── Верхний правый Dropdown (опции) ── */}
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown}>Смотреть детали</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Экспорт данных</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Настроить</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* ── Сам график ── */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={280} />
        </div>
      </div>
    </div>
  );
}
