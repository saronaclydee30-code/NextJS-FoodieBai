import ProtectedAppLayout from "../components/shared/ProtectedAppLayout";

// These routes are client-interactive screens backed by browser session state.
// Opt the shared segment out of Cache Components instant-navigation validation.
export const instant = false;

export default function AppLayout({ children }) {
  return <ProtectedAppLayout>{children}</ProtectedAppLayout>;
}

