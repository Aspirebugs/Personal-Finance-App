import {useEffect,useState,useRef} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import { ChevronDownIcon, FilterIcon, PlusIcon ,Pencil} from 'lucide-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Pagination from './Pagination';
import TransactionEditor from './TransactionEditor';

function Dashboard() {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [page, setPage] = useState(1);
    const limit = 10;
    const [total, setTotal] = useState(10);
    const [transactions, setTransactions] = useState([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const fileInputRef = useRef();

    
    const fetchTransactions = async (pageNum = 1) => {
      try{
        const res = await axiosPrivate.get('/dashboard', {
        params: { page: pageNum, limit,start : fromDate , end : toDate }
        });
        setTransactions(res.data.data);
        setTotal(res.data.total);
      }catch(err){
        console.error(err);
        navigate('/auth',{state : {from : location},replace : true});
      }
    };

    const openEditor = (entry = {}) => {
      setEditData(entry);
      setIsEditorOpen(true);
    };

    const handleSave = async (data) => {
      if (data._id) {
        await axiosPrivate.put(`/dashboard/${data._id}`, data);
      } else {
        await axiosPrivate.post('/dashboard', data);
      }
      setIsEditorOpen(false);
      fetchTransactions(page); 
    };

    const handleDelete = async (id) => {
      await axiosPrivate.delete(`/dashboard/${id}`);
      setIsEditorOpen(false);
      fetchTransactions(page);
    };

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axiosPrivate.post('/dashboard/upload-receipt', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        //console.log(res);

      } catch (err) {
        console.error(err);
      } finally {
        fetchTransactions(page);
      }
  };

 
  useEffect(() => {
    fetchTransactions(page);
  },[page,fromDate,toDate]);

  const totalPages = Math.ceil(total / limit);

    return (
      <div className="flex-1 flex flex-col">
        {/* Header bar */}
        <header className="h-16 bg-white px-6 flex items-center justify-between shadow">
          <h1 className="text-xl font-semibold capitalize">Dashboard</h1>

          <div className="flex items-center space-x-4">
            {/* Filter Button */}
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              Filter
            </button>

            {/* Create Menu */}
            <div className="relative">
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              {showCreateMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick = {() => openEditor()}>Create Manually</button>
                   <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100"  onClick={() => fileInputRef.current.click()}>
                    Upload receipt
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Date Filter Panel */}
        {showDateFilter && (
          <div className="bg-white p-4 shadow-inner">
            <label className="mr-2" >
              From: <input type="date" value = {fromDate} className="border rounded px-2 py-1"  onChange={e => setFromDate(e.target.value)} />
            </label>
            <label>
              To: <input type="date" value = {toDate} className="border rounded px-2 py-1"  onChange={e => setToDate(e.target.value)} />
            </label>
          </div>
        )}


        {/* Transactions Table */}
        <main className="flex-1 overflow-auto p-6">
          <table className="w-full table-fixed bg-grey-70">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Type</th>
                <th className="px-4 py-2 text-left border-b">Amount</th>
                <th className="px-4 py-2 text-left border-b">Category</th>
                <th className="px-4 py-2 text-left border-b">Date</th>
                <th className="px-4 py-2 text-left border-b">Description</th>
                <th className="px-4 py-2 text-left border-b w-10">Edit</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-left border-b capitalize">{tx.type}</td>
                  <td className="px-4 py-2 text-left border-b">₹{tx.amount}</td>
                  <td className="px-4 py-2 text-left border-b">{tx.category}</td>
                  <td className="px-4 py-2 text-left border-b">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-left border-b">{tx.description}</td>
                   <td className="px-4 py-2 border-b text-left">
                    <button
                      onClick={() => openEditor(tx)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
         
            <TransactionEditor
              isOpen={isEditorOpen}
              onClose={() => setIsEditorOpen(false)}
              onSave={handleSave}
              onDelete={handleDelete}
              initialData={editData}
            />
        <div className="mt-4 flex justify-center">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={newPage => {
            if (newPage >= 1 && newPage <= totalPages) {
              setPage(newPage);
            }
          }}
        />
        </div>
      </div>
    );
}

export default Dashboard;