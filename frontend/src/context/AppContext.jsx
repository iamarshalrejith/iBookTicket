import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setIsAdmin(false);
        setAdminCheckComplete(true);
        return;
      }

      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsAdmin(data.isAdmin);
      setAdminCheckComplete(true);
    } catch (error) {
      console.error("Error checking admin:", error);
      setIsAdmin(false);
      setAdminCheckComplete(true);
    }
  };

  useEffect(() => {
    if (!userLoaded || !authLoaded) return; 
    if (user?.id) {
      setAdminCheckComplete(false);
      setIsAdmin(null);
      fetchIsAdmin();
    } else {
      setIsAdmin(false);
      setAdminCheckComplete(true);
    }
  }, [user, userLoaded, authLoaded]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        adminCheckComplete,
        shows,
        favoriteMovies,
        fetchIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
