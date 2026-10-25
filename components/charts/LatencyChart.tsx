"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "./useChartTheme";

/** Rerank latency from docs/performance/PERFORMANCE_BASELINE.md (30 samples each). */
export const LATENCY_DATA = [
  { config: "CPU fp32", p50: 8002, p95: 9795 },
  { config: "MPS fp32", p50: 5324, p95: 5918 },
  { config: "MPS fp16", p50: 1247, p95: 1378 },
  { config: "MPS mixed (chosen)", p50: 1884, p95: 2160 },
];

const ms = (value: unknown) =>
  typeof value === "number" ? `${value.toLocaleString("en-IN")} ms` : String(value);

export function LatencyChart() {
  const theme = useChartTheme();
  return (
    <div
      className="h-80 w-full"
      role="img"
      aria-label="Horizontal bar chart of reranker latency. Median: CPU fp32 8,002 ms, MPS fp32 5,324 ms, MPS fp16 1,247 ms, chosen mixed configuration 1,884 ms."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={LATENCY_DATA}
          layout="vertical"
          margin={{ top: 8, right: 72, bottom: 0, left: 8 }}
          barGap={2}
        >
          <CartesianGrid horizontal={false} stroke={theme.grid} />
          <XAxis
            type="number"
            domain={[0, 10000]}
            ticks={[0, 2500, 5000, 7500, 10000]}
            tickFormatter={(value: number) => `${value / 1000}s`}
            tickLine={false}
            axisLine={{ stroke: theme.grid }}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="config"
            width={96}
            tickLine={false}
            axisLine={false}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.4 }}
            formatter={(value) => ms(value)}
            contentStyle={{
              background: theme.surface,
              border: `1px solid ${theme.grid}`,
              borderRadius: 8,
              color: theme.text,
              fontSize: 12,
            }}
            labelStyle={{ color: theme.text, fontWeight: 600 }}
            itemStyle={{ color: theme.text }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: theme.text, fontSize: 12 }}>
                {value === "p50" ? "Median (p50)" : "95th percentile (p95)"}
              </span>
            )}
          />
          <Bar
            dataKey="p50"
            fill={theme.series[0]}
            maxBarSize={16}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="p50"
              position="right"
              formatter={ms}
              style={{ fill: theme.text, fontSize: 11 }}
            />
          </Bar>
          <Bar
            dataKey="p95"
            fill={theme.series[1]}
            maxBarSize={16}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
