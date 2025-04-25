import React from 'react'

const Cart = ({cart, setCart}) => {
    const increaseQty = (Id) => {
        setCart(prev => prev.map(item => item.id === Id ? {...item, quantity: item.quantity + 1} : item));
    }
    const decreaseQty = (Id) => {
        setCart(prev => prev.map(item => item.id === Id ? {...item, quantity: item.quantity - 1} : item)
    .filter(item => item.quantity > 0));
    }
    const removeItem = (Id) => {
        setCart(prev => prev.filter(item => item.id !== Id));
    }
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + price * quantity;
      }, 0);
      
  return (
    <div className='max-w-4xl mx-auto p-6'>
        <h2 className='text-3xl font-bold mb-6 text-center text-red-600'>🛒 Your Cart</h2>
        {cart.length === 0 ? (
            <p className='text-center text-gray-500'>Your cart is empty</p>
        ) : (
            <>
            <ul className='space-y-4'>
            {cart.map(item => (
              <li key={item.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
                <div className="flex items-center space-x-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                  )}
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₦{item.price}</p>
                    <div className="flex items-center mt-1">
                      <button onClick={() => decreaseQty(item.id)} className="px-2 text-lg">−</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)} className="px-2 text-lg">+</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">Remove</button>
              </li>
            ))}
            </ul>
            <div className="mt-6 text-right">
            <h3 className="text-xl font-bold"> Total: ₦{total.toLocaleString()}</h3>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Proceed to Checkout</button>
          </div>
            </>
        )}

    </div>
  )
}

export default Cart