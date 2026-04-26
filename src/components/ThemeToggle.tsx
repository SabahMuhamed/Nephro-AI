import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
      )}
    </Button>
  );
};

export default ThemeToggle;
