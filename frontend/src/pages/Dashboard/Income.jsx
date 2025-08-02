import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Fetch all income details
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.error('Something went wrong:', error);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder functions (to be implemented later)
  const handleAddIncome = async (income) => {
    const { amount, source, date, icon } = income;

    //validation checks 
    if(!source.trim()){
      toast.error('Source is required');
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
      await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, {amount, source, date, icon 
      });

      setOpenAddIncomeModal(false);
      toast.success('Income added successfully');
      fetchIncomeDetails();
     } catch (error) {
      console.error('Error adding income:', error.response?.data?.message || error.message);
     }
      
    
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Income deleted successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.error('Error deleting income:', error.response?.data?.message || error.message);
    }
  };
  
  const handleDownloadIncomeDetails = async () => {
    try{
        const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME,{
          responseType: 'blob'
        });

        //create a url for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'income_details.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

       }catch (error) {
              console.error('Error downloading income details:', error);
              toast.error('Failed to download income details. Please try again.');
       }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []); // No need for cleanup return here

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />
        </div>
        
        <IncomeList
          transactions={incomeData}
           onDelete={(id) => {
             setOpenDeleteAlert({
               show: true,
               data: id,
             });
           }}
           onDownload={handleDownloadIncomeDetails}
        />
          
      </div>

          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income">
              <AddIncomeForm onAddIncome={handleAddIncome} />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Income">
              <DeleteAlert
                content="Are you sure you want to delete this income?"
                onDelete={() => 
                  deleteIncome(openDeleteAlert.data)}
                  />
          </Modal>
  
     </div>
    </DashboardLayout>
  );
};

export default Income;
