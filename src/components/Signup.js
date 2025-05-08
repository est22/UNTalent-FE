import React from 'react';
import './Signup.css'; // Ensure this CSS file is created or updated

const Plan = ({ title, price, features, buttonText, planType }) => (
  <div className={`plan ${planType}`}>
    <div className="plan-header">
      <h2>{title}</h2>
      <p className="price">{price}</p>
      <p className="billing-cycle">{planType === 'monthly' ? 'per month' : 'per year'}</p>
    </div>
    <ul className="features">
      {features.map((feature, index) => (
        <li key={index} className="feature-item">{feature}</li>
      ))}
    </ul>
    <button className="plan-select-button">{buttonText}</button>
  </div>
);

const Signup = () => {
  const monthlyFeatures = [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    // ...other features
  ];

  const yearlyFeatures = [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    // ...other features
  ];

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Pricing</h1>
        <p>Select the plan that suits you best.</p>
      </div>
      <div className="plans">
        <Plan
          title="Monthly"
          price="$29"
          features={monthlyFeatures}
          buttonText="Choose Monthly"
          planType="monthly"
        />
        <Plan
          title="Yearly"
          price="$290"
          features={yearlyFeatures}
          buttonText="Choose Yearly"
          planType="yearly"
        />
      </div>
    </div>
  );
};

export default Signup;
