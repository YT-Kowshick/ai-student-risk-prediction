import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, TrendingUp, Users, AlertTriangle, TrendingDown } from "lucide-react";
import { ChartControls, ChartType } from "@/components/analytics/ChartControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePredictionHistory } from "@/contexts/PredictionHistoryContext";

const Analytics = () => {
  const { predictions } = usePredictionHistory();
  const [selectedCharts, setSelectedCharts] = useState<ChartType[]>([]);

  // Calculate statistics from real prediction data
  const stats = useMemo(() => {
    if (predictions.length === 0) {
      return {
        total: 0,
        atRiskCount: 0,
        atRiskPercentage: 0,
        averageMarks: 0,
        riskDistribution: [],
        marksAnalysis: [],
        attendanceImpact: []
      };
    }

    const atRiskCount = predictions.filter(p => p.risk === 'At-Risk').length;
    const averageMarks = predictions.reduce((sum, p) => sum + p.marks, 0) / predictions.length;

    // Risk distribution
    const riskCounts = {
      Good: predictions.filter(p => p.risk === 'Good').length,
      Average: predictions.filter(p => p.risk === 'Average').length,
      'At-Risk': atRiskCount
    };

    const riskDistribution = [
      { risk: "Good", students: riskCounts.Good, fill: "hsl(142, 76%, 36%)" },
      { risk: "Average", students: riskCounts.Average, fill: "hsl(48, 96%, 53%)" },
      { risk: "At-Risk", students: riskCounts['At-Risk'], fill: "hsl(0, 84%, 60%)" },
    ];

    // Marks analysis by range
    const marksRanges = {
      "0-40": { good: 0, average: 0, atRisk: 0 },
      "41-60": { good: 0, average: 0, atRisk: 0 },
      "61-80": { good: 0, average: 0, atRisk: 0 },
      "81-100": { good: 0, average: 0, atRisk: 0 },
    };

    predictions.forEach(p => {
      let range: keyof typeof marksRanges;
      if (p.marks <= 40) range = "0-40";
      else if (p.marks <= 60) range = "41-60";
      else if (p.marks <= 80) range = "61-80";
      else range = "81-100";

      if (p.risk === 'Good') marksRanges[range].good++;
      else if (p.risk === 'Average') marksRanges[range].average++;
      else marksRanges[range].atRisk++;
    });

    const marksAnalysis = Object.entries(marksRanges).map(([range, counts]) => ({
      range,
      ...counts
    }));

    // Attendance impact
    const attendanceRanges = {
      "40-60%": { good: 0, average: 0, atRisk: 0 },
      "61-75%": { good: 0, average: 0, atRisk: 0 },
      "76-90%": { good: 0, average: 0, atRisk: 0 },
      "91-100%": { good: 0, average: 0, atRisk: 0 },
    };

    predictions.forEach(p => {
      let range: keyof typeof attendanceRanges;
      if (p.attendance <= 60) range = "40-60%";
      else if (p.attendance <= 75) range = "61-75%";
      else if (p.attendance <= 90) range = "76-90%";
      else range = "91-100%";

      if (p.risk === 'Good') attendanceRanges[range].good++;
      else if (p.risk === 'Average') attendanceRanges[range].average++;
      else attendanceRanges[range].atRisk++;
    });

    const attendanceImpact = Object.entries(attendanceRanges).map(([range, counts]) => ({
      range,
      ...counts
    }));

    return {
      total: predictions.length,
      atRiskCount,
      atRiskPercentage: (atRiskCount / predictions.length) * 100,
      averageMarks: Math.round(averageMarks * 10) / 10,
      riskDistribution,
      marksAnalysis,
      attendanceImpact
    };
  }, [predictions]);

  const handleChartToggle = (chart: ChartType) => {
    if (chart === "combined") {
      // If combined is selected, select all individual charts
      if (selectedCharts.includes("combined")) {
        setSelectedCharts([]);
      } else {
        setSelectedCharts(["risk-distribution", "marks-analysis", "attendance-impact"]);
      }
    } else {
      // Toggle individual chart
      setSelectedCharts((prev) => {
        if (prev.includes(chart)) {
          return prev.filter((c) => c !== chart && c !== "combined");
        } else {
          const newCharts = [...prev, chart];
          // If all three individual charts are selected, also mark combined as selected
          if (
            newCharts.includes("risk-distribution") &&
            newCharts.includes("marks-analysis") &&
            newCharts.includes("attendance-impact")
          ) {
            return ["risk-distribution", "marks-analysis", "attendance-impact"];
          }
          return newCharts;
        }
      });
    }
  };

  // Sample data - Risk Distribution
  const riskDistributionData = stats.riskDistribution.length > 0 
    ? stats.riskDistribution 
    : [
      { risk: "Good", students: 450, fill: "hsl(142, 76%, 36%)" },
      { risk: "Average", students: 280, fill: "hsl(48, 96%, 53%)" },
      { risk: "At-Risk", students: 120, fill: "hsl(0, 84%, 60%)" },
    ];

  const totalStudents = riskDistributionData.reduce((acc, curr) => acc + curr.students, 0);

  // Sample data - Marks vs Risk
  const marksAnalysisData = stats.marksAnalysis.length > 0
    ? stats.marksAnalysis
    : [
      { range: "0-40", good: 10, average: 45, atRisk: 95 },
      { range: "41-60", good: 85, average: 125, atRisk: 20 },
      { range: "61-80", good: 245, average: 95, atRisk: 5 },
      { range: "81-100", good: 110, average: 15, atRisk: 0 },
    ];

  // Sample data - Attendance Impact
  const attendanceImpactData = stats.attendanceImpact.length > 0
    ? stats.attendanceImpact
    : [
      { range: "40-60%", good: 15, average: 65, atRisk: 85 },
    { range: "61-75%", good: 95, average: 125, atRisk: 30 },
    { range: "76-90%", good: 220, average: 80, atRisk: 5 },
    { range: "91-100%", good: 120, average: 10, atRisk: 0 },
  ];

  const chartConfig = {
    good: {
      label: "Good",
      color: "hsl(142, 76%, 36%)",
    },
    average: {
      label: "Average",
      color: "hsl(48, 96%, 53%)",
    },
    atRisk: {
      label: "At-Risk",
      color: "hsl(0, 84%, 60%)",
    },
  };

  const shouldShowChart = (chartType: ChartType) => {
    return selectedCharts.includes(chartType);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Risk Analytics
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visual insights powered by ML & NLP to understand risk patterns and make data-driven decisions
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Interactive Data Visualization</span>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-6"
        >
          <Card className="border-2 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total || totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {predictions.length > 0 ? 'From your predictions' : 'Sample data'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                At-Risk Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats.total > 0 ? `${stats.atRiskPercentage.toFixed(1)}%` : '14.1%'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0 ? `${stats.atRiskCount} students` : '120 students'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-blue-500" />
                Average Marks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.total > 0 ? stats.averageMarks : '67.2'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of 100
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Controls */}
        <ChartControls selectedCharts={selectedCharts} onChartToggle={handleChartToggle} />

        {/* Charts Display */}
        <AnimatePresence mode="wait">
          {selectedCharts.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8"
            >
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Charts Selected</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Choose one or more chart types from the controls above to visualize student risk analytics
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="charts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 space-y-6"
            >
              {/* Risk Distribution Chart */}
              {shouldShowChart("risk-distribution") && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-2 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        Risk Distribution
                      </CardTitle>
                      <CardDescription>
                        Overall breakdown of student risk levels across the institution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={riskDistributionData}
                            dataKey="students"
                            nameKey="risk"
                            innerRadius={60}
                            outerRadius={100}
                            strokeWidth={2}
                            stroke="hsl(var(--background))"
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                      >
                                        {totalStudents}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-muted-foreground text-sm"
                                      >
                                        Total Students
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {riskDistributionData.map((item) => (
                          <div
                            key={item.risk}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                          >
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.fill }}
                            ></div>
                            <div>
                              <div className="text-sm font-medium">{item.risk}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.students} students
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Marks vs Risk Level Chart */}
              {shouldShowChart("marks-analysis") && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-2 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        Marks vs Risk Level
                      </CardTitle>
                      <CardDescription>
                        How academic performance correlates with student risk levels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart data={marksAnalysisData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="range"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="good" fill="var(--color-good)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="average" fill="var(--color-average)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="atRisk" fill="var(--color-atRisk)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                      <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Key Insight:</strong> Students scoring below 40% show significantly
                          higher at-risk rates, indicating early intervention opportunities.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Attendance Impact Chart */}
              {shouldShowChart("attendance-impact") && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-2 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Attendance Impact
                      </CardTitle>
                      <CardDescription>
                        Relationship between attendance percentage and student risk
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart data={attendanceImpactData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="range"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="good" fill="var(--color-good)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="average" fill="var(--color-average)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="atRisk" fill="var(--color-atRisk)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                      <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Key Insight:</strong> Attendance below 60% is a strong predictor of
                          at-risk status. Regular attendance monitoring is crucial.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Analytics powered by Machine Learning • Data-driven insights for better outcomes
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Analytics;
