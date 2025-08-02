import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ['#875Cf5','#FA2C37','#FF6900','#4f39f6'];

const RecentIncomeWithChart = ({data,totalIncome}) => {

    const [chartData, setChartData] = useState([]);

   useEffect(() => {
  const prepareChartData = () => {
    const grouped = {};
    data.forEach(({ source, amount }) => {
      grouped[source] = (grouped[source] || 0) + amount;
    });

    const dataArr = Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount,
    }));

    setChartData(dataArr);
  };

  prepareChartData();
}, [data]);


  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
           <h5 className='text-lg'> Last 60 days Income</h5>
        </div>

        <CustomPieChart 
           data={chartData}
           label="Total Income"
           totalAmount={`₹${totalIncome}`}
           showTextAnchor
           colors={COLORS}
           />
    </div>
  )
}

export default RecentIncomeWithChart