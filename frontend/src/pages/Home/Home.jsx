import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the Home Page
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed">
            Start exploring your dashboard and manage your projects with ease.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-sm font-medium transition-colors shadow-sm">
            Get Started
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © 2024 MyApp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
