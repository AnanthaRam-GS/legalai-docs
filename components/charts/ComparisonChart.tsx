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

export interface ComparisonRow {
  metric: string;
  [system: string]: string | number;
}

/**
 * Grouped bars for two systems on a 0–1 scale (precision, recall, F1). Each bar carries its value, so a zero
 * stays readable as "0.000" rather than an empty gap.
 */
export function ComparisonChart({
  data,
  systems,
  ariaLabel,
}: {
  data: ComparisonRow[];
  systems: [string, string];
  ariaLabel: string;
}) {
  const theme = useChartTheme();
  return (
    <div className="h-72 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -16 }} barGap={2}>
          <CartesianGrid vertical={false} stroke={theme.grid} />
          <XAxis
            dataKey="metric"
            tickLine={false}
            axisLine={{ stroke: theme.grid }}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: theme.axis, fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.4 }}
            formatter={(value) => (typeof value === "number" ? value.toFixed(3) : String(value))}
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
            itemSorter={null}
            formatter={(value) => <span style={{ color: theme.text, fontSize: 12 }}>{value}</span>}
          />
          {systems.map((system, index) => (
            <Bar
              key={system}
              dataKey={system}
              fill={theme.series[index]}
              maxBarSize={36}
              // A zero still gets a 2px sliver, so its "0.000" label is drawn.
              minPointSize={2}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey={system}
                position="top"
                formatter={(value) => (typeof value === "number" ? value.toFixed(3) : "")}
                style={{ fill: theme.text, fontSize: 11 }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
