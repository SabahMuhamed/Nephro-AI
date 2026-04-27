import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="flex justify-center pt-24">
                <div className="glass-card p-8 w-full max-w-md space-y-4">

                    <h2 className="text-xl font-bold text-center">Login</h2>

                    <Input
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button className="w-full" onClick={handleLogin}>
                        Login
                    </Button>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;