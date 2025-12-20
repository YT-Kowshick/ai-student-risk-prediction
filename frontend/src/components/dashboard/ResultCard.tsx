import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  type: "risk" | "sentiment";
  value: string;
  delay?: number;
}

const riskConfig = {
  Good: {
    icon: ShieldCheck,
    bgClass: "bg-risk-good-bg",
    textClass: "text-risk-good",
    borderClass: "border-risk-good/20",
    label: "Low Risk",
    description: "Student is performing well",
  },
  Average: {
    icon: Shield,
    bgClass: "bg-risk-average-bg",
    textClass: "text-risk-average",
    borderClass: "border-risk-average/20",
    label: "Medium Risk",
    description: "Needs attention",
  },
  "At-Risk": {
    icon: ShieldAlert,
    bgClass: "bg-risk-atrisk-bg",
    textClass: "text-risk-atrisk",
    borderClass: "border-risk-atrisk/20",
    label: "High Risk",
    description: "Immediate intervention needed",
  },
};

const sentimentConfig = {
  Positive: {
    icon: TrendingUp,
    bgClass: "bg-sentiment-positive-bg",
    textClass: "text-sentiment-positive",
    borderClass: "border-sentiment-positive/20",
    label: "Positive Sentiment",
    description: "Feedback tone is encouraging",
  },
  Neutral: {
    icon: Minus,
    bgClass: "bg-sentiment-neutral-bg",
    textClass: "text-sentiment-neutral",
    borderClass: "border-sentiment-neutral/20",
    label: "Neutral Sentiment",
    description: "Feedback tone is balanced",
  },
  Negative: {
    icon: TrendingDown,
    bgClass: "bg-sentiment-negative-bg",
    textClass: "text-sentiment-negative",
    borderClass: "border-sentiment-negative/20",
    label: "Negative Sentiment",
    description: "Feedback indicates concerns",
  },
};

export const ResultCard = ({ type, value, delay = 0 }: ResultCardProps) => {
  const config = type === "risk" 
    ? riskConfig[value as keyof typeof riskConfig] 
    : sentimentConfig[value as keyof typeof sentimentConfig];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "card-elevated p-6 border-2",
        config.borderClass
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl", config.bgClass)}>
          <Icon className={cn("w-6 h-6", config.textClass)} />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {type === "risk" ? "Risk Level" : "Feedback Sentiment"}
          </p>
          <h3 className={cn("text-2xl font-bold", config.textClass)}>
            {value}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {config.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
