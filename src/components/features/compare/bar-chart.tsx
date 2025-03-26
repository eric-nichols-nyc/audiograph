"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CompareBarChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title?: string;
  valueFormatter?: (value: number) => string;
}

export function CompareBarChart({
  data,
  title,
  valueFormatter = (value) => value.toString(),
}: CompareBarChartProps) {
  const chartConfig = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.name]: {
        label: item.name,
        color: item.color,
      },
    }),
    {
      label: {
        color: "hsl(var(--background))",
      },
    }
  ) satisfies ChartConfig;

  return (
    <Card className="w-full border border-accent-foreground">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="px-0">
        <ChartContainer config={chartConfig} className="h-24 w-full">
          <BarChart
            accessibilityLayer
            data={data}
            height={100}
            width={800}
            barSize={15}
            barGap={2}
            layout="vertical"
            margin={{
              right: 50,
              left: 10,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="value" layout="vertical" radius={4} maxBarSize={700}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={10}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={10}
                formatter={valueFormatter}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
