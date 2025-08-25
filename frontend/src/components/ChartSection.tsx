import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPI } from '../types';

interface ChartSectionProps {
  kpis: KPI[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ kpis }) => {
  const chartData = kpis.map(kpi => ({
    date: new Date(kpi.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stock: kpi.stock,
    demand: kpi.demand,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Stock vs Demand Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="stock" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Stock"
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
