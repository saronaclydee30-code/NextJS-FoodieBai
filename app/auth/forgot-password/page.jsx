"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppIcon from "../../components/shared/AppIcon";
import FoodieBaiBrand from "../../components/shared/FoodieBaiBrand";
import {
  findDemoAccount,
  generateDemoResetCode,
  updateDemoAccountPassword,
} from "../../lib/reset-pass";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [verifiedIdentifier, setVerifiedIdentifier] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return undefined;

    const redirectTimer = window.setTimeout(
      () => router.replace("/auth/signin"),
      1400,
    );
    return () => window.clearTimeout(redirectTimer);
  }, [router, success]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!resetCode) {
      try {
        const account = findDemoAccount(identifier);
        if (!account) {
          setError("No account found");
          return;
        }

        setVerifiedIdentifier(account.email || account.username);
        setResetCode(generateDemoResetCode());
      } catch (readError) {
        setError(
          readError instanceof Error
            ? readError.message
            : "The account could not be read.",
        );
      }
      return;
    }

    if (enteredCode !== resetCode) {
      setError("That code doesn't match. Try again.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (!updateDemoAccountPassword(verifiedIdentifier, password)) {
        setError("No account found");
        return;
      }

      setSuccess(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The new password could not be saved.",
      );
    }
  };

  return (
    <main className="policy-screen">
      <article className="policy-card fake-reset-card">
        <FoodieBaiBrand />
        <span className="auth-kicker">ACCOUNT HELP</span>

        {success ? (
          <section aria-live="polite" className="fake-reset-success">
            <h1>Password reset complete</h1>
            <p>Your password has been updated. Redirecting to sign in…</p>
          </section>
        ) : (
          <section className="fake-reset-content">
            <h1>{resetCode ? "Reset your password" : "Forgot password?"}</h1>
            <form
              className="fake-reset-form"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="field-label">
                <label htmlFor="reset-identifier">Email or username</label>
                <span className="field-wrap">
                  <AppIcon name="mail" size={18} />
                  <input
                    autoComplete="username"
                    autoFocus
                    id="reset-identifier"
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Email or username"
                    readOnly={Boolean(resetCode)}
                    required
                    value={identifier}
                  />
                </span>
              </div>
              {!resetCode && (
                <p className="fake-reset-hint">
                  Use the email or username from an account created with Sign
                  up.
                </p>
              )}
              {resetCode && (
                <>
                  <div className="fake-reset-code" role="status">
                    <strong>Verification code: {resetCode}</strong>
                    <span>In a real app this would be emailed.</span>
                  </div>
                  <div className="field-label">
                    <label htmlFor="reset-code">Enter the 6-digit code</label>
                    <span className="field-wrap">
                      <AppIcon name="lock" size={18} />
                      <input
                        autoComplete="one-time-code"
                        autoFocus
                        id="reset-code"
                        inputMode="numeric"
                        maxLength={6}
                        onChange={(event) =>
                          setEnteredCode(event.target.value.replace(/\D/g, ""))
                        }
                        pattern="[0-9]{6}"
                        placeholder="000000"
                        required
                        value={enteredCode}
                      />
                    </span>
                  </div>
                  {[
                    {
                      id: "reset-new-password",
                      label: "New password",
                      value: password,
                      setValue: setPassword,
                    },
                    {
                      id: "reset-confirm-password",
                      label: "Confirm password",
                      value: confirmPassword,
                      setValue: setConfirmPassword,
                    },
                  ].map((field) => (
                    <div className="field-label" key={field.id}>
                      <label htmlFor={field.id}>{field.label}</label>
                      <span className="field-wrap">
                        <AppIcon name="lock" size={18} />
                        <input
                          autoComplete="new-password"
                          id={field.id}
                          minLength={6}
                          onChange={(event) =>
                            field.setValue(event.target.value)
                          }
                          placeholder="At least 6 characters"
                          required
                          type={showPasswords ? "text" : "password"}
                          value={field.value}
                        />
                        {field.id === "reset-new-password" && (
                          <button
                            aria-label={
                              showPasswords
                                ? "Hide passwords"
                                : "Show passwords"
                            }
                            aria-pressed={showPasswords}
                            className="password-toggle"
                            onClick={() =>
                              setShowPasswords((visible) => !visible)
                            }
                            type="button"
                          >
                            <AppIcon
                              name={showPasswords ? "eyeOff" : "eye"}
                              size={18}
                            />
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="primary-button" type="submit">
                {resetCode ? "Reset password" : "Continue"}
                <AppIcon name="arrowRight" size={18} />
              </button>
            </form>
          </section>
        )}

        <Link className="primary-button fake-reset-back" href="/auth/signin">
          <AppIcon name="back" size={17} /> Back to sign in
        </Link>
      </article>
    </main>
  );
}
