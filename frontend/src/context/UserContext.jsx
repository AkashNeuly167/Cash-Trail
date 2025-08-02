import React,{createContext,useState} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState(null)

    //function to update user data
    const updateUser = (userData) => {
        setUser(userData)
    }
    
     //Function to clear user data 
     const clearUser = ()=>{
        setUser(null);
     }
     return(
        <UserContext.Provider value={{user,updateUser,clearUser}}>{children}
        </UserContext.Provider>
     );
};

export default UserProvider
    