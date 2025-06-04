// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;

app.use(cors());

/**
 * 1) Храним «месячные» данные за 2023 и 2024 годы
 *    для трех метрик: turnover, checks, profit.
 */
const yearData = {
  "2023": {
    turnover: [60,  70,  80,  75,  85,  80,  90,  95, 100, 105, 110, 115],
    checks:   [45,  50,  55,  52,  60,  58,  65,  68,  70,  72,  75,  78],
    profit:   [20,  22,  25,  23,  27,  26,  30,  32,  35,  36,  38,  40],
  },
  "2024": {
    turnover: [65,  75,  85,  80,  90,  85,  95, 100, 110, 115, 120, 125],
    checks:   [48,  55,  60,  57,  62,  60,  70,  75,  78,  80,  82,  85],
    profit:   [22,  25,  28,  26,  30,  29,  32,  35,  38,  40,  42,  45],
  },
};

// 2) Пример данных для /api/sales (оставляем без изменений)
let salesData = {
  categories: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  series: [
    {
      name: "Sales",
      data: [112, 129, 237, 131, 187, 130, 342, 110, 311, 231, 231, 61],
    },
  ],
};

app.get("/api/sales", (req, res) => {
  res.json(salesData);
});

// 3) Маршрут для чтения metrics.json (оставляем без изменений)
app.get("/api/ecommerce/metrics", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "metrics.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const metrics = JSON.parse(raw);
    res.json(metrics);
  } catch (err) {
    console.error("Failed to read metrics.json:", err);
    res.status(500).json({ error: "Could not load metrics" });
  }
});

/**
 * 4) Новый маршрут:
 *    GET /api/statistics?metric=<turnover|checks|profit>&period=<month|annual>
 */
app.get("/api/statistics", (req, res) => {
  const metric = req.query.metric;
  const period = req.query.period || "month";

  if (typeof metric !== "string") {
    return res.status(400).json({ error: "Query parameter `metric` обязателен" });
  }
  if (!["turnover", "checks", "profit"].includes(metric)) {
    return res.status(400).json({ error: `Unknown metric: ${metric}` });
  }
  if (!["month", "annual"].includes(period)) {
    return res.status(400).json({ error: `Unknown period: ${period}` });
  }

  // Общие месячные категории
  const categories = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // 4.1) Если запрошен «month» — отдаём 12 значений за 2024 год
  if (period === "month") {
    const data2024 = yearData["2024"][metric];
    return res.json({
      categories,
      series: [
        {
          name:
            metric === "turnover"
              ? "Оборот (turnover)"
              : metric === "checks"
              ? "Чеки (checks)"
              : "Прибыль (profit)",
          data: data2024,
        },
      ],
    });
  }

  // 4.2) Если запрошен «annual» — считаем суммы за 2023 и за 2024
  if (period === "annual") {
    const data2023 = yearData["2023"][metric];
    const data2024 = yearData["2024"][metric];

    const sum2023 = data2023.reduce((acc, v) => acc + v, 0);
    const sum2024 = data2024.reduce((acc, v) => acc + v, 0);

    return res.json({
      categories: ["2023", "2024"],
      series: [
        {
          name:
            metric === "turnover"
              ? "Оборот (turnover)"
              : metric === "checks"
              ? "Чеки (checks)"
              : "Прибыль (profit)",
          data: [sum2023, sum2024],
        },
      ],
    });
  }

  // На всякий случай – если ни один случай не подошёл
  return res.status(400).json({ error: "Неправильный запрос" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
