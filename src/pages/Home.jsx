import { useState, useEffect} from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Auth from '../components/Auth';
import { signOut } from 'firebase/auth';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import { GiBowlOfRice, GiHotMeal, GiFruitBowl  } from "react-icons/gi";
import { FaIceCream, FaGlassMartiniAlt } from "react-icons/fa";



















const Home = ({cart, setCart, viewCart, setViewCart, totalPrice, handleProceedToCheckout}) => {

    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null); // Default category
   
   

    const navigate = useNavigate(); 
   
    

    const categories = [
        { name: 'Rice', icon: <GiBowlOfRice className="text-4xl text-yellow-600" /> },
        { name: 'Soup', icon: <GiHotMeal className="text-4xl text-red-500"/>},
        { name: 'Salad', icon: <GiFruitBowl className="text-4xl text-green-600"/>},
        { name: 'Dessert', icon: <FaIceCream className="text-4xl text-pink-500"/>},
        { name: 'Fruit-Drink', icon: <FaGlassMartiniAlt className="text-4xl text-purple-500"/>},
    ];

    const menuItems = [
        {
            id: 1,
            name: "Jollof Rice",
            category: "Rice",
            description: "Spicy and flavorful rice dish with tomatoes and spices.",
            image: "https://img.freepik.com/premium-photo/schezwan-fried-rice-masala-is-popular-indo-chinese-food-served-plate-bowl-with-chopsticks-selective-focus_466689-30870.jpg?ga=GA1.1.1646358213.1740865860&semt=ais_hybrid&w=740",
            price: 2000
        },
        {
            id: 2,
            name: "Afang Soup",
            category: "Soup",
            description: "A traditional Nigerian soup made with Afang leaves and meat.",
            image: "https://media.istockphoto.com/id/1373169941/photo/afang-soup.jpg?s=612x612&w=0&k=20&c=OxEiHp0fd-LOa1FBatSvepOr7skLrxCN-pMspou6d7c=",
            price: 1500
        },
        {
            id: 3,
            name: "Chicken Salad",
            category: "Salad",
            description: "Fresh salad with grilled chicken, lettuce, and dressing.",
            image: "https://media.istockphoto.com/id/1264431895/photo/caesar-salad-vegetable-salad-with-roast-chicken-meat-on-wooden-background.jpg?s=612x612&w=0&k=20&c=0uo14hDIn8HLShwlhnINwc2nwfWGE-LdMpeWuvEakEo=",
            price: 1200
        },
        {
            id: 4,
            name: "Chocolate Cake",
            category: "Dessert",
            description: "Rich and moist chocolate cake with creamy frosting.",
            image: "https://media.istockphoto.com/id/478348860/photo/chocolate-cake-with-chocolate-fudge-drizzled-icing-and-chocolate-curls.jpg?s=612x612&w=0&k=20&c=XLHhfThUBkg_-28RCs9h0L-Fu-mUijNBzq8voZmbqqM=",
            price: 2500
        },
        {
            id: 5,
            name: "Fruit Punch",
            category: "Fruit-Drink",
            description: "Refreshing fruit drink made with a mix of tropical fruits.",
            image: "https://media.istockphoto.com/id/615980538/photo/homemade-jamaican-rum-punch.jpg?s=612x612&w=0&k=20&c=j_ijNmS5EtzQBtUFk8mbBlG0_rVEI9gw795r6YAmk9s=",
            price: 800
            
        },
        {
            id: 6,
            name: "Fried Rice",
            category: "Rice",
            description: "Delicious fried rice with vegetables and spices.",
            image: "https://media.istockphoto.com/id/507155407/photo/healthy-homemade-fried-rice.jpg?s=612x612&w=0&k=20&c=WvNGk-7iwrBmsXH1QrrT7vaCTuB2Nij57mQey0VMohU=",
            price: 1800
        },
        {
            id: 7,
            name: "Egusi Soup",
            category: "Soup",
            description: "Nigerian soup made with ground melon seeds and vegetables.",
            image: "https://media.istockphoto.com/id/1280669372/photo/nigerian-egusi-soup-served-with-pounded-yam.jpg?s=612x612&w=0&k=20&c=eJGybaDaWlhSMs3av4w8gGfw2Cb4rWu0ESqF0pSox5U=",
            price: 1600
        },
        {
            id: 8,
            name: "Pudding",
            category: "Dessert",
            description: "Creamy and sweet pudding made with condensed milk.",
            image: "https://media.istockphoto.com/id/1386212099/photo/ndelicious-condensed-milk-pudding-on-white-plate-top-view-copy-space.jpg?s=612x612&w=0&k=20&c=y9MzUFkLpQMJow-_Nwg5h3cY_KiPlzdYWIzcHyhC-Nk=",
            price: 900
        }

    ]
    const handleOrderNow = () => {
        navigate('/menu'); // redirect to /menu page
      };
    

    const handleRemove = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        toast.info("Item removed from cart.");

    }

    const handleSignOut = () => {
        signOut(auth).then(() => {  
            alert("Logged out successfully");
        }).catch((error) => {   
            alert(error.message);
        });
    }
    const safeTotal = Number(totalPrice) || 0;

    const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems.slice(0, 8);
   
   

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    return () => unsub();
    }, []);

  return (

    <div className="min-h-screen">
    {!user ? (
      <div className="flex items-center justify-center h-screen">
        <Auth />
      </div>
        ) : 
        
    (
        <div className='bg-gradient-to-br from-red-100 to-yellow-100 py-12 px-4'>
            {/* ✅ ALL your existing app UI goes here */}
            <div className='flex flex-col items-center justify-center text-center mb-12'>
            <h1 className='text-4x md:text-5xl  font-extrabold text-gray-800 mb-4'> Delicious Food, Delivered Fast</h1>
            <p className='text-lg md:text-xl text-gray-600 mb-6 max-w-xl'>
            Order your favorite meals in just a few clicks. Fast delivery, hot food, happy you.
            </p>
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgR2_ifEO9soISUahG9uWX2RbkV1v2IoqyhQ&s"
                alt="Food delivery"
                className="w-48 md:w-64 mt-6 bg-color-transparent"
            />

            <button onClick={handleOrderNow} className='bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition'>
                Order Now
            </button>
            {user && (
                <button onClick={handleSignOut} className='bg-gray-800 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-full transition mt-4'>
                    Log Out
                </button>
            )}
            </div>
            {/* Category section */}
            <div className='max-w-4xl mx-auto text-center'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Categories</h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6'>
                    {categories.map((cat, i) => (
                        <div 
                        key={i}
                        onClick={() => setSelectedCategory(cat.name)}
                        className='bg-white rounded-2xl  flex flex-col items-center justify-center text-center shadow-lg p-6 hover:scale-105 hover:ring-2 hover:ring-red-400 transition transform duration-300 cursor-pointer '
                        >
                            <div className='text-4xl mb-2 text-red-500'>{cat.icon}</div>
                            <h3 className='text-lg font-semibold'>{cat.name}</h3>

                        </div>
                    ))}
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full transition"
                        >
                            Show All
                        </button>
                        )}

                </div>

            </div>
            

            {/* Menu section */}
           <div className='max-w-6xl mx-auto mt-12'>
                <div className="text-right max-w-6xl mx-auto mb-4">
                <span className='mr-4 text-gray-700 font-medium'>🛒 Items in Cart: {cart.length}</span>
                <button onClick={() => setViewCart(true)}
                    className='bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600'>View Cart</button>
                </div>
                <h2 className='text-2xl font-bold text-gray-800 text-center mb-6'>Popular Picks</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    {filteredMenuItems.map((item, i) => (
                        <div
                        key={i}
                        className='bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition'>
                            <img
                            src={item.image}
                            alt={item.name}
                            className='w-full h-40 object-cover rounded-md mb-3'
                            />
                            <h3 className='text-lg font-semibold mb-1'>{item.name}</h3>
                            <p className='text-gray-600 mb-2'>{item.description}</p>
                            <p className='text-red-500 font-semibold'>{item.price}</p>
                            <button
                            onClick={
                                () => {
                                    const existingItemIndex = cart.findIndex(i => i.id === item.id);
                                  
                                    if (existingItemIndex !== -1) {
                                      const updatedCart = [...cart];
                                      updatedCart[existingItemIndex].quantity += 1;
                                      setCart(updatedCart);
                                    } else {
                                      setCart([...cart, { ...item, quantity: 1 }]);
                                       toast.success(`${item.name} added to cart!`);
                                    }
                                  
                                  }
                            } 
                            className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full mt-3 transition'>
                                Add to Cart 
                            </button>
                        </div>
                    ))}

                </div>

            </div>
            {viewCart && (
                <div className='fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 z-50 overflow-y-auto transition'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-bold'>
                            Your Cart
                        </h2>
                        <button onClick={() => setViewCart(false)} className='text-red-500 font-bold text-lg'>
                         ✕
                        </button>
                    </div>
                    
                {cart.length === 0 ? (
                    <p className='text-gray-600'>Your cart is empty.</p>) : (
                        <ul>
                            {cart.map((item, index) => (
                                <li key={item.id} className='mb-4 border-b pb-2 justify-between items-center'>
                                    <div>
                                    <h3 className='font-semibold'>{item.name}</h3>
                                    <p className='text-sm text-gray-500'>
                                    ₦{item.price.toLocaleString()} × {item.quantity} = ₦{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                    </div>
                                    <button onClick={() => handleRemove(index)} className='text-red-500 font-bold text-lg'
                                        title='Remove'> 
                                        ✕
                                    </button>
                                    
                                </li>
                                
                            ))}
                        </ul>
                    )}
                    {cart.length > 0 && (
                        <div className='mt-6'>
                            <div className='mt-4 text-right font-semibold text-lg text-gray-800'>
                                Total:  ₦{safeTotal.toFixed(2)}
                            </div>
                        <button onClick={handleProceedToCheckout} className='w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg'>
                            Checkout    
                        </button>
                        </div>
                    )}
                </div>
            )}
            
        </div>
    )
}
<ToastContainer position="top-right" autoClose={2000} />

  </div>
)
}
    
export default Home;