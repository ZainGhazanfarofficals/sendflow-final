"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import './register.css'

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="grid-center">
    <div className="form-container">
      <h1 className="form-header">Register</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="input-field"
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
          className="input-field"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="input-field"
        />
        <button className="button">
          Register
        </button>

        {error && (
          <div className="error-message-box">
            {error}
          </div>
        )}

        <Link className="link" href={"/login"}>
          Already have an account? <span>Login</span>
        </Link>
      </form>
    </div>
  </div>
  );
}
