"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", impressions: 4000, clicks: 240, conversions: 24 },
  { name: "Feb", impressions: 3000, clicks: 139, conversions: 22 },
  { name: "Mar", impressions: 2000, clicks: 980, conversions: 29 },
  { name: "Apr", impressions: 2780, clicks: 390, conversions: 20 },
  { name: "May", impressions: 1890, clicks: 480, conversions: 18 },
  { name: "Jun", impressions: 2390, clicks: 380, conversions: 25 },
  { name: "Jul", impressions: 3490, clicks: 430, conversions: 30 },
]

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="impressions" stroke="#8884d8" strokeWidth={2} />
        <Line type="monotone" dataKey="clicks" stroke="#82ca9d" strokeWidth={2} />
        <Line type="monotone" dataKey="conversions" stroke="#ffc658" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
