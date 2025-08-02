import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

    //get all expense details 
   const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoading(false);
    }
  };

  // handle add expense
  const handleAddExpense = async (expense) => {
    const { amount, category, date, icon } = expense;

    //validation checks 
    if(!category.trim()){
      toast.error('Category is required');
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error('Amount must be a positive number');
      return;
    }

    if(!date){
      toast.error('Date is required');
      return;
    }

    try{
      await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, {amount, category, date, icon 
      });

      setOpenAddExpenseModal(false);
      toast.success('Expense added successfully');
      fetchExpenseDetails();
     } catch (error) {
      console.error('Error adding expense:', error.response?.data?.message || error.message);
     }
  };

   const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Expense deleted successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.error('Error deleting expense:', error.response?.data?.message || error.message);
    }
  };
  
  const handleDownloadExpenseDetails = async () => {
      try{
        const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE,{
          responseType: 'blob'
        });

        //create a url for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'expense_details.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

       }catch (error) {
              console.error('Error downloading expense details:', error);
              toast.error('Failed to download expense details. Please try again.');
       }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  

  return (
     <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className='grid gris-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

         <Modal
           isOpen={openAddExpenseModal}
           onClose={() => setOpenAddExpenseModal(false)}
           title="Add Expense"
         >
           <AddExpenseForm
             onAddExpense={handleAddExpense}
             onClose={() => setOpenAddExpenseModal(false)}
           />
         </Modal>

         <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense">
              <DeleteAlert
                content="Are you sure you want to delete this expense?"
                onDelete={() => 
                  deleteExpense(openDeleteAlert.data)}
                  />
          </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Expense