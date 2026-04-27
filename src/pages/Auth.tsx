import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                navigate("/predict");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="flex items-center justify-center pt-24 pb-20 px-6">
                <div className="glass-card p-8 w-full max-w-md">

                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        providers={["google"]}
                        theme="dark"
                        view="sign_in"
                        additionalData={{
                            full_name: "",
                        }}
                    />

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AuthPage;