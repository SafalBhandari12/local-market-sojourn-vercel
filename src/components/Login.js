import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/mobile", { mobile });
      setMessage(response.data.msg);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data.msg || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/verify", { mobile, otp });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data.msg || "Error verifying OTP");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='max-w-md w-full bg-white p-8 rounded shadow'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Admin Login</h2>
        {message && <div className='mb-4 text-red-600'>{message}</div>}
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className='mb-4'>
              <label htmlFor='mobile' className='block text-gray-700'>
                Mobile Number
              </label>
              <input
                type='text'
                id='mobile'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className='mt-1 p-2 border w-full rounded'
                placeholder='Include country code'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className='mb-4'>
              <label htmlFor='otp' className='block text-gray-700'>
                Enter OTP
              </label>
              <input
                type='text'
                id='otp'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='mt-1 p-2 border w-full rounded'
                placeholder='OTP'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600'
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;