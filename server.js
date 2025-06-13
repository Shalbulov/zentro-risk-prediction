// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ Тест подключения к базе
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    res.status(500).json({ error: "Database connection error" });
  }
});

app.use("/api/auth", authRoutes);

// =============== НОВЫЙ РОУТ ДЛЯ ДОБАВЛЕНИЯ СОБЫТИЯ =================
app.post("/api/events", async (req, res) => {
  const { title, startDate, endDate, color, userId } = req.body;

  // ----------- ВАЛИДАЦИЯ ВСЕХ ПОЛЕЙ ----------
  if (!title || !startDate || !endDate || !color || !userId) {
    return res.status(400).json({ error: "Все поля обязательны для заполнения." });
  }
  // --------------------------------------------

  try {
    // 1. Сохраняем событие в БД
    await pool.query(
      `INSERT INTO events (title, start_date, end_date, color, user_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [title, startDate, endDate, color, userId]
    );

    // 2. Получаем email пользователя
    const userResult = await pool.query(
      `SELECT email FROM users WHERE id = $1`,
      [userId]
    );
    const email = userResult.rows?.[0]?.email;

    if (email) {
      // 3. Отправляем уведомление на email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Calendar" <calendar@korzinka.kz>',
        to: email,
        subject: "Новое событие в календаре",
        text: `📅 Новое событие: "${title}"\nС: ${startDate}\nПо: ${endDate}`,
      });
    }

    res.status(200).json({ message: "Event saved and email sent" });
  } catch (error) {
    console.error("❌ Error saving event:", error);
    res.status(500).json({ error: "Event creation failed" });
  }
});
// ====================================================================

/**
 * 1) Месячные данные за 2023, 2024 и 2025 годы для трёх метрик:
 */
const yearData = {
  "2023": {
    turnover: [60, 70, 80, 75, 85, 80, 90, 95, 100, 105, 110, 115],
    checks:   [45, 50, 55, 52, 60, 58, 65, 68, 70, 72, 75, 78],
    profit:   [20, 22, 25, 23, 27, 26, 30, 32, 35, 36, 38, 40],
  },
  "2024": {
    turnover: [65, 75, 85, 80, 90, 85, 95, 32, 13, 64, 55, 32],
    checks:   [48, 55, 60, 57, 62, 60, 70, 75, 78, 80, 82, 85],
    profit:   [22, 25, 28, 26, 30, 29, 32, 35, 38, 40, 42, 45],
  },
  "2025": {
    turnover: [70, 82, 94, 89, 98, 95, 105, 110, 115, 120, 125, 130],
    checks:   [50, 60, 65, 63, 70, 68, 75, 78, 80, 85, 87, 90],
    profit:   [25, 28, 30, 29, 33, 31, 35, 37, 40, 42, 45, 48],
  },
};

/**
 * 2) /api/sales — демонстрация простого графика
 */
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

/**
 * 3) /api/ecommerce/metrics — чтение из metrics.json
 */
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
 * 4) /api/statistics?metric=<turnover|checks|profit>&period=<month|annual>
 */
app.get("/api/statistics", (req, res) => {
  const metric = req.query.metric;
  const periodParam = req.query.period;
  const period = typeof periodParam === "string" ? periodParam : "month";

  if (typeof metric !== "string") {
    return res.status(400).json({ error: "`metric` обязателен" });
  }
  if (!["turnover", "checks", "profit"].includes(metric)) {
    return res.status(400).json({ error: `Unknown metric: ${metric}` });
  }
  if (!["month", "annual"].includes(period)) {
    return res.status(400).json({ error: `Unknown period: ${period}` });
  }

  const categories = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  if (period === "month") {
    const data2024 = yearData["2024"][metric];
    return res.json({
      categories,
      series: [
        {
          name:
            metric === "turnover"
              ? "Оборот"
              : metric === "checks"
              ? "Чеки"
              : "Прибыль",
          data: data2024,
        },
      ],
    });
  }

  const data2023 = yearData["2023"][metric];
  const data2024 = yearData["2024"][metric];
  const sum2023 = data2023.reduce((a, v) => a + v, 0);
  const sum2024 = data2024.reduce((a, v) => a + v, 0);

  return res.json({
    categories: ["2023", "2024"],
    series: [
      {
        name:
          metric === "turnover"
            ? "Оборот"
            : metric === "checks"
            ? "Чеки"
            : "Прибыль",
        data: [sum2023, sum2024],
      },
    ],
  });
});

/**
 * 5) /api/sales/statistics?start=dd-MM-yyyy&end=dd-MM-yyyy
 */
app.get("/api/sales/statistics", (req, res) => {
  const { start, end } = req.query;
  if (typeof start !== "string" || typeof end !== "string") {
    return res
      .status(400)
      .json({ error: "`start` и `end` обязательны в формате dd-MM-yyyy" });
  }

  const [d1, m1, y1] = start.split("-").map(Number);
  const [d2, m2, y2] = end.split("-").map(Number);
  const startDate = new Date(y1, m1 - 1, d1);
  const endDate = new Date(y2, m2 - 1, d2);
  if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
    return res
      .status(400)
      .json({ error: "Неправильный диапазон дат" });
  }

  const yearKey = String(endDate.getFullYear());
  const monthIdx = endDate.getMonth(); // 0–11

  const turnoverArr = yearData[yearKey]?.turnover;
  const checksArr   = yearData[yearKey]?.checks;
  const profitArr   = yearData[yearKey]?.profit;

  if (!turnoverArr || !checksArr || !profitArr) {
    return res
      .status(404)
      .json({ error: `Нет данных за ${yearKey}` });
  }

  const revenue      = turnoverArr[monthIdx];
  const receiptCount = checksArr[monthIdx];
  const profit       = profitArr[monthIdx];
  const salesCount   = receiptCount; // MVP: продажи = количество чеков
  const averageTicket =
    salesCount > 0 ? revenue / salesCount : 0;

  const prevIdx      = monthIdx > 0 ? monthIdx - 1 : 0;
  const prevRev      = turnoverArr[prevIdx];
  const prevChk      = checksArr[prevIdx];
  const prevPrf      = profitArr[prevIdx];
  const prevSales    = prevChk;
  const prevAvgCheck = prevSales > 0 ? prevRev / prevSales : 0;

  const calcDelta = (cur, prev) =>
    prev === 0 ? 0 : ((cur - prev) / prev) * 100;

  res.json({
    revenue,
    revenueChangePercent:      calcDelta(revenue, prevRev),
    salesCount,
    salesCountChangePercent:   calcDelta(salesCount, prevSales),
    receiptCount,
    receiptCountChangePercent: calcDelta(receiptCount, prevChk),
    averageTicket,
    averageTicketChangePercent: calcDelta(averageTicket, prevAvgCheck),
    profit,
    profitChangePercent:       calcDelta(profit, prevPrf),
    storesCount:               325, // stub-значение
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
