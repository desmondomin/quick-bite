// components/CartOverlay.jsx
import React from 'react';

const CartOverlay = ({ cart, setCart, setViewCart, handleProceedToCheckout }) => {
    const total = cart.reduce(
        (sum, item) => sum + (Number(item.price) * Number(item.quantity || 1)),
        0
      );
      

  const handleRemoveItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };


  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg p-6 z-50 overflow-y-auto border-1 border-gray-200 
     transform transition-transform duration-300 translate-x-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={() => setViewCart(false)} className="text-red-500 hover-underline">Close</button>
      </div>
      {cart.length === 0 ? (
        <p className=" text-gray-600">Your cart is empty.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between items-center border-b pb-2">
                <div>
              <p className='font-medium'>{item.name}</p>
              <p className='text-sm text-gray-500'>₦{item.name} x {item.quantity}</p>
              </div>
              <div className='flex items-center space-x-2'>
              <span className='font-semibold'>₦{(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:underline text-xs">
                Remove  

              </button>

              </div>
            </li>
          ))}
        </ul>
      )}
{cart.length > 0 && (
        <div className="mt-6">
          <div className="text-lg font-semibold">
            Total: ₦{total.toFixed(2)}
          </div>
          <button
            onClick={handleProceedToCheckout} // You can also navigate to /checkout
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartOverlay;
