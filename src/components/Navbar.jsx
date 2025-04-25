import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'; // Adjust the path to your Firebase configuration file
import { useNavigate } from 'react-router-dom';




const Navbar = ({user, isAdmin, cart, setViewCart}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
 
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/'); // redirect to /menu page
  };

  
  return (
   <nav className='bg-white shadow p-4 flex justify-between items-center'>
    <h1 onClick={goHome} className='text-xl font-bold text-red-600 cursor-pointer'>QuickBite</h1>
    <div className='space-x-4'>
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/order" className='text-sm font-medium text-gray-700 hover:underline'>My Orders</Link>
        
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
        {user ? (
          <button onClick={() => auth.signOut()}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <div className='relative inline-block'>
        <button onClick={() => setViewCart(true)} className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'>
          View Cart
        </button>
        {totalItems > 0 && (
          <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full'>
            {totalItems}
          </span>
        )}
        </div>
      
    </div>
   </nav>
  );
}

export default Navbar