import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";

interface ExplanationCardProps {
  reasons: string[];
  delay?: number;
}

export const ExplanationCard = ({ reasons, delay = 0 }: ExplanationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-elevated p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-accent p-2.5 rounded-xl">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Risk Explanation</h3>
          <p className="text-sm text-muted-foreground">Key factors influencing the prediction</p>
        </div>
      </div>

      <div className="space-y-3">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.1 * (index + 1) }}
            className="flex items-start gap-3 p-3 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-colors"
          >
            <div className="flex-shrink-0 mt-0.5">
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{reason}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
