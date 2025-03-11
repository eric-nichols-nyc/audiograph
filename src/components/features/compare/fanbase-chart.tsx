"use client"

import { ComparePieChart } from "./pie-chart"
export function FanbaseChart() {
  // Data for the left donut chart
  // const leftChartData = [
  //   { name: "YouTube", value: 25 },
  //   { name: "Instagram", value: 30 },
  //   { name: "Twitter", value: 15 },
  //   { name: "Facebook", value: 20 },
  //   { name: "Other", value: 10 },
  // ]

  // // Data for the right donut chart
  // const rightChartData = [
  //   { name: "YouTube", value: 20 },
  //   { name: "Instagram", value: 40 },
  //   { name: "Twitter", value: 5 },
  //   { name: "Facebook", value: 25 },
  //   { name: "Other", value: 10 },
  // ]

  // // Calculate totals
  // const leftTotal = leftChartData.reduce((sum, item) => sum + item.value, 0)
  // const rightTotal = rightChartData.reduce((sum, item) => sum + item.value, 0)

  // // Configuration for the charts
  // const chartConfig = {
  //   YouTube: {
  //     label: "YouTube",
  //     color: "hsl(346, 100%, 50%)",
  //   },
  //   Instagram: {
  //     label: "Instagram",
  //     color: "hsl(319, 71%, 49%)",
  //   },
  //   Twitter: {
  //     label: "Twitter",
  //     color: "hsl(203, 89%, 53%)",
  //   },
  //   Facebook: {
  //     label: "Facebook",
  //     color: "hsl(220, 46%, 48%)",
  //   },
  //   Other: {
  //     label: "Other",
  //     color: "hsl(120, 39%, 49%)",
  //   },
  // }

  // // Colors for the chart segments
  // const COLORS = ["#FF0050", "#C13584", "#1DA1F2", "#4267B2", "#4CAF50"]

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col space-y-6">
        {/* Donut Charts */}
        <div className="flex flex-wrap justify-around items-center gap-8">
          <ComparePieChart />
          <ComparePieChart />
        </div>
      </div>
    </div>
  )
}

