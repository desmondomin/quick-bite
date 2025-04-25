// Menu.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Menu = ({ cart, setCart, handleCheckout}) => {
  const [menuItems, setMenuItems] = useState([]);
 

  const addToCart = (item) => {
    const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
    if (existingIndex !== -1) {
      // Update quantity if item already in cart
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Add new item with quantity
      setCart(prev => [...prev, { ...item, quantity: 1 }]);
      toast.success('Item added to cart');
    }
  };
  
  const updateQuantitiy = (itemId, newQuantity) => {
    if(newQuantity < 1)
    {
      removeItem(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? {...item, quantity: newQuantity} : item
      

    )
  );
  toast.success('Item quantity updated');
  }

  const removeItem = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast.error('Item removed from cart');
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchMenu = async () => {
      const menuSnapshot = await getDocs(collection(db, 'menu'));
      const items = menuSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price)
      }));
      setMenuItems(items);
    };

    fetchMenu();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Our Menu</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 sm:grid-cols-2">
      

        {menuItems.map(item => (
          <div key={item.id} className="p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover mb-4 rounded-xl" />
            )}
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">₦{item.price}</p>
            <button onClick={() => addToCart(item)} className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">
              Add to Cart
            </button>
           
          </div>
        ))}
        
      </div>
        

          {/* 🛒 CART VIEW */}
      <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow-inner">
        <h3 className="text-2xl font-bold mb-4">🛒 Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">Cart is empty</p>
        ) : (
          <>
            <ul className="space-y-3">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                  <div className='flex-1'>
                  <span className='font-medium'>{item.name}</span> <br />
                  <span className="text-sm text-gray-500">₦{item.price * item.quantity.toFixed(2)}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button 
                    onClick={() => updateQuantitiy(item.id, item.quantity - 1)}
                    className='bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 '
                    >-</button>
                    <span>{item.quantity}</span>
                    <button
                    onClick={() => updateQuantitiy(item.id, item.quantity + 1)}
                    className='bg-green-500 text-white w-8 h-8 rounded-full hover:bg-green-600'
                    >
                    +
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className='ml-2 text-red-500 hover:text-red-700 text-sm'>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-bold text-xl text-red-600">
              Total: ₦{total}
            </div>
            <button 
             disabled={total === 0}
             className={`mt-4 px-6 py-2 rounded-lg text-white ${
               total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
             }`}
             onClick={handleCheckout}>Proceed to Checkout</button>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    
  );
};

export default Menu;
