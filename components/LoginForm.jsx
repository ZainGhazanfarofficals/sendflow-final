"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import './login.css'

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const router = useRouter();
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    // Check if the input value is a valid email address
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsValidEmail(emailPattern.test(inputEmail));
  };
  const handlePasswordChange = (e) => {
    const inputpassword = e.target.value;
    setPassword(inputpassword);
    setIsValidPassword(password>=8);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password.length>=8&&isValidEmail)
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h1 className="login-title">Login</h1>

      <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            onChange={handleEmailChange}
            className="input"
            required
          />
          {!isValidEmail && (
            <p style={{ color: "red" }}>Please enter a valid email address.</p>
          )}
          <input
            onChange={handlePasswordChange}
            type="password"
            placeholder="Password"
            className="input"
            required
          />
          {!isValidPassword&& ( <p className="error-message">Please enter a valid password with 8 letters.</p> )}
           <button className="button-login">
          Login
        </button>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

           <Link href={"/register"} className="text-small link-register">
            Don't have an account? <span>Register</span>
        </Link>
        </form>
      </div>
    </div>
  );
}
