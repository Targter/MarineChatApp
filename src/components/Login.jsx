// import React, { useState } from "react";
// import axios from "axios";
// import { Navigate, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useUserStore } from "../store/useStore";
// // import { useUserStore } from "../store/useStore";
// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const { subscriptionEndDate } = useUserStore();
//   const setUserData = useUserStore((state) => state.setUserData);
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       // alert("Please enter both email and password.");
//       toast.error("Please enter both email and passord", {
//         autoClose: 1000,
//         hideProgressBar: false,
//       });

//       return;
//     }

//     try {
//       // Send POST request to the backend
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}Login`,
//         {
//           email: email,
//           password: password,
//         },
//         {
//           withCredentials: true, // Include cookies
//         }
//       );
//       console.log("loginResponse:", response);
//       if (response.status === 200) {
//         // Redirect to home or dashboard after successful login
//         // alert("Login Successful!");

//         const userData = response.data.user;
//         console.log(userData);
//         toast.success("login Successful", {
//           autoClose: 2000,
//           hideProgressBar: false,
//           // closeOnClick: true,
//           // pauseOnHover: true,
//           // draggable: true,
//         });
//         // const { AccessToken } = response.data;
//         // localStorage.setItem("AccessToken", AccessToken);
//         setUserData({
//           userId: userData._id,
//           username: userData.username,
//           email: userData.email,
//           subscriptionType: userData.subscriptionType,
//           subscriptionEndDate: userData.subscriptionEndDate
//             ? new Date(userData.subscriptionEndDate)
//             : null,
//         });
//         navigate("/"); // Redirect to home or dashboard
//       } else {
//         toast.error("Login failed. Please check your credentials. ", {
//           autoClose: 1000,
//           hideProgressBar: false,
//         });
//         // alert("Login failed. Please check your credentials.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       // alert("An error occurred. Please try again.");
//       toast("Invalid username or password", {
//         autoClose: 1000,
//         hideProgressBar: false,
//       });
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-600">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
//         <form onSubmit={handleLoginSubmit}>
//           {/* Email Field */}
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               autoComplete="current-password"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               autoComplete="current-password"
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
//           >
//             Login
//           </button>
//         </form>

//         {/* Forgot Password & Register Links */}
//         <div className="flex justify-between mt-4">
//           <Link
//             to="/ForgetPassword"
//             className="text-sm text-blue-500 hover:underline"
//           >
//             Forgot Password?
//           </Link>
//           <Link
//             to="/Register"
//             className="text-sm text-blue-500 hover:underline"
//           >
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { SignIn } from "@clerk/clerk-react";
import React from "react";
export default function Login() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SignIn
        path="/login"
        afterSignInUrl="/" // ✅ Redirect to the correct page
        afterSignUpUrl="/"
        signUpUrl="/register"
      />
    </div>
  );
}
