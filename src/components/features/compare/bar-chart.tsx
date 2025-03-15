"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(0, 100%, 50%)",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig

export function CompareBarChart() {
    return (
        <Card className="w-full">
            <CardContent className="px-0">
                <ChartContainer config={chartConfig} className="h-24 w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        height={100}
                        width={800} // Set a large fixed width
                        barSize={15}
                        barGap={2}
                        layout="vertical"
                        margin={{
                            right: 50, // Increased right margin for labels
                            left: 10,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="month"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="desktop" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar
                            dataKey="desktop"
                            layout="vertical"
                            fill="hsl(0, 100%, 50%)"
                            radius={4}
                            maxBarSize={700} // Set a large maximum bar size
                        >
                            <LabelList
                                dataKey="month"
                                position="insideLeft"
                                offset={8}
                                className="fill-[--color-label]"
                                fontSize={10}
                            />
                            <LabelList dataKey="desktop" position="right" offset={8} className="fill-foreground" fontSize={10} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

