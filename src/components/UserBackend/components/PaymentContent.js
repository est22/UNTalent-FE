import React, { useState, useEffect } from 'react';
import './PaymentContent.css';

const PaymentContent = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to calculate the remaining time of the subscription
  const calculateRemainingTime = (nextBillingDate) => {
    const now = new Date();
    const nextBilling = new Date(nextBillingDate);
    const timeLeft = nextBilling - now; // time left in milliseconds
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  useEffect(() => {
    // Fetch the subscription details from the backend
    fetch(`http://localhost:3001/get_subscription?userId=${user.sub}`)
      .then(response => response.json())
      .then(data => {
        setSubscription(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subscription:', error);
        setError('Failed to load subscription details.');
        setLoading(false);
      });
  }, [user]);

  const handleSubscribe = () => {
    // Implement subscription logic here
    // This might involve calling your backend to create a subscription
    // and then redirecting the user to a payment page or handling payment directly here
  };

  const handleUnsubscribe = () => {
    // Implement unsubscription logic here
    // Typically, this would involve calling your backend to cancel the current subscription
  };

  if (loading) {
    return <div>Loading your subscription details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="payment-content">
      <h2>Your Subscription</h2>
      {!subscription && (
        <div>
          <p>You are currently not subscribed.</p>
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>
      )}
      {subscription && (
        <>
          <p>Status: {subscription.isActive ? 'Active' : 'Inactive'}</p>
          <p>Plan: {subscription.planName}</p>
          {subscription.planName === 'Free Trial' && calculateRemainingTime(subscription.nextBillingDate) > 0 && (
            <p>Days until trial ends: {calculateRemainingTime(subscription.nextBillingDate)}</p>
          )}
          <p>Next Billing Date: {subscription.nextBillingDate}</p>
          {subscription.isActive ? (
            <button onClick={handleUnsubscribe}>Unsubscribe</button>
          ) : (
            <button onClick={handleSubscribe}>Subscribe Now</button>
          )}
        </>
      )}
      {/* Future: Add components for handling payment methods */}
    </div>
  );
};

export default PaymentContent;
