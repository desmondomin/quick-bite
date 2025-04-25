// AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc,  Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AdminOrders from './AdminOrders';
import Modal from './Modal';


const AdminPanel = ({setMenuItems, menuItems, setShowModal, showModal, newItem, setNewItem, handleAddItem}) => {
  const [orders, setOrders] = useState([]);
  
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', imageUrl: '' });


  useEffect(() => {
    const fetchMenu = async () => {
        const menuSnapshot = await getDocs(collection(db, 'menu'));
        const items = menuSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));  
        setMenuItems(items);
    }
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchAllOrders = async () => {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
    }
    fetchAllOrders();
  }, []);

  
    const handleEdit = async () => {
        try {
            const itemRef = doc(db, "menu", editingItem.id);
            await setDoc(itemRef, {
              ...editingItem,
              name: editForm.name,
              price: parseFloat(editForm.price),
              updatedAt: new Date(),
            });
        
            // Refresh list
            const snapshot = await getDocs(collection(db, "menu"));
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMenuItems(items);
        
            setEditingItem(null); // Close modal
          } catch (error) {
            console.error("Update failed: ", error);
            alert("Failed to update item.");
          }
    }

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
                await deleteDoc(doc(db, "menu", id));
                setMenuItems(menuItems.filter(item => item.id !== id));
        }
    }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">Admin Dashboard</h1>

      <AdminOrders />

        <button onClick={() => setShowModal(true)} 
            className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                 ➕ Add Menu Item
        </button>
        {showModal && (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <h2 className='text-xl font-semibold mb-4'>Add New Menu Item</h2>
                    <label className='block mb-2'>Item Name:</label>
                    <input
                    type='text'
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className='border rounded p-2 w-full'
                    required
                />
                <label className='block mb-2'>Price:</label>
                <input
                    type='number'
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className='border rounded p-2 w-full mb-4'
                    required
                />
                 <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleAddItem} className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
            </div>
                
                </Modal>
            

        )}
                            <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)}>
                            <h2 className='font-semibold text-xl mb-4'>Edit Menu Item</h2>
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full p-2 border mb-3 rounded"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                             <input
                                type="number"
                                placeholder="Price"
                                className="w-full p-2 border mb-4 rounded"
                                value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            />
                            <div className="flex justify-end space-x-2">
                            <button
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 bg-gray-300 rounded"
                            >
                            Cancel
                            </button>
                            <button onClick={handleEdit} className='px-4 py-2 bg-blue-500 text-white rounded'>
                            Save
                            </button>
                            </div>
                            </Modal>
                    
                

      
        <h2 className='text-2xl font-semibold mb-4'>🍽️ Menu Management</h2>
         <ul className='space-y-4'>
        {Array.isArray(menuItems) && menuItems.map(item => (
          <li key={item.id} className='bg-white p-4 rounded shadow flex justify-between items-center'>
            <div>
              <p className='font-semibold'>{item.name}</p>
              <p className='text-gray-600'>₦{item.price}</p>
            </div>
            <div className='space-x-2'>
              <button className='text-red-500' onClick={() => handleDelete(item.id)}>Delete</button>
              <button className='text-blue-500'
                onClick={() => {
                    setEditingItem(item)
                    setEditForm({  name: item.name, price: item.price, imageUrl: item.imageUrl });
                }}
                >Edit
                </button>
            </div>
          </li>
        ))}
      </ul>
        
        
        


      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">📦 All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="p-4 border rounded bg-white shadow text-sm">
                <p className="text-gray-800">
                  User ID: {order.userId} | Total: ₦{order.total}
                </p>
                <p className="text-xs text-gray-400">
                  Placed on: {order.createdAt?.toDate().toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
