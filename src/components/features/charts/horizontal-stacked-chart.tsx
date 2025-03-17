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

export default function HorizontalStackedBarChart() {
  // Sample data
  const data = [
    {
      name: "Selena Gomez",
      youtube: 400,
      spotify: 300,
      deezer: 200,
      genius: 100,
      lastfm: 100,
    },
    {
      name: "Taylor Swift",
      youtube: 300,
      spotify: 400,
      deezer: 500,
      genius: 200,
      lastfm: 100,
    },
  ];

  return (
    <div className="flex flex-col items-center">
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
            <Bar dataKey="youtube" name="Youtube" stackId="a" fill="#FF0050" />
            <Bar dataKey="spotify" name="Spotify" stackId="a" fill="#1DB954" />
            <Bar dataKey="deezer" name="Deezer" stackId="a" fill="#1DA1F2" />
            <Bar dataKey="genius" name="Genius" stackId="a" fill="#FFFE00" />
            <Bar dataKey="lastfm" name="Last.fm" stackId="a" fill="#8B0000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
