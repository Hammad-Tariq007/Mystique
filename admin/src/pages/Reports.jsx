import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'sonner';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar, FileText, BarChart2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TABS = [
  { value: 'orders', label: 'Orders Report' },
  { value: 'users', label: 'Users Report' }
];

const ORDERS_HEADERS = [
  { label: 'Order ID', key: '_id' },
  { label: 'Customer Name', key: 'customer' },
  { label: 'Payment Status', key: 'paymentStatus' },
  { label: 'Amount', key: 'amount' },
  { label: 'Date', key: 'date' },
  { label: 'Payment Method', key: 'paymentMethod' }
];
const USERS_HEADERS = [
  { label: 'User ID', key: '_id' },
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Join Date', key: 'createdAt' }
];

const Reports = ({ token }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrders(
          res.data.orders.map(o => ({
            ...o,
            customer: o.address ? `${o.address.firstName} ${o.address.lastName}` : '',
            paymentStatus: o.payment ? 'Paid' : 'Pending',
            date: new Date(o.date).toLocaleDateString(),
          }))
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
    setLoading(false);
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        backendUrl + '/api/user/list',
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setUsers(
          res.data.users.map(u => ({
            ...u,
            name: u.name || '',
            createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
          }))
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    else fetchUsers();
    // eslint-disable-next-line
  }, [activeTab]);

  // Filtering logic
  const filteredData = useMemo(() => {
    let data = activeTab === 'orders' ? orders : users;
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(lower)
        )
      );
    }
    if (startDate && endDate) {
      data = data.filter(row => {
        const dateKey = activeTab === 'orders' ? 'date' : 'createdAt';
        const rowDate = new Date(row[dateKey]);
        return rowDate >= startDate && rowDate <= endDate;
      });
    }
    return data;
  }, [orders, users, search, startDate, endDate, activeTab]);

  // Export as PDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const title = activeTab === 'orders' ? 'Orders Report' : 'Users Report';
      doc.text(title, 14, 16);
      const headers = activeTab === 'orders'
        ? ORDERS_HEADERS.map(h => h.label)
        : USERS_HEADERS.map(h => h.label);
      const data = filteredData.map(row =>
        (activeTab === 'orders'
          ? [row._id, row.customer, row.paymentStatus, row.amount, row.date, row.paymentMethod]
          : [row._id, row.name, row.email, row.createdAt]
        ).map(val => (val === undefined || val === null) ? '' : String(val))
      );
      console.log('PDF Export Headers:', headers);
      console.log('PDF Export Data:', data);

      autoTable(doc, { head: [headers], body: data, startY: 22 });
      doc.save(`${title.replace(/ /g, '_')}.pdf`);
      toast.success('PDF downloaded!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      toast.error('Failed to export PDF');
    }
  };

  // Table headers and data
  const headers = activeTab === 'orders' ? ORDERS_HEADERS : USERS_HEADERS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2 tracking-tight">Reports & Analytics</h1>
        <div className="text-base text-gray-500 font-light font-sans">Track essential data, monitor trends, and export insights anytime.</div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 rounded-full font-semibold transition-all text-sm shadow-sm border
              ${activeTab === tab.value
                ? 'bg-gray-900 text-white border-gray-900 scale-105'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            {tab.value === 'orders' ? <BarChart2 className="inline w-4 h-4 mr-2 -mt-1" /> : <Calendar className="inline w-4 h-4 mr-2 -mt-1" />} {tab.label}
          </button>
        ))}
      </div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-gray-300 font-sans text-sm placeholder:text-gray-400"
            placeholder={activeTab === 'orders' ? 'Search by customer or ID…' : 'Search by name, email or ID…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="relative">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={update => setDateRange(update)}
              isClearable
              placeholderText="Date range"
              className="px-4 py-2 rounded-md border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-gray-300 font-sans text-sm w-40"
              calendarClassName="!z-50"
            />
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <CSVLink
            data={filteredData}
            headers={headers}
            filename={`${activeTab}_report.csv`}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow transition-all hover:scale-105 hover:bg-gray-800 flex items-center gap-2"
            onClick={() => toast.success('CSV downloaded!')}
          >
            <FileText className="w-4 h-4" /> Export CSV
          </CSVLink>
          <button
            onClick={handleExportPDF}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow transition-all hover:scale-105 hover:bg-gray-800 flex items-center gap-2"
          >
            <span role="img" aria-label="pdf">📄</span> Export PDF
          </button>
        </div>
      </div>
      {/* Table Section */}
      <div className="overflow-x-auto rounded-2xl shadow border border-gray-100 bg-white animate-fade-up">
        {loading ? (
          <div className="flex flex-col gap-2 p-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 rounded w-full animate-pulse mb-2" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 font-sans">
            <BarChart2 className="w-10 h-10 mb-2" />
            <div className="text-lg">No data found for this report.</div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50/60">
              <tr>
                {headers.map(h => (
                  <th key={h.key} className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider">
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className={
                    idx % 2 === 0
                      ? 'bg-white hover:bg-gray-50 transition'
                      : 'bg-gray-50/30 hover:bg-gray-50 transition'
                  }
                >
                  {headers.map(h => (
                    <td key={h.key} className="px-6 py-4 whitespace-nowrap">
                      {row[h.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports; 