"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCompareArtists } from "@/hooks/queries/use-compare-artists";

export function HorizontalStackedBarChart() {
  const {
    artist1Metrics,
    artist2Metrics,
    artist1Name,
    artist2Name,
    loading,
    error,
  } = useCompareArtists();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const data = [
    {
      name: artist1Name,
      ...Object.fromEntries(artist1Metrics.map((m) => [m.platform, m.value])),
    },
    {
      name: artist2Name,
      ...Object.fromEntries(artist2Metrics.map((m) => [m.platform, m.value])),
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4">Fanbase Distribution</h2>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 60,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#121212",
                color: "#fff",
                borderRadius: "8px",
                borderColor: "#222",
              }}
              formatter={(value) => [`${value}`, ""]}
              labelFormatter={(value) => `Artist: ${value}`}
            />
            <Legend />
            {artist1Metrics.map((metric) => (
              <Bar
                key={metric.platform}
                dataKey={metric.platform}
                name={metric.platform}
                stackId="a"
                fill={metric.fill}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
