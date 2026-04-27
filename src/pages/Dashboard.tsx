import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    ckd: 0,
    avgConfidence: 0,
  });
  const [trend, setTrend] = useState<any[]>([]);

  // 🚀 REAL-TIME FETCH
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (!data) return;

      setPatients(data);

      // 🔥 STATS
      let total = data.length;
      let ckd = data.filter((p) => p.prediction?.toLowerCase() === "ckd").length;
      let avg =
        data.reduce((sum, p) => sum + p.confidence, 0) / (total || 1);

      setStats({
        total,
        ckd,
        avgConfidence: avg,
      });

      // 🔥 TREND
      const map: any = {};
      data.forEach((p) => {
        const d = new Date(p.created_at).toLocaleDateString();

        if (!map[d]) map[d] = { date: d, value: 0 };

        map[d].value++;
      });

      setTrend(Object.values(map));
    };

    fetchData();

    // 🔥 AUTO REFRESH (REAL-TIME FEEL)
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* TITLE */}
          <motion.div className="mb-10">
            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time analytics of your predictions
            </p>
          </motion.div>

          {/* ================= STATS ================= */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">

            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">Total Predictions</p>
              <h2 className="text-3xl font-bold">{stats.total}</h2>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">CKD Detected</p>
              <h2 className="text-3xl font-bold text-red-500">
                {stats.ckd}
              </h2>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
              <h2 className="text-3xl font-bold text-green-500">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </h2>
            </div>

          </div>

          {/* ================= CHART ================= */}
          <div className="glass-card p-6 mb-12">
            <h3 className="mb-4 font-semibold">Prediction Activity</h3>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ================= HISTORY ================= */}
          <div className="glass-card p-6">
            <h3 className="mb-4 font-semibold">Recent Patients</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3">Result</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.slice(-10).reverse().map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{p.patient_name}</td>
                      <td className="p-3">
                        {p.prediction?.toLowerCase() === "ckd" ? (
                          <span className="text-red-500">CKD</span>
                        ) : (
                          <span className="text-green-500">Normal</span>
                        )}
                      </td>
                      <td className="p-3">
                        {p.confidence.toFixed(2)}%
                      </td>
                      <td className="p-3">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;