import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import PaystackPayment from './PaystackPayment';

const Checkout = ({ cart, setCart }) => {
  const [userInfo, setUserInfo] = useState({ name: '', address: '', phone: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserInfo(prev => ({ ...prev, email: currentUser.email }));
    }
  }, []);

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const handleInputChange = (e) => {
    setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSuccess = async (response) => {
    const { name, address, phone, email } = userInfo;

    if (!name || !address || !phone || !email) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser?.uid,
        email,
        name,
        address,
        phone,
        items: cart,
        total,
        createdAt: new Date(),
        status: "pending",
        paymentReference: response.reference
      });

      alert("Order placed successfully!");
      navigate("/order-success");
      setCart([]);
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Error processing order.");
    }
  };
  const handleCancel = () => {
    alert("Payment cancelled");
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-center text-red-600 mb-6'>Checkout</h2>

      <div className='space-y-4 mb-6'>
        <input
          type="text"
          name="name"
          placeholder='Your Name'
          className='w-full p-3 border rounded'
          value={userInfo.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder='Your Email'
          className='w-full p-3 border rounded bg-gray-100'
          value={userInfo.email}
          readOnly
        />
        <textarea
          name="address"
          placeholder='Delivery Address'
          className='w-full p-3 border rounded'
          value={userInfo.address}
          rows={3}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder='Your Phone Number'
          className='w-full p-3 border rounded'
          value={userInfo.phone}
          onChange={handleInputChange}
        />
      </div>

      <div className='bg-gray-100 p-4 rounded mb-6'>
        <h3 className='font-bold mb-2'>Order Summary:</h3>
        <ul className='space-y-2'>
          {cart.map(item => (
            <li key={item.id} className='flex justify-between'>
              <span>{item.name} (x{item.quantity})</span>
              <span>₦{(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className='mt-4 font-bold text-lg text-right pt-2 border-t'>
          Total: ₦{total.toLocaleString()}
        </div>
      </div>

      <PaystackPayment
        email={userInfo.email}
        amount={total}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        setCart={setCart} 
      />
    </div>
  );
};

export default Checkout;
