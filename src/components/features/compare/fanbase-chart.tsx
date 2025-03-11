"use client"

import { ComparePieChart } from "./pie-chart"
export function FanbaseChart() {
  // Data for the left donut chart

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

