import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) alert(error.message);
        else navigate("/predict");
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin,
            },
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="flex items-center justify-center pt-24 pb-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 w-full max-w-md space-y-6"
                >
                    <h2 className="text-2xl font-bold text-center">Login</h2>

                    <Input
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button onClick={handleLogin} className="w-full">
                        Login
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        OR
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                    >
                        Continue with Google
                    </Button>

                    <p className="text-sm text-center">
                        Don’t have an account?{" "}
                        <span
                            className="text-primary cursor-pointer"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </span>
                    </p>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;