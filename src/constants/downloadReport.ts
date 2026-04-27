import jsPDF from "jspdf";

interface ReportData {
    patient_name: string;
    ckd_detected: string;
    confidence: number;
    risk_level: string;
    inputs: Record<string, any>;
    warnings: string[];
    recommendations: string[];
}

export const downloadReportPDF = (result: ReportData) => {
    const pdf = new jsPDF();

    const pageWidth = 210;
    let y = 10;

    // =========================
    // HEADER
    // =========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("CKD Medical Report", pageWidth / 2, y, { align: "center" });

    y += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(`Patient: ${result.patient_name}`, 10, y);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 140, y);

    y += 10;

    // =========================
    // RESULT SUMMARY
    // =========================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    pdf.text(
        `Diagnosis: ${result.ckd_detected === "Yes" ? "CKD Detected" : "No CKD"}`,
        10,
        y
    );

    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Confidence: ${result.confidence}%`, 10, y);

    y += 10;

    // =========================
    // TABLE HEADER
    // =========================
    pdf.setFont("helvetica", "bold");
    pdf.text("Test", 10, y);
    pdf.text("Value", 80, y);
    pdf.text("Status", 140, y);

    y += 5;

    pdf.setLineWidth(0.3);
    pdf.line(10, y, 200, y);

    y += 5;

    // =========================
    // TABLE DATA
    // =========================
    pdf.setFont("helvetica", "normal");

    const getStatus = (key: string, value: number) => {
        if (key === "bp" && value > 140) return "High";
        if (key === "sc" && value > 1.5) return "Critical";
        if (key === "hemo" && value < 10) return "Low";
        return "Normal";
    };

    const FIELD_NAMES: Record<string, string> = {
        age: "Age",
        bp: "Blood Pressure",
        sg: "Specific Gravity",
        al: "Albumin",
        su: "Sugar",
        bgr: "Blood Glucose",
        bu: "Blood Urea",
        sc: "Creatinine",
        sod: "Sodium",
        pot: "Potassium",
        hemo: "Hemoglobin",
        pcv: "Packed Cell Volume",
        wc: "WBC",
        rc: "RBC",
    };

    Object.entries(result.inputs).forEach(([key, value]) => {
        if (y > 270) {
            pdf.addPage();
            y = 10;
        }

        const label = FIELD_NAMES[key] || key;
        const status = getStatus(key, value);

        pdf.text(label, 10, y);
        pdf.text(String(value), 80, y);
        pdf.text(status, 140, y);

        y += 6;
    });

    y += 5;

    // =========================
    // WARNINGS
    // =========================
    if (result.warnings?.length) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Warnings:", 10, y);
        y += 6;

        pdf.setFont("helvetica", "normal");

        result.warnings.forEach((w) => {
            if (y > 270) {
                pdf.addPage();
                y = 10;
            }
            pdf.text(`• ${w}`, 10, y);
            y += 5;
        });

        y += 5;
    }

    // =========================
    // RECOMMENDATIONS
    // =========================
    if (result.recommendations?.length) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Recommendations:", 10, y);
        y += 6;

        pdf.setFont("helvetica", "normal");

        result.recommendations.forEach((r) => {
            if (y > 270) {
                pdf.addPage();
                y = 10;
            }
            pdf.text(`• ${r}`, 10, y);
            y += 5;
        });
    }

    // =========================
    // FOOTER
    // =========================
    pdf.setFontSize(8);
    pdf.text(
        "This is not a medical diagnosis. Please consult a doctor.",
        10,
        285
    );

    // =========================
    // SAVE FILE (WITH NAME)
    // =========================
    const filename = `CKD_Report_${result.patient_name.replace(/\s+/g, "_")}.pdf`;

    pdf.save(filename);
};