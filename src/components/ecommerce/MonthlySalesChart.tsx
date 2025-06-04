import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MonthlySalesChart() {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

useEffect(() => {
  fetch("/api/sales")
    .then((res) => res.json())
    .then((data) => {
      setSeries(data.series);
      setCategories(data.categories);
    })
    .catch((error) => console.error("Ошибка загрузки данных:", error));
}, []);


  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 240,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#629731", "#80aa59"],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#51565e",
          fontFamily: "Outfit, sans-serif",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#51565e",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
stroke: {
  show: true,
  width: 1,
  colors: ["transparent"],
},

    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: "#51565e",
      },
    },
    grid: {
      borderColor: "#b9bec5",
      yaxis: {
        lines: { show: true },
      },
    },
    fill: { opacity: 1 },
tooltip: {
  theme: "light",
  x: { show: false },
  custom: function({ series, seriesIndex, dataPointIndex, w }) {
    const value = series[seriesIndex][dataPointIndex];
    const seriesName = w.globals.seriesNames[seriesIndex];
    const color = w.config.colors?.[seriesIndex] || "#000";

    return `
      <div style="
        display: flex;
        align-items: center;
        padding: 8px 12px;
        font-family: Outfit, sans-serif;
        font-size: 14px;
        border-radius: 8px;
        background: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: ${color};
          margin-right: 8px;
        "></div>
        <div style="color: #333;">${seriesName}: ${value}</div>
      </div>
    `;
  },
}

  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown}>View More</DropdownItem>
            <DropdownItem onItemClick={closeDropdown}>Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
