import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const TOOLTIP_INFO: Record<string, string> = {
    age: "Normal: 1–120 years",
    bp: "Normal: 90–120 mmHg",
    sg: "Allowed: 1.005, 1.010, 1.015, 1.020, 1.025",
    al: "Normal: 0–5",
    su: "Normal: 0–5",
    bgr: "Normal: 70–140 mg/dL",
    bu: "Normal: 7–20 mg/dL",
    sc: "Normal: 0.6–1.2 mg/dL",
    sod: "Normal: 135–145 mEq/L",
    pot: "Normal: 3.5–5.0 mEq/L",
    hemo: "Normal: 13–17 g/dL",
    pcv: "Normal: 36–54 %",
    wc: "Normal: 4000–11000 cells/cumm",
    rc: "Normal: 4.5–6.0 million/cmm",
};

export const TooltipField = ({ field }: { field: string }) => {
    if (!TOOLTIP_INFO[field]) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="ml-2 cursor-pointer text-muted-foreground">
                        <Info size={14} />
                    </span>
                </TooltipTrigger>

                <TooltipContent>
                    <p className="text-xs">{TOOLTIP_INFO[field]}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};