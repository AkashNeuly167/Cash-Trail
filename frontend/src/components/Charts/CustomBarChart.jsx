import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomBarChart = ({ data }) => {
  const getBarColor = (index) => (index % 2 === 0 ? '#7c3aed' : '#c4b5fd');

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-3 rounded shadow border border-gray-200">
          <p className="text-sm font-semibold text-purple-700">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600">
            ₹{payload[0].payload.amount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
     

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          {/* Purple dashed grid lines with border box */}
          <CartesianGrid stroke="#e9d5ff" strokeDasharray="3 3" />
          
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#7c3aed' }}
            axisLine={{ stroke: '#7c3aed' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#7c3aed' }}
            axisLine={{ stroke: '#7c3aed' }}
            tickLine={false}
          />

          {/* Enable full-box hover effect */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }} // light purple overlay
            wrapperStyle={{ zIndex: 10 }}
          />

          <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={32}>
            {data.map((_, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
