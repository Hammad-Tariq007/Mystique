import React, { useContext } from 'react'
import { ShopContext } from '@/context/ShopContext'
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ShoppingBag, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext)

  // Fetch orders using React Query
  const { data: orderData = [], isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['userOrders', token],
    queryFn: async () => {
      if (!token) return []
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } })
      if (response.data.success) {
        const orders = response.data.orders.flatMap(order =>
          order.items.map(item => ({
            ...item,
            orderNumber: order._id?.slice(-6)?.toUpperCase() || '',
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            amount: order.amount
          }))
        ).reverse()
        return orders
      } else {
        toast.error(response.data.message)
        return []
      }
    },
    enabled: !!token, // Fetch only if token exists
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  })

  // Export as PDF
  const handleExportInvoicePDF = (item) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Invoice for Order #${item.orderNumber || 'ORDER'}`,
        subject: `Invoice for Mystique Order`,
        author: 'Mystique',
      });

      // Header
      doc.setFontSize(22);
      doc.setFont('serif', 'bold');
      doc.setTextColor('#1a202c'); // Dark gray/black for text
      doc.text('Mystique', 14, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#4a5568'); // Medium gray
      doc.text('A history of your Mystique purchases', 14, 26);

      doc.setDrawColor('#e2e8f0'); // Light gray line
      doc.line(14, 30, 196, 30); // Line under header

      // Invoice Title
      doc.setFontSize(18);
      doc.setFont('serif', 'semibold');
      doc.setTextColor('#1a202c');
      doc.text(`Invoice #${item.orderNumber || 'ORDER'}`, 14, 45);

      // Order Details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#4a5568');
      doc.text(`Order Date: ${new Date(item.date).toLocaleDateString()}`, 14, 52);
      doc.text(`Payment Status: ${item.payment ? 'Paid' : 'Pending'}`, 14, 58);
      doc.text(`Payment Method: ${item.paymentMethod || 'N/A'}`, 14, 64);

      const headers = [
        ['Product Name', 'Size', 'Quantity', 'Unit Price', 'Total']
      ];
      const data = [
        [item.name, item.size, item.quantity, `${currency}${item.price.toFixed(2)}`, `${currency}${(item.price * item.quantity).toFixed(2)}`]
      ];

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 75,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 4,
          textColor: [45, 55, 72], // Darker gray
          lineColor: [226, 232, 240], // Light gray for borders
          lineWidth: 0.5,
        },
        headStyles: {
          fillColor: [254, 252, 232], // Light gold background for header
          textColor: [113, 89, 2], // Dark gold text
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'left' },
          3: { halign: 'right' },
          4: { halign: 'right' },
        },
        alternateRowStyles: {
          fillColor: [247, 250, 252], // Slightly off-white for alternate rows
        },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor('#718096'); // Lighter gray
          doc.text('Thank you for your purchase from Mystique!', data.settings.margin.left, doc.internal.pageSize.height - 10);
          doc.text(`Page ${doc.internal.getNumberOfPages()}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
        }
      });

      // Total Amount
      let finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.setFont('serif', 'bold');
      doc.setTextColor('#b78c2e'); // Gold color
      doc.text(`Total Amount: ${currency}${item.amount ? item.amount.toFixed(2) : (item.price * item.quantity).toFixed(2)}`, doc.internal.pageSize.width - 14, finalY, { align: 'right' });

      doc.save(`invoice_${item.orderNumber || 'ORDER'}.pdf`);
      toast.success('Invoice downloaded!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      toast.error('Failed to export invoice');
    }
  };

  // Empty State
  if (isLoading) {
    return <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
      <div className="w-8 h-8 border-4 border-t-gold border-gray-200 rounded-full animate-spin"></div>
      <p className="text-center text-gray-600 text-lg">Loading your orders...</p>
    </div>
  }
  if (isError) {
    return <p className="text-center text-red-500 py-24">Failed to load orders. Please try again.</p>
  }

  return (
    <div className="w-full px-6 sm:px-12 lg:px-32 py-24 space-y-10 min-h-screen bg-offwhite dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-semibold tracking-tight mb-2">Your Orders</h1>
        <p className="text-gray-500 mb-10 text-lg">A history of your Mystique purchases</p>
        {/* Empty State */}
        {orderData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
            <ShoppingBag className="w-16 h-16 text-gold mb-6" />
            <p className="text-2xl font-serif font-semibold mb-2 text-gray-700">You haven't placed any orders yet.</p>
            <p className="text-gray-500 mb-6">When you do, your order archive will appear here.</p>
            <Link to="/collection" className="px-8 py-3 bg-black text-white rounded-full uppercase tracking-wider font-medium hover:bg-gold hover:text-black transition-all duration-300 text-sm shadow-md">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {orderData.map((item, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 space-y-4 animate-fade-up hover:shadow-lg hover:scale-[1.01] transition-all duration-300 delay-${index * 75}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-mono">#{item.orderNumber || 'ORDER'}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">{new Date(item.date).toLocaleDateString()}</span>
                  <span className="text-lg font-semibold text-gold">{currency}{item.amount || item.price}</span>
                </div>
                {/* Product Preview */}
                <div className="flex items-center gap-4 mt-4">
                  {item.image && Array.isArray(item.image) ? (
                    item.image.slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Product preview"
                        className="w-16 h-16 object-cover rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm"
                      />
                    ))
                  ) : (
                    <img src={item.image} alt="Product preview" className="w-16 h-16 object-cover rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm" />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div>
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                    <div className="text-xs text-gray-500 font-sans mt-1">Size: {item.size} &nbsp;|&nbsp; Qty: {item.quantity}</div>
                  </div>
                  {/* Optionally add more product details here */}
                </div>
                {/* Actions Row */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => handleExportInvoicePDF(item)}
                    className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-gold hover:text-black transition-all duration-200"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Invoice
                  </button>
                  {/* Optionally add reorder or view details here */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
