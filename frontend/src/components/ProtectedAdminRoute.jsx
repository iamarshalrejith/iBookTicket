import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { SignIn } from "@clerk/clerk-react";

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, adminCheckComplete } = useAppContext();
  const hasShownToast = useRef(false);

  // Show toast only if admin check complete and user is definitively NOT admin
  useEffect(() => {
    if (adminCheckComplete && user && isAdmin === false && !hasShownToast.current) {
      toast.error("You are not authorized to access the admin dashboard");
      hasShownToast.current = true;
    }
  }, [adminCheckComplete, user, isAdmin]);

  useEffect(() => () => (hasShownToast.current = false), []);

  // ⚡ Loading state
  if (!user || adminCheckComplete === false || isAdmin === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">Verifying admin access...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) return <SignIn fallbackRedirectUrl="/admin" />;

  // Logged in but non-admin
  if (isAdmin === false) return <Navigate to="/" replace />;

  // Admin → allow access
  return children;
};

export default ProtectedAdminRoute;
