import React from "react";
import { checkout } from "./CheckoutForm";

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "Forever",
    features: ["Up to 200 contacts", "Basic analytics", "Community support"],
    button: null,
  },
  {
    name: "Premium",
    price: "$20",
    cadence: "per month",
    features: [
      "Unlimited contacts",
      "Sequences + A/B tests",
      "Priority inbox routing",
    ],
    button: {
      label: "Start now",
      priceId: "price_1NnHAfELqXvkIUV6RRW6SpgU",
    },
  },
  {
    name: "Enterprise",
    price: "$40",
    cadence: "per month",
    features: [
      "SAML / SSO",
      "Custom compliance review",
      "Dedicated manager",
    ],
    button: {
      label: "Talk to sales",
      priceId: "price_1NnGhtELqXvkIUV6xk1MKQ7T",
    },
  },
];

function Settings() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-50 shadow-2xl backdrop-blur">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
          Pricing
        </p>
        <h1 className="text-2xl font-bold">Choose your plan</h1>
        <p className="mt-1 text-sm text-slate-300">
          Scale outreach with flexible plans that keep compliance and deliverability
          in check.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-lg ${
              idx === 1 ? "ring-2 ring-emerald-400/60" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-100">
                {plan.name}
              </div>
              {idx === 1 && (
                <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[11px] font-semibold text-emerald-100">
                  Most popular
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-bold">{plan.price}</div>
              <div className="text-sm text-slate-300">{plan.cadence}</div>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.button && (
              <button
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
                onClick={() =>
                  checkout({
                    lineItems: [{ price: plan.button.priceId, quantity: 1 }],
                  })
                }
              >
                {plan.button.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;
