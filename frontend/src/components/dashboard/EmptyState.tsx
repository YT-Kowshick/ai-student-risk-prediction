import { motion } from "framer-motion";
import { LineChart, Users, BookOpen } from "lucide-react";

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-elevated p-8 sm:p-12 text-center"
    >
      <div className="max-w-sm mx-auto">
        {/* Decorative Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-accent p-3 rounded-xl"
          >
            <LineChart className="w-6 h-6 text-primary" />
          </motion.div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="bg-accent p-3 rounded-xl"
          >
            <Users className="w-6 h-6 text-primary" />
          </motion.div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="bg-accent p-3 rounded-xl"
          >
            <BookOpen className="w-6 h-6 text-primary" />
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">
          Ready to Analyze
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Enter student data in the form to get AI-powered risk predictions. 
          Our model analyzes marks, attendance, and feedback sentiment.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
            ML Analysis
          </span>
          <span className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
            NLP Sentiment
          </span>
          <span className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
            Instant Results
          </span>
        </div>
      </div>
    </motion.div>
  );
};
