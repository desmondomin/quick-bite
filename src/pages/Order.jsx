import React, {useState, useEffect} from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom';


const Order = ({ setViewCart, cart, setCart }) => {
    const [user] = useAuthState(auth)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {   
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                    
                );
                const querySnapshot = await getDocs(q);

                const fetchedOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(fetchedOrders);   
                
            } catch (error) {
                console.error("Error fetching orders: ", error)     
                
            } finally {
                setLoading(false)
            }
        }
        fetchOrders();
    }, [user]);

    const handleReorder = (items) => {
        if (!Array.isArray(items)) return;

        const newCart = [...cart];
    
        items.forEach(item => {
          const existing = newCart.find(i => i.name === item.name);
          if (existing) {
            existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
          } else {
            newCart.push({ ...item });
          }
        });
    
        setCart(newCart);
        setViewCart(true);
        alert("Items added to cart!");
        navigate("/");
        setTimeout(() => {
            setViewCart(true);
          }, 200);
    }

    if (loading) return <p className='text-center mt-12'>Order Loading...</p>;

  return (
    <div className='max-w-4xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800 text-center'>My Orders</h1>
        {orders.length === 0 ? (
            <p className='text-gray-600 text-center'>No orders found.</p>
        ) : (
            <ul className='space-y-6'> 
                {orders.map(order => (
                    <li key={order.id} className='p-4 border bg-white shadow- rounded-lg'>
                        <p className='text-sm text-gray-500 mb-2'>
                            Order placed on:{' '}
                            {order.createdAt?.toDate?.().toLocaleString?.() || 'Unknown'}
                        </p>
                        <div className='space-y-2'>
                            {order.items.map((item, index) => (
                                <div key={index} className='flex justify-between items-center'>
                                    <span>{item.name}</span>
                                    <span className='text-red-500 font-medium'>₦{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <p className='text-right font-semibold mt-2'>
                            Total: ₦{order.total.toFixed(2)}
                        </p>
                        {order.items &&(<button 
                            onClick={() => handleReorder(order.items)} 
                            className='mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
                        > Reorder </button>
                        )}
                        </li>
                ))}
            </ul>
        )}
        </div>
                    
        );
        }
    


export default Order