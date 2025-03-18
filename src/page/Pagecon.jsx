import React, { memo, useEffect, useState } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useSidebarStore, useUserStore } from "../store/useStore";
import UpgradeToPremium from "../components/UpgradeToPremium";
import axios from "axios";
import { SignedIn, useAuth, useUser } from "@clerk/clerk-react"; // Update imports
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MemoizedNavbar = memo(Navbar);
const MemoizedSidebar = memo(Sidebar);
const MemoizedChatWindow = memo(ChatWindow);

const Pagecon = () => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebarStore();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const setUserData = useUserStore((state) => state.setUserData);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      console.log("called");
      const token = await getToken();
      console.log(token);
      console.log(isSignedIn);
      // if (!token) {
      //   console.error("No authentication token found.");
      //   toast.error("Authentication failed. Please log in again.");
      //   navigate("/login");
      //   return;
      // }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userAuth`,
        {}, // ✅ Empty object for post data
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log("response:", response);
      console.log("userId:",user.id, " ab",user._id);
      if (response.data.authenticated) {
        setUserData({
          userId: user.id,
          username: `${user.firstName} ${user.lastName}`,
          email: user.primaryEmailAddress.emailAddress,
          subscriptionType: response.data.user.subscriptionType,
          subscriptionEndDate: response.data.user.subscriptionEndDate
            ? new Date(response.data.user.subscriptionEndDate)
            : null,
        });
      } else {
        // Handle failed backend authentication
        console.error("Backend authentication failed");
      }
    } catch (error) {
      toast.error("Logged in After sometimes ");
      console.error("Error fetching user data:", error);
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isSignedIn) return; // Prevent unnecessary navigation
    fetchUserData();
  }, [isSignedIn]); // Removed navigate

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#212121] text-white flex md:justify-center justify-end overflow-hidden">
      <MemoizedNavbar />
      <div className="pt-16 flex w-full overflow-x-hidden">
        {isSidebarOpen && <MemoizedSidebar className="w-2/4 min-w-[500px]" />}
        <MemoizedChatWindow />
      </div>
      <UpgradeToPremium />
    </div>
  );
};

export default Pagecon;
