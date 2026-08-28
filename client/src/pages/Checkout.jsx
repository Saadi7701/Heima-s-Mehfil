import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../lib/api';
import { Loader2, Trash2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    instructions: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
        customerDetails: formData,
        paymentMethod
      };
      
      const result = await placeOrder(orderData);
      setOrderId(result.orderId);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-mehfil-black flex items-center justify-center pt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 max-w-xl text-center"
        >
          <h2 className="text-4xl font-cinzel text-mehfil-gold mb-4">Your Mehfil has been reserved.</h2>
          <p className="text-mehfil-ivory/80 font-serif mb-8">
            Order confirmed. Your order ID is <span className="text-mehfil-gold font-bold">#{orderId?.split('-')[0].toUpperCase()}</span>.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary w-full">Return Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mehfil-black pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-cinzel text-mehfil-gold mb-6"
          >
            Complete Your Order
          </motion.h1>
          <div className="w-24 h-px bg-mehfil-gold/50 mx-auto relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-mehfil-gold"></div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center text-mehfil-ivory/60 font-serif py-12">
            <p className="mb-6">Your cart is empty.</p>
            <button onClick={() => navigate('/menu')} className="btn-outline">Explore Menu</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Customer Information Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 glass-panel p-8 h-fit"
            >
              <h2 className="text-2xl font-cinzel text-mehfil-gold mb-6 border-b border-mehfil-gold/20 pb-4">Delivery Details</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-mehfil-ivory/70 text-sm font-serif mb-2">Full Name</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-mehfil-black/50 border border-mehfil-gold/30 rounded p-3 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-mehfil-ivory/70 text-sm font-serif mb-2">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-mehfil-black/50 border border-mehfil-gold/30 rounded p-3 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-mehfil-ivory/70 text-sm font-serif mb-2">Email (Optional)</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-mehfil-black/50 border border-mehfil-gold/30 rounded p-3 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors" />
                </div>

                <div>
                  <label className="block text-mehfil-ivory/70 text-sm font-serif mb-2">Delivery Address</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="3" className="w-full bg-mehfil-black/50 border border-mehfil-gold/30 rounded p-3 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors"></textarea>
                </div>

                <div>
                  <label className="block text-mehfil-ivory/70 text-sm font-serif mb-2">Additional Instructions</label>
                  <textarea name="instructions" value={formData.instructions} onChange={handleInputChange} rows="2" placeholder="e.g. Less spicy, Extra cutlery" className="w-full bg-mehfil-black/50 border border-mehfil-gold/30 rounded p-3 text-mehfil-ivory focus:outline-none focus:border-mehfil-gold transition-colors"></textarea>
                </div>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:w-1/3"
            >
              <div className="glass-panel p-8 sticky top-32">
                <h2 className="text-2xl font-cinzel text-mehfil-gold mb-6 border-b border-mehfil-gold/20 pb-4">Your Order</h2>
                
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollbar-hide">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-mehfil-ivory font-serif pb-4 border-b border-mehfil-gold/10">
                      <div className="flex items-center space-x-4 flex-1">
                        <select 
                          value={item.quantity} 
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="bg-transparent text-mehfil-gold border border-mehfil-gold/30 rounded p-1"
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} className="bg-mehfil-black">{n}</option>)}
                        </select>
                        <span className="truncate pr-2">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>Rs {item.price * item.quantity}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-8 text-mehfil-ivory/80 font-serif">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs {cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>Rs 250</span>
                  </div>
                  <div className="flex justify-between text-lg text-mehfil-gold mt-4 pt-4 border-t border-mehfil-gold/30 font-semibold">
                    <span>Total</span>
                    <span>Rs {cartTotal + 250}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <h3 className="text-xl font-cinzel text-mehfil-gold mb-4">Payment Method</h3>
                <div className="space-y-3 mb-8">
                  <label className={`flex items-center space-x-3 p-4 rounded border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-mehfil-gold bg-mehfil-gold/10' : 'border-mehfil-gold/30 hover:border-mehfil-gold/60'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-mehfil-gold w-4 h-4"
                    />
                    <span className="font-serif text-mehfil-ivory">Cash on Delivery</span>
                  </label>
                  <label className={`flex items-center space-x-3 p-4 rounded border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-mehfil-gold bg-mehfil-gold/10' : 'border-mehfil-gold/30 hover:border-mehfil-gold/60'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="accent-mehfil-gold w-4 h-4"
                    />
                    <span className="font-serif text-mehfil-ivory">Credit/Debit Card</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-lg flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Confirm Order'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
