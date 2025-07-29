import { useMemo, useState ,useEffect} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend
} from 'recharts';

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff8042','#8dd1e1','#a4de6c'];

export default function Insights() {

    const axiosPrivate = useAxiosPrivate();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const res = await axiosPrivate.get('/dashboard', {
            params: { limit : 100}
            });
        setTransactions(res.data.data);
        };
        fetchTransactions();
    },[]);


  // 0) State for toggle
  const [viewType, setViewType] = useState('expense'); // 'expense' | 'income' | 'all'

  // 1) Filter by type (or use all)
  const filteredTx = useMemo(() => {
    if (viewType === 'all') return transactions;
    return transactions.filter(t => t.type === viewType);
  }, [transactions, viewType]);

  // 2) Only take expenses when calculating “over time”/“by category”? 
  //    Or use filteredTx directly.
  const dataByCategory = useMemo(() => {
    const map = {};
    filteredTx.forEach(({ category, amount }) => {
      map[category] = (map[category] || 0) + amount;
    });
    return Object.entries(map).map(([category, total]) => ({ category, total }));
  }, [filteredTx]);

  const dataByDate = useMemo(() => {
    const map = {};
    filteredTx.forEach(({ date, amount }) => {
      const day = new Date(date).toISOString().split('T')[0];
      map[day] = (map[day] || 0) + amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total }));
  }, [filteredTx]);

  // 3) Date range filtering (optional)
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd]   = useState('');
  const dataByDateRanged = useMemo(() => {
    if (!rangeStart && !rangeEnd) return dataByDate;
    return dataByDate.filter(({ date }) => {
      if (rangeStart && date < rangeStart) return false;
      if (rangeEnd   && date > rangeEnd)   return false;
      return true;
    });
  }, [dataByDate, rangeStart, rangeEnd]);

  return (
    <div className="space-y-8">

      {/* --- View Type Selector --- */}
      <div className="flex items-center space-x-4">
        <label className="font-medium">Show:</label>
        <select
          value={viewType}
          onChange={e => setViewType(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
          <option value="all">All Transactions</option>
        </select>
      </div>

      {/* --- Date Range Controls --- */}
      <div className="flex items-center space-x-4">
        <label>
          From{' '}
          <input
            type="date"
            value={rangeStart}
            onChange={e => setRangeStart(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label>
          To{' '}
          <input
            type="date"
            value={rangeEnd}
            onChange={e => setRangeEnd(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
      </div>

      {/* --- Pie Chart --- */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {viewType === 'all'
            ? 'Transactions by Category'
            : `${viewType.charAt(0).toUpperCase() + viewType.slice(1)} by Category`}
        </h2>
        <PieChart width={400} height={300}>
          <Pie
            data={dataByCategory}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {dataByCategory.map((entry, idx) => (
              <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <PieTooltip formatter={v => `₹${v.toFixed(2)}`} />
          <PieLegend />
        </PieChart>
      </div>

      {/* --- Line Chart --- */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {viewType === 'all'
            ? 'Transactions Over Time'
            : `${viewType.charAt(0).toUpperCase() + viewType.slice(1)} Over Time`}
        </h2>
        <LineChart
          width={600}
          height={300}
          data={dataByDateRanged}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <LineTooltip formatter={v => `₹${v.toFixed(2)}`} />
          <LineLegend />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
}
