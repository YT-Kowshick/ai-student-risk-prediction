import { motion } from "framer-motion";
import { BrainCircuit, Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-10"
    >
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse-ring" />
          <div className="relative bg-gradient-to-br from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
            <BrainCircuit className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-accent px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI Powered</span>
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
        Student Risk Prediction
        <span className="block mt-1 gradient-text">Dashboard</span>
      </h1>
      
      <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        ML & NLP powered academic risk analysis for smarter educational decisions
      </p>
    </motion.header>
  );
};
