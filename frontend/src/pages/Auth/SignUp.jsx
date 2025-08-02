import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import  ProfilePhotoSelector  from '../../components/Inputs/profilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import uploadImage from '../../utils/uploadImage';
import { UserContext } from '../../context/UserContext';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();
 
  //to handle form submission
  const handleSignUp = async (e) => {
     e.preventDefault();

     let profileImageUrl = '';

     if(!fullName){
       setError('Please enter your full name');
       return;
     }
     if(!validateEmail(email)){
       setError('Please enter a valid email address');
       return;
     }
    if(!password){
       setError('Please enter a password');
       return;
     }
     setError('');

     //signup api call
     try{
           
     //upload image if present
     if(profilePic){
       const imgUploadRes = await uploadImage(profilePic);
       profileImageUrl = imgUploadRes.data.url;
     }

      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER,{fullName,
        email,
        password,
        profileImageUrl
     });
     const {token,user} = response.data;
     if(token ){
       localStorage.setItem("token",token);
       updateUser(user);
       navigate("/dashboard");
     }
     }catch(error){
       if(error.response && error.response.data.message){
         setError(error.response.data.message);
       }else{
         setError("Something went wrong. Please try again.");
       }
     }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>
          Create an account
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'> Join us today and start tracking your income and expenses</p>
         <form onSubmit={handleSignUp}>

         <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} /> 



         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
          <Input
           value={fullName}
           onChange={(e) => setFullName(e.target.value)}
           label='Full Name'
           placeholder='John Doe'
           type='text'
           />
           </div>

            <div> 
            <Input value={email}
         onChange={({target})=> setEmail(target.value)}
         label='Email Address'
         placeholder='John@example.com'
         type='email'
         />
         </div>
         
         <div className='col-span-2'>
         <Input value={password}
         onChange={({target})=> setPassword(target.value)}
         label='Password'
         placeholder='Min 8 characters'
         type='password'
         />
         </div>
           </div>
           {error && <p className='text-sm text-red-500 text-xs pb-2.5'>{error}</p>}
                     
                    <button type='submit' className='w-full text-sm font-medium text-white bg-violet-500 shadow-lg shadow-violet-400 p-[10px] rounded-md my-1 hover:bg-violet-400 hover:text-white hover:shadow-violet-500 ' >Sign Up</button> 
           
                    <p className='text-[13px] text-slate-700 mt-3'>
                     Already have an account{' '}
                     <Link to='/login' className='text-blue-600 underline'>Login</Link>
                     </p>  
         </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp