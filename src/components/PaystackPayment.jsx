import React from 'react';

const PaystackPayment = ({ email, amount, onSuccess, onCancel, setCart }) => {
    const publicKey = "pk_test_7c9ab05cac6b8b10ac9d10761ed3582878d2bb3e";
    const handlePayment = () => {
        const handler = window.PaystackPop.setup({
            key: publicKey, // Paystack public key
            email: email,
            amount: amount * 100, // Amount in kobo (1 Naira = 100 Kobo)
            currency: 'NGN',
            ref: "order-" + new Date().getTime(),
            callback: (response) => {
                console.log(response);
                onSuccess(response); // Handle success callback
                setCart([]); // Clear the cart
                localStorage.removeItem("cart");
            },
            onClose: () => {
                onCancel(); // Handle cancellation callback
            },
        });

        handler.openIframe();
    };

    return (
        <button onClick={handlePayment} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all">
            Pay with Paystack
        </button>
    );
};

export default PaystackPayment;
