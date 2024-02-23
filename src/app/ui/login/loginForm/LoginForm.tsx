"use client";

import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
// import { authenticate } from "@/app/lib/actions";
import styles from "./loginForm.module.css";
// import { useFormState } from "react-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginForm = () => {
  // const [state, formAction] = useFormState(authenticate, undefined);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      toast.success("user loggedIn successfully")
      // Redirect the user to the desired page upon successful authentication
      router.push('/dashboard');
    } catch (error) {
      // console.log(error);
      toast.error("Authentication failed. Please check your credentials")
      // setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>Login</h1>
      <input type="text" placeholder="username" name="username" />
      <input type="password" placeholder="password" name="password" />
      <button>Login</button>
      {/* {state && state} */}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default LoginForm;
