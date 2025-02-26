import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function RegisterUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null); // Store OTP sent time
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  // OTP expiry time in seconds (2 minutes)
  const OTP_EXPIRY_TIME = 120;

  // Handle OTP timer
  useEffect(() => {
    if (otpSentTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - otpSentTime) / 1000); // Time in seconds
        const timeLeft = Math.max(0, OTP_EXPIRY_TIME - elapsed); // 2 minutes
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          clearInterval(interval); // Stop the interval when time is up
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [otpSentTime]);

  // Handle OTP request or verification
  const handleOtpRequestOrVerify = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      // Request OTP
      if (name && email && password) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}Register`,
            { email }
          );
          if (response.status === 200) {
            setOtpSent(true);
            setOtpSentTime(Date.now());
            toast.success("OTP sent to your email.", { autoClose: 1000 });
          } else {
            toast.error("Failed to send OTP. Please try again.", {
              autoClose: 1000,
            });
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error(
            error.response?.data?.message ||
              "An error occurred. Please try again.",
            {
              autoClose: 1000,
            }
          );
        }
      } else {
        toast.error("Please fill in all fields.", { autoClose: 1000 });
      }
    } else {
      // Verify OTP
      if (otp.length === 6) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}verifyOtp`,
            { email, otp, username: name, password }
          );
          if (response.status === 200) {
            setOtpVerified(true);
            toast.success("OTP verified. Registration successful.", {
              autoClose: 1000,
            });
            navigate("/Login"); // Redirect to login page after successful registration
          } else {
            toast.error("Invalid OTP. Please try again.", { autoClose: 1000 });
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error(
            error.response?.data?.message || "Invalid OTP. Please try again.",
            {
              autoClose: 1000,
            }
          );
        }
      } else {
        toast.error("Please enter a valid 6-digit OTP.", { autoClose: 1000 });
      }
    }
  };

  // Handle OTP resend
  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (remainingTime === 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}Register`,
          { email }
        );
        if (response.status === 200) {
          setOtpSent(true);
          setOtpSentTime(Date.now());
          setOtp("");
          setRemainingTime(OTP_EXPIRY_TIME); // Reset the timer
          toast.success("OTP resent to your email.", { autoClose: 1000 });
        } else {
          toast.error("Failed to resend OTP. Please try again.", {
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message || "An error occurred. Please try again.",
          {
            autoClose: 1000,
          }
        );
      }
    } else {
      toast.info(`You can resend the OTP in ${remainingTime} seconds.`, {
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={handleOtpRequestOrVerify}>
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {otpSent && (
            <div className="mb-4 mt-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
