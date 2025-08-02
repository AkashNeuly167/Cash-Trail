import React, {useMemo} from "react";
import CustomPieChart from "../Charts/CustomPieChart";





const FinanceOverview = ({ totalIncome = 0, totalExpense = 0, totalBalance = 0 }) => {
    const COLORS = useMemo(() => ["#22C55E", "#EF4444", "#0000FF"], []);

  const income = Number(totalIncome) || 0;
  const expense = Number(totalExpense) || 0;
  const balance = Number(totalBalance) || 0;

  // ⚠️ Don't allow NaN or negative values
 const validData = [income, expense, balance].every(
  val => typeof val === 'number' && isFinite(val) && val >= 0
);
 

  const balanceData = useMemo (() => [
    { name: "Total Balance", amount: balance },
    { name: "Total Expense", amount: expense },
    { name: "Total Income", amount: income },
  ], [balance, expense, income]);

   if (!validData) {
    return <p className="text-red-500">Invalid financial data</p>;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`₹${balance.toLocaleString()}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
