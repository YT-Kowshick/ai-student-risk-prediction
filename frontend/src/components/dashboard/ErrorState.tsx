import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card-elevated p-6 border-2 border-destructive/20 bg-destructive/5"
    >
      <div className="flex items-start gap-4">
        <div className="bg-destructive/10 p-2.5 rounded-xl">
          <AlertCircle className="w-5 h-5 text-destructive" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Prediction Failed
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {message}
          </p>
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
