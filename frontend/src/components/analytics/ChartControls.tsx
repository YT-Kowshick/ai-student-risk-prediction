import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PieChart, BarChart3, TrendingUp, LayoutGrid } from "lucide-react";

export type ChartType = "risk-distribution" | "marks-analysis" | "attendance-impact" | "combined";

interface ChartControlsProps {
  selectedCharts: ChartType[];
  onChartToggle: (chart: ChartType) => void;
}

export const ChartControls = ({ selectedCharts, onChartToggle }: ChartControlsProps) => {
  const chartOptions = [
    {
      id: "risk-distribution" as ChartType,
      label: "Risk Distribution",
      description: "Student risk levels breakdown",
      icon: PieChart,
      color: "text-purple-500"
    },
    {
      id: "marks-analysis" as ChartType,
      label: "Marks vs Risk Level",
      description: "Performance impact analysis",
      icon: BarChart3,
      color: "text-blue-500"
    },
    {
      id: "attendance-impact" as ChartType,
      label: "Attendance Impact",
      description: "Attendance correlation with risk",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      id: "combined" as ChartType,
      label: "Combined View",
      description: "All charts together",
      icon: LayoutGrid,
      color: "text-orange-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Chart Controls</h3>
            <p className="text-sm text-muted-foreground">
              Select which analytics to visualize
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {chartOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedCharts.includes(option.id);
              
              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }
                  `}
                  onClick={() => onChartToggle(option.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onChartToggle(option.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        <Label className="text-sm font-medium cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {selectedCharts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg"
            >
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Select at least one chart to begin analysis
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
