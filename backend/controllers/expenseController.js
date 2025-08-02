import * as XLSX from "xlsx";

import Expense from "../models/Expense.js"

// add expense source
const addExpense = async (req, res) => {
    const userId = req.user.id; 
    try {
        const {icon, category, amount,date} = req.body; 
    
    // validation:check  for missing fields
    if(!category || !amount || !date){
        return res.status(400).json({error:'All fields are required'});
    }
    const newExpense = new Expense ({
        userId,
        icon,
        category,
        amount,
        date: new Date()
    });
    await newExpense.save();
    res.status(201).json(newExpense);
    }catch (error) {
        res.status(500).json({error:'Something went wrong'});
    }
}
// get all expense source
const getAllExpense = async (req, res) => {
   const userId = req.user.id;
   try {
    const expense = await Expense.find({userId}).sort({date:-1});
    res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({error:'Something went wrong'});
    }
    
}
// delete expense source
const deleteExpense = async (req, res) => {
   
   try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({message:'Expense deleted successfully'});
   } catch (error) {
    res.status(500).json({error:'Something went wrong'});
   }
}
// download excel
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((item) => ({
      Source: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Expense");

    // Create Excel buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers
    res.setHeader("Content-Disposition", "attachment; filename=expense.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Send the file
    res.send(buffer);

  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export {addExpense,getAllExpense,deleteExpense,downloadExpenseExcel};