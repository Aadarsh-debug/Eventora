import { useState,useEffect, createContext } from "react";
import api from "../utils/axios"
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider=({children})=>{
  const [user,setUser]=useState(null);
  const [loading,setLoading]= useState(true);

  useEffect(()=>{
    const userInfo=localStorage.getItem('userInfo')
      if(userInfo){
        setUser(JSON.parse(userInfo));
      }
      setLoading(false);
  
},[]);

const login=  async(email,password)=>{
  try {
    const {data}=await api.post('/auth/login',{email,password});
    setUser(data)
    localStorage.setItem('userInfo',JSON.stringify(data));
    localStorage.setItem('token',data.token);
    return data
  } catch (error) {
    if (error.response?.data?.needsVerification) throw error.response.data;
    throw error.response?.data?.message || 'Login failed';
  }
}

const signup=async(name,email,password)=>{
  try {
  const {data}=await api.post('/auth/signup',{name,email,password});
  return data
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
}

const verifyOTP=async(email,otp)=>{
  const {data}=await api.post('/auth/verifyOTP',{email,otp});
  setUser(data);
  localStorage.setItem('userInfo', JSON.stringify(data));
  localStorage.setItem('token', data.token);
  return data;
}
  
const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };


return (
        <AuthContext.Provider value={{ user, login, signup, verifyOTP, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
