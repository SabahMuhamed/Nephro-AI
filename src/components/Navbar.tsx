import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Predict" },
  { to: "/disease-info", label: "Disease Info" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [username, setUsername] = useState<string>("");

  // 🔥 FETCH USERNAME FROM SUPABASE
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        return;
      }

      if (data?.full_name) {
        setUsername(data.full_name);
      }
    };

    fetchProfile();
  }, [user]);

  // 🔐 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">N</span>
          </div>
          <span className="font-heading font-bold text-lg glow-text">
            NephroAI
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors ${location.pathname === link.to
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {user ? (
            <>
              {/* 👤 USERNAME FROM DB */}
              <span className="text-sm font-medium text-primary">
                👤
              </span>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-primary/10"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;