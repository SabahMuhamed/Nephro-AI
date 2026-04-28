import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FIELD_LABELS } from "@/constants/fields";

const ReportUpload = ({ onValuesExtracted }: { onValuesExtracted: (v: any, m: string[]) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedCount, setExtractedCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:5000/extract-report", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");

      // We don't normalize keys here because the backend already returns correct keys
      const missing = Object.keys(FIELD_LABELS).filter((k) => !data[k]);
      onValuesExtracted(data, missing);
      setExtractedCount(Object.keys(data).length);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto rounded-2xl border border-primary/20 bg-card shadow-lg shadow-primary/5 overflow-hidden"
    >
      {/* Dynamic Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between text-primary-foreground">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5" />
          <h3 className="font-bold tracking-tight">AI Report Analysis</h3>
        </div>
        {isExtracting && <Loader2 className="animate-spin w-4 h-4" />}
      </div>

      <div className="p-8">
        <div
          onClick={() => !isExtracting && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all flex flex-col items-center justify-center
            ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/50'}
            cursor-pointer`}
        >
          <input type="file" ref={inputRef} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Upload Medical Report</p>
                <p className="text-sm text-muted-foreground mt-1">PDF or Scanned Image</p>
              </motion.div>
            ) : (
              <motion.div key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <p className="font-bold text-primary truncate max-w-[200px]">{file.name}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-3 text-xs font-bold text-destructive hover:underline flex items-center gap-1 mx-auto"
                >
                  <X size={12} /> Remove File
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleExtract}
            disabled={!file || isExtracting}
            className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all"
          >
            {isExtracting ? "Processing Lab Values..." : "Analyze & Auto-fill Form"}
          </Button>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {extractedCount !== null && !error && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={18} /> Extraction Successful
              </span>
              <span className="font-bold">{extractedCount} fields filled</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportUpload;