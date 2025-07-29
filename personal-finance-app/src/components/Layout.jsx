import {useState} from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import Dashboard from './Dashboard';
import Insights from './Insights';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

export default function Layout(){
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location  = useLocation();
    const [activeTab, setActiveTab] = useState('Dashboard'); 
    return(
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b">Finance Assistant</div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {['Dashboard', 'Insights'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between ${activeTab === tab ? 'bg-blue-100 font-medium' : ''}`}
            >
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button className = "w-full bg-red-600 text-white rounded-md py-2 hover:bg-red-700 transition-colors" onClick = {() => {
            axiosPrivate.post('/logout');
            navigate('/auth',{replace : true});
          }}>Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
          {activeTab === 'Dashboard' ? (
            <Dashboard id = 'dashboard'/> ) : (
            <Insights  id = 'insights'/>
          )}
    </main>
      </div>  
    )
};