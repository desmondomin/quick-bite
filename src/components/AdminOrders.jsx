import React, {useState, useEffect} from "react";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect (() => {
        const fetchOrders = async () => {
          try{
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const fetchedOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(fetchedOrders);
          } catch (error) {
              console.error("Failed to fetch orders: ", error);
            
          }
        };
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef,{ status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
            )
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                All Orders
            </h2>
            <ul className="space y-4">
                {orders.map(order => (
                    <li key={order.id} className="border p-4 rounded bg-white shadow">
                        <p><strong>User:</strong> {order.userEmail || "N/A"}</p>
                        <p><strong>Time:</strong> {order.createdAt?.toDate().toLocaleString()}</p>
                        <p><strong>Status:</strong> {order.status || 'pending'}</p>
                        <p><strong>Total:</strong> ₦{order.total?.toFixed(2)}</p>
                        <div className="mt-2 space-x-2">
                            <button
                            onClick={() => updateStatus(order.id, "preparing")}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >Preparing
                            </button>
                            <button
                            onClick={() => updateStatus(order.id, "Delivered")}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >Delivered
                            </button>
                        </div>
                    </li>
                ))}

            </ul>

        </div>
    );
}

export default AdminOrders;