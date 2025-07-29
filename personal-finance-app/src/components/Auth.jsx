import  { useState } from 'react';
import Login from './login';
import Register from './Register';

export default function Auth() {
  
  const [isLogin, setIsLogin] = useState(false);

  return (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-xl p-8 w-80">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 ${isLogin ? 'border-b-2 border-indigo-400' : ''} focus:outline-none`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 ${!isLogin ? 'border-b-2 border-indigo-400' : ''} focus:outline-none`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? <Login/>:<Register/>}
        
      </div>
    </div>
  );
}
