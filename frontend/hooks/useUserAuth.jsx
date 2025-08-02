import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../src/context/userContext";
import axiosInstance from "../src/utils/axiosInstance";
import { API_PATH } from "../src/utils/apiPath";

export const useUserAuth = () => {
    const {user ,updateUser,clearUser} = useContext(UserContext);
    const navigate = useNavigate();
    
    useEffect(() => {
     

      let isMounted = true;

      const fetchUserInfo = async ()=>{
        try{
            const response = await axiosInstance.get(API_PATH.AUTH.GET_USER_INFO);

            if(isMounted && response.data){
                updateUser(response.data);
            }
        }catch (error) {
            console.error("Error fetching user info:", error);
            if(isMounted){
                clearUser();
                navigate("/login");
            }
        }
      };
      
      if(!user){
         fetchUserInfo();
      }
      
      
      return () => {
        isMounted = false;
      };
      
      }, [user,navigate,updateUser,clearUser]);
}