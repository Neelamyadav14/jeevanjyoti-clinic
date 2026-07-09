import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/all');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products/order', {
        ...orderData,
        product_id: selectedProduct.id,
        quantity,
      });
      setOrderSuccess(true);
      setShowOrderForm(false);
      fetchProducts();
    } catch (err) {
      alert('Order failed. Please try again.');
    }
  };

  const isDeliveryAvailable = quantity >= 10;

  const productImages = (name) => {
    if (name.toLowerCase().includes('soap')) return '/soap.jpeg';
    if (name.toLowerCase().includes('moistur') || name.toLowerCase().includes('gel')) return '/moisturizer.jpeg';
    return '/soap.jpeg';
  };

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-green-500 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-teal-400 opacity-10 animate-pulse" style={{animationDelay:'1s'}}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-teal-600 rounded-lg"></div>
                </div>
                <div>
                  <p className="font-bold text-lg">Jeevan Jyoti</p>
                  <p className="text-green-200 text-xs">Clinic & Wellness</p>
                </div>
              </div>
              <p className="text-green-200 text-sm font-semibold tracking-widest uppercase mb-3">Panchatattva Collection</p>
              <h1 className="text-5xl font-bold leading-tight mb-4 tracking-tight">
                Nature's Best,<br />
                <span className="text-green-200">For Your Skin.</span>
              </h1>
              <p className="text-green-100 text-lg max-w-md leading-relaxed">
                100% herbal, chemical-free skincare products crafted with ancient wisdom and modern science.
              </p>

              <div className="flex gap-6 mt-8">
                {[
                  { label: '100% Natural', sub: 'No chemicals' },
                  { label: 'Doctor Formulated', sub: 'Clinically trusted' },
                  { label: 'Herbal Ingredients', sub: 'Ancient recipes' },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-green-400 pl-4">
                    <p className="font-bold text-sm">{s.label}</p>
                    <p className="text-green-300 text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition backdrop-blur-sm border border-white border-opacity-30"
            >
              Back to Clinic
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Notice */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-8 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <p className="text-amber-800 text-sm">
            <span className="font-semibold">Walk-in purchase available</span> at Jeevan Jyoti Clinic.
            <span className="font-semibold"> Home delivery available for orders of 10+ units only.</span>
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Our Products</h2>
          <p className="text-gray-400 mt-2">Handcrafted with care, backed by nature</p>
        </div>

        {orderSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-2xl mb-8">
            <p className="font-bold text-lg">Order placed successfully!</p>
            <p className="text-sm mt-1">
              For home delivery orders, our team will contact you shortly. For walk-in purchases, please visit Jeevan Jyoti Clinic.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{transitionDelay: `${index * 150}ms`}}
            >
              {/* Product Image */}
              <div className="h-72 relative overflow-hidden">
                <img
                  src={productImages(product.name)}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  100% Natural
                </div>
                <div className="absolute top-4 right-4 bg-white text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  {product.stock} in stock
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
                    <p className="text-xs text-gray-400 mt-0.5">per unit</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowOrderForm(true);
                      setQuantity(1);
                      setOrderSuccess(false);
                    }}
                    className="bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-800 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-100 text-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          {[
            { title: 'Walk-in Purchase', desc: 'Visit Jeevan Jyoti Clinic to purchase directly. No advance order needed.' },
            { title: 'Bulk Home Delivery', desc: 'Order 10 or more units online for home delivery. Our team will contact you to confirm.' },
            { title: 'Doctor Recommended', desc: 'Formulated and recommended by Dr. Mukesh Yadav for healthy, radiant skin.' },
          ].map((info) => (
            <div key={info.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-8 h-1 bg-green-600 rounded-full mb-4"></div>
              <h4 className="font-bold text-gray-800 mb-2">{info.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{info.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderForm && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

            <div className="bg-gradient-to-r from-green-700 to-teal-600 p-6 text-white">
              <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
              <p className="text-green-100 text-sm mt-1">₹{selectedProduct.price} per unit</p>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-green-400 transition"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-green-400 transition"
                  >
                    +
                  </button>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-800">Total: ₹{selectedProduct.price * quantity}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl mb-5 text-sm ${
                isDeliveryAvailable
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}>
                {isDeliveryAvailable ? (
                  <p><span className="font-bold">Home delivery available!</span> Your order qualifies for home delivery.</p>
                ) : (
                  <p><span className="font-bold">Walk-in purchase.</span> Order {10 - quantity} more units to qualify for home delivery.</p>
                )}
              </div>

              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={orderData.customer_name}
                    onChange={(e) => setOrderData({...orderData, customer_name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white transition-all text-sm"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={orderData.customer_phone}
                    onChange={(e) => setOrderData({...orderData, customer_phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white transition-all text-sm"
                    placeholder="10-digit number"
                    required
                  />
                </div>
                {isDeliveryAvailable && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                    <textarea
                      value={orderData.customer_address}
                      onChange={(e) => setOrderData({...orderData, customer_address: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white transition-all text-sm resize-none"
                      placeholder="Full delivery address"
                      required
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition text-sm"
                  >
                    Place Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}