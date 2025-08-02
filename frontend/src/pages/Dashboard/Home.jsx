import React, { useContext, useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import { API_PATH } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import InfoCard from '../../components/cards/InfoCard';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import  {addThousandsSeparator}  from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';



const Home = () => {
  useUserAuth();
  
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchDashboardData = async () => {
    

    setLoading(true);

    try{
      const response = await axiosInstance.get(`${API_PATH.DASHBOARD.GET_DATA}`);
    
    if(response.data){
      setDashboardData(response.data);
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally{
    setLoading(false);
  }
  };
   
  const {user} = useContext(UserContext);
 useEffect(()=>{

  if(user && !hasFetched){
    fetchDashboardData();
    setHasFetched(true);
  }
 },[user, hasFetched])

 const memoizedDashboardData = useMemo(() => ({
    totalBalance: dashboardData?.totalBalance || 0,
    totalIncome: dashboardData?.totalIncome || 0,
    totalExpense: dashboardData?.totalExpense || 0,
  }), [dashboardData]);

  return (
    <DashboardLayout activeMenu = 'Dashboard'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={`₹${addThousandsSeparator(dashboardData?.totalBalance || 0)}`}
            color="bg-green-400"
            />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={`₹${addThousandsSeparator(dashboardData?.totalIncome || 0)}`}
            color="bg-orange-500"
            />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={`₹${addThousandsSeparator(dashboardData?.totalExpense || 0)}`}
            color="bg-red-500"
            />
        </div>  

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 '>
          <RecentTransactions
           transactions = {dashboardData?.recentTransactions}
           onSeeMore={()=> navigate('/expense')}
          />

     {/* 🧠 Pass only memoized data to prevent infinite renders */}
          {dashboardData && (
            <FinanceOverview
              totalBalance={memoizedDashboardData.totalBalance}
              totalIncome={memoizedDashboardData.totalIncome}
              totalExpense={memoizedDashboardData.totalExpense}
            />
          )}

          <ExpenseTransactions
  transactions={dashboardData?.last30DaysExpenses?.transactions || []}
  onSeeMore={() => navigate('/expense')}
/>

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />
           
          <RecentIncomeWithChart
             data={dashboardData?.last60DaysIncome?.transactions.slice(0,4) || []}
             totalIncome={dashboardData?.totalIncome}
           />

           <RecentIncome
              transactions={dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate('/income')}
            />

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home