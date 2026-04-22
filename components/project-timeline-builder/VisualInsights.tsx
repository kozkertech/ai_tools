"use client"

import React from "react"
import { 
   BarChart3, 
   PieChart as PieChartIcon 
} from "lucide-react"
import { Card } from "@/components/ui/card"
import {
   ResponsiveContainer,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   PieChart,
   Pie,
   Cell,
} from "recharts"
import type { AIResponse, Priority } from "@/app/tools/project-timeline-builder/page"

interface VisualInsightsProps {
   chartData: AIResponse['chartData'];
   priorityColors: Record<Priority, string>;
}

export const VisualInsights: React.FC<VisualInsightsProps> = ({ chartData, priorityColors }) => {
   // Ensure priority colors are mapped correctly to the chart data format
   const mappedPriorityData = chartData.priorityDistribution.map(item => ({
      ...item,
      color: priorityColors[item.name.toLowerCase() as Priority] || item.color
   }));

   return (
      <div className="space-y-6 sm:space-y-8 transition-colors">
         <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
            <BarChart3 className="w-7 h-7 text-purple-600 dark:text-purple-500" />
            Insights
         </h2>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col min-h-[350px] sm:h-[400px] rounded-[2rem] sm:rounded-[2.5rem] shadow-sm dark:shadow-xl transition-colors">
               <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                     <PieChartIcon className="w-4 h-4 text-orange-500" />
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-400 uppercase tracking-widest">Priority Distribution</h3>
               </div>
               <div className="flex-1 w-full h-[250px] sm:h-auto">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={mappedPriorityData}
                           innerRadius="60%"
                           outerRadius="90%"
                           paddingAngle={8}
                           dataKey="value"
                           stroke="none"
                        >
                           {mappedPriorityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{ 
                              backgroundColor: 'var(--tooltip-bg, #ffffff)', 
                              border: '1px solid var(--tooltip-border, #e4e4e7)', 
                              borderRadius: '12px', 
                              padding: '12px',
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                           }}
                           itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        />
                        <Legend
                           verticalAlign="bottom"
                           align="center"
                           layout="horizontal"
                           wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'black', color: '#71717a', paddingTop: '20px' }}
                        />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col min-h-[350px] sm:h-[400px] rounded-[2rem] sm:rounded-[2.5rem] shadow-sm dark:shadow-xl transition-colors">
               <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                     <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-400 uppercase tracking-widest">Project Load Over Time</h3>
               </div>
               <div className="flex-1 w-full h-[250px] sm:h-auto">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData.timelineLoad} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" vertical={false} />
                        <XAxis
                           dataKey="name"
                           stroke="#71717a"
                           fontSize={9}
                           fontWeight="black"
                           axisLine={false}
                           tickLine={false}
                           dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                           cursor={{ fill: 'currentColor', opacity: 0.1 }}
                           contentStyle={{ 
                              backgroundColor: 'var(--tooltip-bg, #ffffff)', 
                              border: '1px solid var(--tooltip-border, #e4e4e7)', 
                              borderRadius: '12px',
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                           }}
                        />
                        <Bar 
                           dataKey="load" 
                           radius={[4, 4, 0, 0]}
                           barSize={Math.max(16, 32 / (chartData.timelineLoad.length / 4))}
                        >
                           {chartData.timelineLoad.map((entry, index) => (
                              <Cell 
                                 key={`cell-${index}`} 
                                 fill={entry.load > 70 ? '#ef4444' : entry.load > 40 ? '#f97316' : '#3b82f6'} 
                                 fillOpacity={0.8} 
                              />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </Card>
         </div>
      </div>
   )
}
