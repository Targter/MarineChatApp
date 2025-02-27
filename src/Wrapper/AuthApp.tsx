import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../store/useStore';
const withAuthCheck = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
     const setUserData = useUserStore((state) => state.setUserData);
     const [isLoading, setIsLoading] = useState(true);
    const {subscriptionEndDate} = useUserStore()
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}userAuth`, { withCredentials: true });
          // console.log("authresposne",response)
          if (!response.data.authenticated) {
            navigate('/Login');
          } else {
            setIsAuthenticated(true);
            const userData = response.data.user;
            // console.log("userData:",userData)
            // console.log(userData.subscriptionEndDate)
            setUserData({
              userId: userData._id,
              username: userData.username,
              email: userData.email,
              subscriptionType: userData.subscriptionType,
              subscriptionEndDate: userData.subscriptionEndDate ? new Date(userData.subscriptionEndDate) : null,

            });
          }
        } catch (error) {
          setIsAuthenticated(false);
          navigate('/Login');
        }
        finally {
          setIsLoading(false);
        }
      };

      checkAuth();
      const retryTimeout = setTimeout(checkAuth, 1000);
      return () => clearTimeout(retryTimeout);
    }, [navigate, setUserData]);

    if (isLoading || isAuthenticated === null) {
      return <div>Loading...</div>; // Show a loading spinner
    }

    if (!isAuthenticated) {
      return null; // Redirect will happen in the useEffect
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthCheck;
