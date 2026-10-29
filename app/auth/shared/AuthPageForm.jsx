"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFoodie } from "../../providers";
import FoodieBaiBrand from "../../components/shared/FoodieBaiBrand";
import AppIcon from "../../components/shared/AppIcon";

export default function AuthPageForm({ mode }) {
  const router = useRouter();
  const { signUp, signIn } = useFoodie();
  const [form, setForm] = useState({
    username: "",
    email: "",
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isSignUp = mode === "signup";

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    const result = isSignUp ? signUp(form) : signIn(form);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/home");
  };

  return (
    <main className="auth-screen">
      <div className="auth-layout">
        <div className="auth-poster">
          <FoodieBaiBrand />
          <div className="poster-badge">
            <AppIcon name="sparkles" size={15} /> Good food, good mood
          </div>
          <h1>
            {isSignUp
              ? "Your next favorite meal is waiting."
              : "Welcome back, FoodieUser."}
          </h1>
          <p>Order from the local spots you love, all in one cozy place.</p>
          <div className="poster-plate">
            <span className="plate-shadow" />
            <span className="plate-food">{isSignUp ? "🍔" : "🍗"}</span>
            <span className="plate-sparkle sparkle-one">✦</span>
            <span className="plate-sparkle sparkle-two">✦</span>
          </div>
        </div>

        <div className="auth-card">
          <Link className="back-button" href="/">
            <AppIcon name="back" size={18} /> Back
          </Link>
          <div className="auth-heading">
            <span className="auth-kicker">FOODIEBAI ACCOUNT</span>
            <h2>{isSignUp ? "Create your account" : "Sign in to FoodieBai"}</h2>
            <p>
              {isSignUp
                ? "Save favorites and order in a few taps."
                : "Pick up where your next meal left off."}
            </p>
          </div>
          <p className="auth-demo-note">
            Prototype access only. Passwords are not verified by a server.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <label className="field-label">
                Username
                <span className="field-wrap">
                  <AppIcon name="user" size={18} />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(event) =>
                      setForm({ ...form, username: event.target.value })
                    }
                    placeholder="Choose a username"
                    autoComplete="username"
                  />
                </span>
              </label>
            )}
            <label className="field-label">
              {isSignUp ? "Email address" : "Email or username"}
              <span className="field-wrap">
                <AppIcon name="mail" size={18} />
                <input
                  type={isSignUp ? "email" : "text"}
                  value={isSignUp ? form.email : form.identifier}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [isSignUp ? "email" : "identifier"]: event.target.value,
                    })
                  }
                  placeholder={isSignUp ? "you@example.com" : "FoodieUser"}
                  autoComplete={isSignUp ? "email" : "username"}
                />
              </span>
            </label>
            <label className="field-label">
              Password
              <span className="field-wrap">
                <AppIcon name="lock" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder="••••••••"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <AppIcon name={showPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </span>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button auth-submit" type="submit">
              {isSignUp ? "Create account" : "Sign in"}
              <AppIcon name="arrowRight" size={18} />
            </button>
          </form>

          <p className="auth-switch">
            {isSignUp ? "Already have an account?" : "New to FoodieBai?"}{" "}
            <Link href={isSignUp ? "/auth/signin" : "/auth/signup"}>
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
