import React from 'react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];

    const isExpense = name === "Total Expense";

    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "8px 12px",
          fontSize: "14px",
          position: "relative",
          left: isExpense ? "-100px" : "0px", // 🡐 Shift left if it's expense
          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
          borderRadius: "6px",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{name}</p>
        <p style={{ margin: 0 }}>
          Amount: <span style={{ fontWeight: 500 }}>₹{value?.toLocaleString()}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
