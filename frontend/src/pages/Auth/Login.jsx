import React from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState();

  const {updateUser} = React.useContext(UserContext);
  
  const navigate = useNavigate();

  
  const handleLogin = async(e) =>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please enter a password");
      return;
    }
    setError('');
    //Login Api Call
    try{
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN,{email,
      password,
      
    });
    

      const {token,user} = response.data;
      
      if(token ){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
        
      }

    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message || error.response.data.error);
      }else{
        setError("Something went wrong. Please try again.");
      }
    }
  }


  return(
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md: h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-sm text-slate-700 mt-[5px] mb-6'>Please enter your details to log in</p>

       <form onSubmit={handleLogin}>
        <Input value={email}
         onChange={({target})=> setEmail(target.value)}
         label='Email Address'
         placeholder='John@example.com'
         type='email'
         />

         <Input value={password}
         onChange={({target})=> setPassword(target.value)}
         label='Password'
         placeholder='Min 8 characters'
         type='password'
         />

         {error && <p className='text-sm text-red-500 text-xs pb-2.5'>{error}</p>}
          
         <button type='submit' className='w-full text-sm font-medium text-white bg-violet-500 shadow-lg shadow-violet-400 p-[10px] rounded-md my-1 hover:bg-violet-400 hover:text-white hover:shadow-violet-500 ' >Login</button> 

         <p className='text-[13px] text-slate-700 mt-3'>
          Don't have an account?{' '}
          <Link to='/signUp' className='text-blue-600 underline'>Sign Up</Link>
          </p>    

       </form>


       </div>
    </AuthLayout>
  )
}

export default Login