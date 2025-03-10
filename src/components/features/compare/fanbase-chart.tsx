"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function FanbaseChart() {
  // Data for the left donut chart
  const leftChartData = [
    { name: "YouTube", value: 25 },
    { name: "Instagram", value: 30 },
    { name: "Twitter", value: 15 },
    { name: "Facebook", value: 20 },
    { name: "Other", value: 10 },
  ]

  // Data for the right donut chart
  const rightChartData = [
    { name: "YouTube", value: 20 },
    { name: "Instagram", value: 40 },
    { name: "Twitter", value: 5 },
    { name: "Facebook", value: 25 },
    { name: "Other", value: 10 },
  ]

  // Configuration for the charts
  const chartConfig = {
    YouTube: {
      label: "YouTube",
      color: "hsl(346, 100%, 50%)",
    },
    Instagram: {
      label: "Instagram",
      color: "hsl(319, 71%, 49%)",
    },
    Twitter: {
      label: "Twitter",
      color: "hsl(203, 89%, 53%)",
    },
    Facebook: {
      label: "Facebook",
      color: "hsl(220, 46%, 48%)",
    },
    Other: {
      label: "Other",
      color: "hsl(120, 39%, 49%)",
    },
  }

  // Colors for the chart segments
  const COLORS = ["#FF0050", "#C13584", "#1DA1F2", "#4267B2", "#4CAF50"]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Donut Charts */}
        <div className="flex flex-wrap justify-around items-center gap-8">
          <div className="w-72 h-72">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leftChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {leftChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="w-72 h-72">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rightChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {rightChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Size Comparison Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span>19.3M</span>
            <span>375.9M</span>
          </div>
          <div className="relative h-6 w-full">
            <div className="absolute inset-0 flex">
              <div className="bg-gray-400 h-full w-[30%]"></div>
              <div className="relative w-0">
                <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 bg-white px-3 py-1 rounded shadow-sm z-10">
                  <span className="text-xs font-medium">Finbase Size</span>
                </div>
              </div>
              <div className="bg-gray-800 h-full w-[70%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

