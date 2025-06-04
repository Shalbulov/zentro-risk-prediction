import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

type Metrics = {
  customersCount: number;
  customersChangePercent: number;
  newCustomersCount: number;
  newCustomersChangePercent: number;
  ordersCount: number;
  ordersChangePercent: number;
  pendingOrdersCount: number;
  pendingOrdersChangePercent: number;
};

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/ecommerce/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => {
        console.error("Failed to fetch ecommerce metrics:", err);
      });
  }, []);

  if (!metrics) {
    return (
      <div className="p-4 text-center text-gray-500">Loading metrics...</div>
    );
  }

  const formatNumber = (n: number) => n.toLocaleString();

  const MetricCard = ({
    icon,
    label,
    value,
    percent,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    percent: number;
  }) => {
    const isNegative = percent < 0;
    const badgeColor = isNegative ? "error" : "success";
    const ArrowIcon = isNegative ? ArrowDownIcon : ArrowUpIcon;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {label}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(value)}
            </h4>
          </div>
          <Badge color={badgeColor}>
            <ArrowIcon />
            {Math.abs(percent)}%
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        label="Customers"
        value={metrics.customersCount}
        percent={metrics.customersChangePercent}
      />
      <MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        label="New Customers"
        value={metrics.newCustomersCount}
        percent={metrics.newCustomersChangePercent}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
        label="Orders"
        value={metrics.ordersCount}
        percent={metrics.ordersChangePercent}
      />
      <MetricCard
        icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />}
        label="Pending Orders"
        value={metrics.pendingOrdersCount}
        percent={metrics.pendingOrdersChangePercent}
      />
    </div>
  );
}
