import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FIELD_LABELS } from "@/constants/fields";

interface ReportUploadProps {
  onValuesExtracted: (values: Record<string, string>, missing: string[]) => void;
}

const ReportUpload = ({ onValuesExtracted }: ReportUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [extractedCount, setExtractedCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setMissingFields([]);
      setExtractedCount(null);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setError(null);

    try {
      const text = await file.text();

      // ✅ Split into lines (MAIN FIX)
      const lines = text.split("\n").map((l) => l.trim().toLowerCase());

      const allFields = Object.keys(FIELD_LABELS);
      const extracted: Record<string, string> = {};
      const missing: string[] = [];

      for (const field of allFields) {
        const label = FIELD_LABELS[field].toLowerCase().split("(")[0].trim();
        let found = false;

        for (const line of lines) {
          if (!line) continue;

          const patterns = [
            new RegExp(`^${field}\\s*[=:;]\\s*(.+)$`, "i"),
            new RegExp(`^${label}\\s*[=:;]\\s*(.+)$`, "i"),
          ];

          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
              extracted[field] = match[1].trim();
              found = true;
              break;
            }
          }

          if (found) break;
        }

        if (!found) {
          missing.push(field);
        }
      }

      setExtractedCount(Object.keys(extracted).length);
      setMissingFields(missing);
      onValuesExtracted(extracted, missing);

      if (Object.keys(extracted).length === 0) {
        setError(
          "Could not extract any values. Try structured format like 'bp = 120'."
        );
      }
    } catch {
      setError("Failed to read the file.");
    } finally {
      setIsExtracting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setMissingFields([]);
    setExtractedCount(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-6 mb-8 max-w-3xl mx-auto"
    >
      <h3 className="text-lg font-heading font-semibold mb-1 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Upload Medical Report
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Upload a medical report (.txt, .csv) and we'll try to extract values automatically.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <label className="flex-1 w-full cursor-pointer">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 bg-background/50 transition-colors">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate">
              {file ? file.name : "Choose a file..."}
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.csv,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {file && (
          <div className="flex gap-2">
            <Button onClick={handleExtract} disabled={isExtracting} size="sm" className="gap-2">
              {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {isExtracting ? "Extracting..." : "Extract Values"}
            </Button>
            <Button onClick={clearFile} variant="ghost" size="icon" className="h-9 w-9">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {extractedCount !== null && !error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Extracted <strong>{extractedCount}</strong> of {Object.keys(FIELD_LABELS).length} values
              </span>
            </div>

            {missingFields.length > 0 && (
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm font-medium text-accent mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Missing values — please fill manually:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingFields.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/20"
                    >
                      {FIELD_LABELS[f]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportUpload;
