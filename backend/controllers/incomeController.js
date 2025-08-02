import * as XLSX from "xlsx";

import Income from "../models/Income.js"

// add income source
const addIncome = async (req, res) => {
    const userId = req.user.id; 
    try {
        const {icon, source, amount,date} = req.body; 
    
    // validation:check  for missing fields
    if(!source || !amount || !date){
        return res.status(400).json({error:'All fields are required'});
    }
    const newIncome = new Income ({
        userId,
        icon,
        source,
        amount,
        date: new Date()
    });
    await newIncome.save();
    res.status(201).json(newIncome);
    }catch (error) {
        res.status(500).json({error:'Something went wrong'});
    }
}
// get all income source
const getAllIncome = async (req, res) => {
   const userId = req.user.id;
   try {
    const income = await Income.find({userId}).sort({date:-1});
    res.status(200).json(income);
    } catch (error) {
        res.status(500).json({error:'Something went wrong'});
    }
    
}
// delete income source
const deleteIncome = async (req, res) => {
   
   try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({message:'Income deleted successfully'});
   } catch (error) {
    res.status(500).json({error:'Something went wrong'});
   }
}
// download excel
const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Income");

    // Create Excel buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers
    res.setHeader("Content-Disposition", "attachment; filename=income.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Send the file
    res.send(buffer);

  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export {addIncome, getAllIncome, deleteIncome, downloadIncomeExcel}