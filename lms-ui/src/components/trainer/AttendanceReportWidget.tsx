import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Mon", present: 45, absent: 5 },
  { name: "Tue", present: 42, absent: 8 },
  { name: "Wed", present: 48, absent: 2 },
  { name: "Thu", present: 40, absent: 10 },
  { name: "Fri", present: 46, absent: 4 },
  { name: "Sat", present: 38, absent: 12 },
  { name: "Sun", present: 0, absent: 0 },
];

export default function AttendanceReportWidget() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 h-full shadow-sm border-slate-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-800">
          Attendance Report
        </CardTitle>
        <Select defaultValue="weekly">
          <SelectTrigger className="h-7 w-[90px] text-[10px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[250px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
            />
            <Bar
              dataKey="present"
              fill="#10b981" // emerald-500
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="absent"
              fill="#f43f5e" // rose-500
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
