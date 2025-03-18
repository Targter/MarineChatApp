import { Crown } from 'lucide-react';
import { useUserStore } from '../store/useStore';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import CardActionArea from '@mui/material/CardActionArea';

export function PremiumBanner() {
  const navigate = useNavigate();
  const { userId, subscriptionType } = useUserStore((state) => ({ 
    userId: state.userId, 
    subscriptionType: state.subscriptionType 
 }));
 
  if (subscriptionType === 'Premium') return null;
console.log("userId:",userId,subscriptionType)
  const handleUpgrade = async (e,plan) => {
    e.preventDefault();
    try {
      console.log(e,plan)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}sub/renewsubscription`,
        { userId: userId, subscriptionType: plan },
        { withCredentials: true }
      );

      toast.success(`Subscription updated to ${plan}`,{autoClose: 2000})
      navigate("/")
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        toast.error(error.response.data.message,{  autoClose: 1000,
          hideProgressBar: false,})
        
        console.log("error:",error.response.data.message)
        navigate("/"); // ✅ Redirect to home
      } else {
        toast.error(error.response.data.message,{          
            autoClose: 1000,
          })
        console.log("error:",error.response.data.message)
        // toast.error("Subscription update failed. Please try again."); // ✅ General error message
        navigate("/"); // ✅ Redirect to home
      }
      // alert('Subscription update failed');
    }
  };

  const plans = [
    {
      id: 1,
      title: 'Free Trial',
      description: '7 days free. No credit card required.',
      price: 'Free',
      planType: '7-day-premium',
    },
    {
      id: 2,
      title: 'Premium',
      description: 'Unlock all features with a monthly subscription.',
      price: '$9.99/month',
      planType: 'premium',
    },
   
  ];

  return (
     <> <div className="relative">
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-200">
      <h3 className='fixed top-5 right-10 bg-gray-400 p-3 rounded-md hover:bg-gray-800 hover:text-white'><Link to="/"> Back</Link> </h3>
        <h3 className="text-xl font-semibold mb-4">Choose a Plan</h3>
        <div className="flex justify-between h-auto w-[750px]  gap-7">
          {plans.map((plan) => (
            <CardComponent key={plan.id} plan={plan} handleUpgrade={handleUpgrade} />
          ))}
        </div>
      </div>
    </div></>
  );
}

const CardComponent = ({ plan, handleUpgrade }) => {
  return (
    <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 2 }}>
      <Card>
        <CardActionArea
          onClick={(e) => handleUpgrade(e,plan.planType)}
          sx={{
            height: '100%',
            '&:hover': {
              backgroundColor: 'action.selectedHover',
            },
          }}
        >
          <CardContent sx={{ height: '100%' }} className='flex flex-col justify-evenly hover:bg-gray-00'>
            <Typography variant="h5" component="div">
              {plan.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {plan.description}
            </Typography>
            <Typography variant="h6" color="primary">
              {plan.price}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};
