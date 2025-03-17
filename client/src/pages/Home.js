import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-full h-[400px] bg-cover bg-center" style={{
        backgroundImage: "url('https://source.unsplash.com/random/1600x900/?technology')"
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-6">
          <h1 className="text-4xl font-bold">Welcome to User Management Portal</h1>
          <p className="text-lg mt-2">Manage users efficiently with powerful tools and an intuitive interface.</p>
        </div>
      </div>
      
      <div className="max-w-4xl text-center mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800">Effortless User Management</h2>
        <p className="text-gray-600 mt-4">
          Our user management portal allows you to add, edit, and track users easily.
          With seamless UI and a structured layout, managing users has never been easier!
        </p>
      </div>
    </div>
  );
};

export default Home;
