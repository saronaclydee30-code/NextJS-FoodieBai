"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFoodie } from "../../providers";
import FoodieBaiBrand from "../../components/shared/FoodieBaiBrand";
import AppIcon from "../../components/shared/AppIcon";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field, value, isSignUp) {
  const trimmedValue = value.trim();

  if (field === "username" && isSignUp && !trimmedValue) {
    return "Please enter a username.";
  }
  if (field === "email" && isSignUp && !trimmedValue) {
    return "Please enter your email address.";
  }
  if (field === "email" && isSignUp && !emailPattern.test(trimmedValue)) {
    return "Enter a valid email address.";
  }
  if (field === "identifier" && !trimmedValue) {
    return "Enter your email or username.";
  }
  if (
    field === "identifier" &&
    trimmedValue.includes("@") &&
    !emailPattern.test(trimmedValue)
  ) {
    return "Enter a valid email address.";
  }
  if (field === "password" && !trimmedValue) {
    return "Please enter your password.";
  }
  if (field === "password" && isSignUp && value.length < 6) {
    return "Use at least 6 characters.";
  }

  return "";
}

function getReturnPath() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  return returnTo === "/cart" ? "/cart" : "/home";
}

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const isSignUp = mode === "signup";

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateField(field, value, isSignUp),
      }));
    }
  };

  const validateOnBlur = (field) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateField(field, form[field], isSignUp),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const fieldsToValidate = isSignUp
      ? ["username", "email", "password"]
      : ["identifier", "password"];
    const nextErrors = Object.fromEntries(
      fieldsToValidate.map((field) => [
        field,
        validateField(field, form[field], isSignUp),
      ]),
    );
    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const result = isSignUp ? signUp(form) : signIn(form);
    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(getReturnPath());
  };

  const preserveCheckoutWhenSwitchingAuth = (event) => {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    if (returnTo !== "/cart") return;

    event.preventDefault();
    router.push(
      isSignUp
        ? "/auth/signin?returnTo=%2Fcart"
        : "/auth/signup?returnTo=%2Fcart",
    );
  };

  const identifierField = isSignUp ? "email" : "identifier";
  const identifierId = isSignUp ? "signup-email" : "signin-identifier";
  const passwordId = isSignUp ? "signup-password" : "signin-password";

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
              : "Welcome back."}
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
          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="field-label">
                <label htmlFor="signup-username">Username</label>
                <span className="field-wrap">
                  <AppIcon name="user" size={18} />
                  <input
                    id="signup-username"
                    type="text"
                    value={form.username}
                    onChange={(event) =>
                      updateField("username", event.target.value)
                    }
                    onBlur={() => validateOnBlur("username")}
                    placeholder="Choose a username"
                    autoComplete="username"
                    aria-invalid={Boolean(fieldErrors.username)}
                    aria-describedby={
                      fieldErrors.username ? "signup-username-error" : undefined
                    }
                  />
                </span>
                {fieldErrors.username && (
                  <small
                    className="field-error"
                    id="signup-username-error"
                    role="alert"
                  >
                    {fieldErrors.username}
                  </small>
                )}
              </div>
            )}

            <div className="field-label">
              <label htmlFor={identifierId}>
                {isSignUp ? "Email address" : "Email or username"}
              </label>
              <span className="field-wrap">
                <AppIcon name="mail" size={18} />
                <input
                  id={identifierId}
                  type={isSignUp ? "email" : "text"}
                  value={form[identifierField]}
                  onChange={(event) =>
                    updateField(identifierField, event.target.value)
                  }
                  onBlur={() => validateOnBlur(identifierField)}
                  placeholder={
                    isSignUp ? "you@example.com" : "Email or username"
                  }
                  autoComplete={isSignUp ? "email" : "username"}
                  aria-invalid={Boolean(fieldErrors[identifierField])}
                  aria-describedby={
                    fieldErrors[identifierField]
                      ? `${identifierId}-error`
                      : undefined
                  }
                />
              </span>
              {fieldErrors[identifierField] && (
                <small
                  className="field-error"
                  id={`${identifierId}-error`}
                  role="alert"
                >
                  {fieldErrors[identifierField]}
                </small>
              )}
            </div>

            <div className="field-label">
              <label htmlFor={passwordId}>Password</label>
              <span className="field-wrap">
                <AppIcon name="lock" size={18} />
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  onBlur={() => validateOnBlur("password")}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password
                      ? `${passwordId}-error`
                      : undefined
                  }
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  <AppIcon name={showPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </span>
              {fieldErrors.password && (
                <small
                  className="field-error"
                  id={`${passwordId}-error`}
                  role="alert"
                >
                  {fieldErrors.password}
                </small>
              )}
              {!isSignUp && (
                <Link
                  className="auth-forgot-link"
                  href="/auth/forgot-password"
                >
                  Forgot password?
                </Link>
              )}
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button auth-submit" type="submit">
              {isSignUp ? "Create account" : "Sign in"}
              <AppIcon name="arrowRight" size={18} />
            </button>
          </form>

          <p className="auth-switch">
            {isSignUp ? "Already have an account?" : "New to FoodieBai?"}{" "}
            <Link
              href={isSignUp ? "/auth/signin" : "/auth/signup"}
              onClick={preserveCheckoutWhenSwitchingAuth}
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
          {isSignUp && (
            <p className="auth-legal-note">
              By creating an account, you agree to our{" "}
              <Link href="/terms">Terms</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
