import React from "react";
import { checkout } from "./CheckoutForm";
import './settings.css';

function Settings() {
  return (
    <div className="settings-container">
      <div className="settings-content">
        <h1 className="settings-title">Pricing Plan</h1>

        <p className="settings-description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias quas
          magni libero consequuntur voluptatum velit amet id repudiandae ea,
          deleniti laborum in neque eveniet.
        </p>

        <div className="pricing-plans">
          <div className="plan-card">
            <p className="plan-title">Free</p>
            <h2 className="plan-price">$0</h2>
            <p className="plan-duration">Life time</p>
          </div>

          <div className="plan-card highlighted">
            <p className="plan-title plan-title-highlighted">Premium</p>
            <h2 className="plan-price">$20</h2>
            <p className="plan-duration">Per month</p>
            <button
              className="plan-button"
              onClick={() => {
                checkout({
                  lineItems: [
                    { price: "price_1NnHAfELqXvkIUV6RRW6SpgU", quantity: 1 },
                  ],
                });
              }}
            >
              Start Now
            </button>
          </div>

          <div className="plan-card">
            <p className="plan-title">Enterprise</p>
            <h2 className="plan-price">$40</h2>
            <p className="plan-duration">per month</p>
            <button
              className="plan-button"
              onClick={() => {
                checkout({
                  lineItems: [
                    { price: "price_1NnGhtELqXvkIUV6xk1MKQ7T", quantity: 1 },
                  ],
                });
              }}
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
