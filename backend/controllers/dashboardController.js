import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { isValidObjectId } from "mongoose";
import { Types } from "mongoose";


const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch income and expense data for the user
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log('Total Income',{totalIncome,userId:isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

       // get income transactions in the last 60 days
       const last60DaysIncomeTrasactions = await Income.find({
        userId,
        date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 });

      //get total income for the last 60 days
      const totalIncomeLast60Days = last60DaysIncomeTrasactions.reduce((sum, transaction) => sum + transaction.amount, 0);

      // get expense transactions in the last 30 days
      const last30DaysExpenseTrasactions = await Expense.find({
        userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 });
      
        //get total expense for the last 30 days
        const totalExpenseLast30Days = last30DaysExpenseTrasactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        //fetch last 5 trasactions  (income + expenses)
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type: "expense",
            }))
        ].sort((a, b) => b.date- a.date);//sort latest transactions first

        //Final response
        res.json({
            totalBalance:
            (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses:{
                total:totalExpenseLast30Days,
                transactions:last30DaysExpenseTrasactions,
            },
            last60DaysIncome:{
                total:totalIncomeLast60Days,
                transactions:last60DaysIncomeTrasactions,
            },
            recentTransactions:lastTransactions  
        });
    } catch (error) {
  console.error("Dashboard Error:", error); 
  res.status(500).json({ error: "Something went wrong" });
}

}


export {getDashboardData};