import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PredictionForm } from "@/components/dashboard/PredictionForm";
import { ResultCard } from "@/components/dashboard/ResultCard";
import { ExplanationCard } from "@/components/dashboard/ExplanationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { Brain, Activity } from "lucide-react";
import { usePredictionHistory } from "@/contexts/PredictionHistoryContext";
import { predictRisk } from "@/services/api";

interface PredictionResult {
  risk: "Good" | "Average" | "At-Risk";
  sentiment: "Positive" | "Neutral" | "Negative";
  reasons: string[];
}

const Index = () => {
  const { addPrediction } = usePredictionHistory();
  const [marks, setMarks] = useState("");
  const [attendance, setAttendance] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate inputs
    const marksNum = parseInt(marks);
    const attendanceNum = parseInt(attendance);

    if (marksNum < 0 || marksNum > 100) {
      toast.error("Marks must be between 0 and 100");
      setIsLoading(false);
      return;
    }

    if (attendanceNum < 40 || attendanceNum > 100) {
      toast.error("Attendance must be between 40 and 100");
      setIsLoading(false);
      return;
    }

    try {
      console.log("=== Submitting Prediction ===");
      console.log(`Marks: ${marksNum}, Attendance: ${attendanceNum}, Feedback: ${feedback}`);
      
      const data = await predictRisk({
        marks: marksNum,
        attendance: attendanceNum,
        feedback: feedback,
      });

      console.log("=== Prediction Success ===");
      console.log("Response:", data);
      
      setResult(data);
      
      // Auto-save to history
      addPrediction({
        marks: marksNum,
        attendance: attendanceNum,
        feedback: feedback,
        risk: data.risk,
        sentiment: data.sentiment,
        reasons: data.reasons
      });
      
      toast.success("Prediction completed successfully!");
    } catch (err) {
      console.error("=== Prediction Error ===");
      console.error("Error object:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to the prediction API";
      console.error("Error message:", errorMessage);
      
      setError(errorMessage);
      toast.error("Failed to get prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Student Risk Prediction
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI-powered early warning system to identify students at risk using Machine Learning and Natural Language Processing
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Real-time Analysis</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div>
            <PredictionForm
              marks={marks}
              attendance={attendance}
              feedback={feedback}
              isLoading={isLoading}
              onMarksChange={setMarks}
              onAttendanceChange={setAttendance}
              onFeedbackChange={setFeedback}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error ? (
                <ErrorState 
                  key="error"
                  message={error} 
                  onRetry={handleRetry} 
                />
              ) : result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ResultCard 
                    type="risk" 
                    value={result.risk} 
                    delay={0} 
                  />
                  <ResultCard 
                    type="sentiment" 
                    value={result.sentiment} 
                    delay={0.1} 
                  />
                  {result.reasons && result.reasons.length > 0 && (
                    <ExplanationCard 
                      reasons={result.reasons} 
                      delay={0.2} 
                    />
                  )}
                </motion.div>
              ) : (
                <EmptyState key="empty" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Powered by Machine Learning & Natural Language Processing
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
