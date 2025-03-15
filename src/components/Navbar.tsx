import React from 'react';
import { Bot,  User,Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSidebarStore, useUserStore ,useStore} from '../store/useStore';
import axios from "axios";
import { UserButton } from '@clerk/clerk-react';
// import { toast } from "react-toastify";

export function Navbar() {
const toggleSidebar = useSidebarStore((state)=>state.toggleSidebar)
const user = useUserStore((state)=>({
  userId:state.userId,
   username: state.username,
  email: state.email,
  subscriptionType: state.subscriptionType,
  subscriptionEndDate:state.subscriptionEndDate
  

}))
// const LogoutCall = async()=>{
//   try {
//     const response = await axios.get(
//       `${import.meta.env.VITE_BACKEND_URL}logout`,
     
//       { withCredentials: true }
//     );

//     if (response.status === 200) {
//       useUserStore.getState().clearUserData(); // ✅ Clear user data
//     useStore.getState().clearStore(); // ✅ Clear chat history
//   // Redirect user to login page
//   window.location.href = "/login";useUserStore.getState().clearUserData(); 
//     } else {
//       console.error("Logout failed:", response.data);
//     }
//   } catch (error) {
//     console.error("Error during logout:", error);
//   }
// }
const formattedEndDate = user.subscriptionEndDate
? new Date(user.subscriptionEndDate).toLocaleDateString()
: "N/A";
  return (
    <nav className="bg-[#414141] border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl md:mx-auto md:px-4 sm:px-6 lg:px-8">
        <div className="flex md:justify-between justify-evenly h-16">
          {/* Left Section: Sidebar Toggle & Logo */}
          <div className="flex">
            <div className="sm:mr-11 mr-2 sm:p-3 flex items-center cursor-pointer rounded-lg bg-[#414141] hover:bg-[#2a2929]" onClick={toggleSidebar}>
              <Menu />
            </div>
            
            <a href="/" className='flex items-center'><div className="flex-shrink-0 flex items-center">
              <Bot className="h-8 w-8 text-gray-900 sm:block hidden" />
             <span className="md:ml-2 md:text-xl font-bold text-gray-300">Ab Bot</span></div></a>
            
          </div>

          {/* Right Section: User Info */}
          <div className="flex items-center md:space-x-6">
            {/* Subscription Info */}
            <div className="text-gray-400 md:text-sm text-xs">
              <p>
                <span className="font-semibold text-white">Plan:</span> {user.subscriptionType || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-white">Expires:</span> {formattedEndDate}
              </p>
            </div>

            {/* User Info */}
           
            {/* <button className='bg-red-600 p-2  ml-2 rounded-md md:pl-4 md:pr-4 md:ml-4 hover:bg-red-800 md:text-xl text-xs'><Link to="/Register" onClick={LogoutCall}>Logout</Link></button> */}
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}