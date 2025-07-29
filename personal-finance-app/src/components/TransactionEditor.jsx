import  { useState,useEffect } from 'react';

export default function TransactionEditor({ isOpen,onClose, onSave, onDelete, initialData }) {
  
   const [formData, setFormData] = useState({
    type: 'expense',
    amount: 0,
    category: '',
    date: '',
    description: ''
    });

    useEffect(() => {
    if (initialData) {
        setFormData({
        type: initialData.type || 'expense',
        amount: initialData.amount || 0,
        category: initialData.category || '',
        date: initialData.date? new Date(initialData.date).toISOString().split('T')[0] : '',
        description: initialData.description || ''
        });
    }
    }, [initialData]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.date || !formData.type) {
      alert('Amount, Date, and Type are required.');
      return;
    }
    onSave({ ...formData, _id: initialData?._id });
  };

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">{initialData?._id ? 'Edit' : 'New'} Transaction</h2>

        <div className="space-y-3">
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full border px-3 py-2 rounded"  required/>

          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full border px-3 py-2 rounded" />

          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border px-3 py-2 rounded" required/>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (optional)" className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {initialData?._id && (
            <button onClick={() => onDelete(initialData?._id)} className="text-red-600 hover:underline">Delete</button>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}