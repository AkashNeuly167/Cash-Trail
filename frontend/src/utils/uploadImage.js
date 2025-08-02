import { API_PATH } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async(imageFile)=>{
   const formData = new FormData();
   //append image file to form data
   formData.append("image",imageFile);

   try{
    const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD_IMAGE,formData,{headers:{
        "Content-Type":"multipart/form-data",//set header for file upload 
    },
  });
  return response.data;
   }catch(error){
    console.error("Image upload error:",error);
    throw error;// rethrow the error for handling
    }
};
 
export default uploadImage;
