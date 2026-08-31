import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTopLink from '../components/ScrollToTopLink';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { user, isLoggedIn, loading } = useAuth();

  console.log('isLoggedIn:', isLoggedIn);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
      <h1 className="text-5xl text-white mb-4">Welcome to Beta Thread</h1>
      <p className="text-4xl text-white mb-8">...coding the future...</p>
      <h2 className="text-2xl text-white mb-4">Select your destination</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <ScrollToTopLink to="/">
          <button className="bg-green-700 text-white w-full max-w-md h-16 text-2xl font-bold rounded-lg cursor-pointer border-none">Home</button>
        </ScrollToTopLink>
        {isLoggedIn && (
          <ScrollToTopLink to="/dashboard">
            <button className="bg-green-700 text-white w-full max-w-md h-16 text-2xl font-bold rounded-lg cursor-pointer border-none">Dashboard</button>
          </ScrollToTopLink>
        )}
        {!isLoggedIn && (
          <>
            <ScrollToTopLink to="/signup">
              <button className="bg-green-700 text-white w-full max-w-md h-16 text-2xl font-bold rounded-lg cursor-pointer border-none">Signup</button>
            </ScrollToTopLink>
            <ScrollToTopLink to="/login">
              <button className="bg-green-700 text-white w-full max-w-md h-16 text-2xl font-bold rounded-lg cursor-pointer border-none">Login</button>
            </ScrollToTopLink>
          </>
        )}
      </div>
      <p className="text-lg text-white mt-4 text-center">Note: Select login if you have been prevented from accessing the dashboard</p>
    </div>
  );
};

export default Welcome;