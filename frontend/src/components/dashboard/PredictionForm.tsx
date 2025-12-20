import { motion } from "framer-motion";
import { GraduationCap, Calendar, MessageSquareText, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PredictionFormProps {
  marks: string;
  attendance: string;
  feedback: string;
  isLoading: boolean;
  onMarksChange: (value: string) => void;
  onAttendanceChange: (value: string) => void;
  onFeedbackChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PredictionForm = ({
  marks,
  attendance,
  feedback,
  isLoading,
  onMarksChange,
  onAttendanceChange,
  onFeedbackChange,
  onSubmit,
}: PredictionFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card-elevated p-6 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Student Information</h2>
        <p className="text-sm text-muted-foreground">Enter academic data for risk analysis</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Marks Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            Academic Marks
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(e) => onMarksChange(e.target.value)}
              placeholder="Enter marks (0-100)"
              className="input-field w-full pr-12"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
              / 100
            </span>
          </div>
        </div>

        {/* Attendance Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Attendance Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              min="40"
              max="100"
              value={attendance}
              onChange={(e) => onAttendanceChange(e.target.value)}
              placeholder="Enter attendance (40-100)"
              className="input-field w-full pr-10"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
              %
            </span>
          </div>
        </div>

        {/* Feedback Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MessageSquareText className="w-4 h-4 text-primary" />
            Teacher Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="Enter teacher's feedback about the student..."
            rows={4}
            className="input-field w-full resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gradient"
          size="xl"
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Predict Student Risk
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};
