import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { useEffect, useState } from "react"
import { getDoc, doc, setDoc, addDoc, collection, Timestamp, getDocs } from "firebase/firestore"

import { onAuthStateChanged } from "firebase/auth";
import { auth, db} from './firebase';
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Navbar from "./components/Navbar"
import Order from "./pages/Order"
import AdminPanel from "./components/AdminPanel"
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

import OrderSuccess from "./pages/OrderSuccess";
import CartOverlay from "./components/CartOverlay";










function App() {

  
  const [cart, setCart] = useState([])
  const [viewCart, setViewCart] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', imageUrl: '' });
  const [showModal, setShowModal] = useState(false);

  const createUserIfNotExists = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: "user", // Default role
        createdAt: new Date(),
      });
    }
  };

  const checkAdmin = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const role = userSnap.data().role;
    console.log("User role:", role); // 🔍
    setIsAdmin(role === "admin");
  } else {
    setIsAdmin(false);
  }
  };

  const handleAddItem = async (e) => {
      e.preventDefault();
  
      if(!newItem.name || !newItem.price)
      {
          alert("Please fill in all fields.");
          return;
      }
      try {
          await addDoc(collection(db, 'menu'), {
              name: newItem.name,
              price: parseFloat(newItem.price),
              imageUrl: newItem.imageUrl || '', // Optional field
              createdAt: Timestamp.now(),
          });
          setMenuItems({ name: '', price: '', imageUrl: ''}); 
          setShowModal(false);
          alert("Item added successfully!");
          const q = await getDocs(collection(db, 'menu'));
          const items = q.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setMenuItems(items);
      } catch (error) {
          console.error("Error adding item: ", error);
          alert("Failed to add item. Please try again.");
      }
    }
    const navigate = useNavigate();
    const totalPrice = cart.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return acc + price * quantity;
    }, 0);
    

     const handleCheckout = async () => {    
            if(!user) {
                alert("Please log in to compleete your order.");
                return;
            }
            try {
                await addDoc(collection(db, "orders"), {
                    userId: user.uid,
                    email: user.email,
                    items: cart,
                    total: totalPrice,
                    createdAt: new Date(),
                    status: "pending"
                });
                setCart([]); // Clear the cart after checkout
                setViewCart(false); // Close the cart view
                alert("Order placed successfully!");
                navigate("/order-success"); // Redirect to the orders page
            } catch (error) {
                console.error("Error placing order: ", error);
                alert("Error placing order. Please try again.");
            }
        }
        
        const handleProceedToCheckout = () => {
          if (cart.length === 0) {
            alert("Cart is empty");
            return;
          }
          setViewCart(false); // close cart first
          navigate('/checkout'); 
        };

  


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);

      if (firebaseUser) {
        await createUserIfNotExists(firebaseUser);
        await checkAdmin(firebaseUser);
      } else {
        setIsAdmin(false); // Reset on logout
      }

      setLoading(false);
    });

    return () => unsubscribe();

  }, []);
  
  if (loading) return <p className="text-center mt-12">Loading...</p>;
 
  return (
    <>
   
    <Navbar user={user} isAdmin={isAdmin} cart={cart} setViewCart={setViewCart}/>
    <Routes>
    <Route path="/admin" element={isAdmin ? <AdminPanel
     handleAddItem={handleAddItem}
     setMenuItems={ setMenuItems} menuItems={menuItems} setShowModal={setShowModal} showModal={showModal} newItem={newItem} setNewItem={setNewItem}/> : <Navigate to="/" />} />
      <Route path="/" element={<Home
       user={user} isAdmin={isAdmin}  cart={cart} setCart={setCart} 
       viewCart={viewCart} setViewCart={setViewCart}  totalPrice={totalPrice}
       handleProceedToCheckout={handleProceedToCheckout}/>} 
    
     />
      <Route path="/menu" element={<Menu 
       cart={cart} setCart={setCart} handleAddToCart={(item) => setCart(prev => [...prev, item])}
       handleCheckout={handleCheckout}/>} />
      <Route path="/order" element={<Order cart={cart} setCart={setCart}  setViewCart={setViewCart}/>} />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/checkout" element={<Checkout cart={cart}  handleCheckout={handleCheckout} setCart={setCart}/>} />
      

    </Routes>
    {viewCart && (
      
      
  <CartOverlay cart={cart} setCart={setCart} setViewCart={setViewCart} handleProceedToCheckout={handleProceedToCheckout}  />

  
  
)}



    </>
  
  );
}

export default App
