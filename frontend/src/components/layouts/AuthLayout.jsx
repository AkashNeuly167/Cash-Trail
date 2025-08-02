import React from "react";
import CARD_1 from "../../assets/images/card1.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex ">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 ">
        <h2 className="text-lg font-medium text-black">Cash Trail</h2>
        {children}
      </div>

      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute  top-[30%] right-10" />
        <div className="w-48 h-56 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5" />

       <div className="grid grid-cols-1 z-30 relative">
        <StatsInfoCard
            icon={<LuTrendingUpDown/>}
            label="Track your Income & Expenses"
            value="5000"
            color="bg-primary"
          />
       </div>



        <img
          src={CARD_1}
          className="w-64 lg:w-[70%] absolute bottom-4 shadow-lg shadow-violet-600"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
   <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400 border border-gray-200">

    <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
    {icon}
    </div>

   <div>
     <h6 className="text-gray-500">{label} </h6>
     <span className="text-[20px]">${value}</span>
   </div>
   </div>
  );
};