import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

interface AnalyticsSectionProps {
  risk: "Good" | "Average" | "At-Risk";
  marks: number;
  attendance: number;
  delay?: number;
}

const riskColors = {
  Good: "hsl(142, 76%, 36%)",
  Average: "hsl(45, 93%, 47%)",
  "At-Risk": "hsl(0, 84%, 60%)",
};

const riskDistributionConfig = {
  good: { label: "Good", color: riskColors.Good },
  average: { label: "Average", color: riskColors.Average },
  atRisk: { label: "At-Risk", color: riskColors["At-Risk"] },
};

const performanceConfig = {
  risk: { label: "Risk Score", color: "hsl(var(--primary))" },
};

const attendanceConfig = {
  attendance: { label: "Attendance", color: "hsl(var(--primary))" },
};

export const AnalyticsSection = ({
  risk,
  marks,
  attendance,
  delay = 0,
}: AnalyticsSectionProps) => {
  // Risk distribution data - simulate overall distribution with current prediction highlighted
  const riskDistributionData = [
    {
      name: "Good",
      value: risk === "Good" ? 45 : 30,
      fill: riskColors.Good,
    },
    {
      name: "Average",
      value: risk === "Average" ? 40 : 35,
      fill: riskColors.Average,
    },
    {
      name: "At-Risk",
      value: risk === "At-Risk" ? 45 : 35,
      fill: riskColors["At-Risk"],
    },
  ];

  // Performance insight data - how marks relate to risk
  const performanceData = [
    { range: "0-40", riskLevel: 85, fill: riskColors["At-Risk"] },
    { range: "41-60", riskLevel: 55, fill: riskColors.Average },
    { range: "61-80", riskLevel: 30, fill: riskColors.Good },
    { range: "81-100", riskLevel: 10, fill: riskColors.Good },
  ];

  // Highlight current marks range
  const getMarksRange = (marks: number) => {
    if (marks <= 40) return "0-40";
    if (marks <= 60) return "41-60";
    if (marks <= 80) return "61-80";
    return "81-100";
  };

  const currentRange = getMarksRange(marks);

  // Attendance vs Risk scatter data
  const attendanceRiskData = [
    { attendance: 45, risk: 80, z: 100 },
    { attendance: 55, risk: 65, z: 100 },
    { attendance: 65, risk: 45, z: 100 },
    { attendance: 75, risk: 30, z: 100 },
    { attendance: 85, risk: 15, z: 100 },
    { attendance: 95, risk: 5, z: 100 },
    { attendance: attendance, risk: risk === "Good" ? 15 : risk === "Average" ? 50 : 80, z: 200, current: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Visual Analytics
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Risk Distribution Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
        >
          <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={riskDistributionConfig} className="h-[180px]">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke="transparent"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-2">
                {riskDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Insight Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Marks vs Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={performanceConfig} className="h-[180px]">
                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="riskLevel"
                    radius={[4, 4, 0, 0]}
                    name="Risk Level"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        opacity={entry.range === currentRange ? 1 : 0.6}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Current: <span className="font-medium text-foreground">{marks} marks</span> ({currentRange} range)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance vs Risk Scatter Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
        >
          <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Attendance Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={attendanceConfig} className="h-[180px]">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    type="number"
                    dataKey="attendance"
                    domain={[40, 100]}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    name="Attendance"
                  />
                  <YAxis
                    type="number"
                    dataKey="risk"
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    name="Risk"
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 200]} />
                  <ChartTooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border/50 rounded-lg px-3 py-2 shadow-xl">
                          <p className="text-xs text-muted-foreground">
                            Attendance: <span className="font-medium text-foreground">{data.attendance}%</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Risk Level: <span className="font-medium text-foreground">{data.risk}%</span>
                          </p>
                          {data.current && (
                            <p className="text-xs text-primary font-medium mt-1">Current Student</p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Scatter data={attendanceRiskData.filter((d) => !d.current)} fill="hsl(var(--primary))" opacity={0.5} />
                  <Scatter data={attendanceRiskData.filter((d) => d.current)} fill={riskColors[risk]} />
                </ScatterChart>
              </ChartContainer>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Your attendance: <span className="font-medium text-foreground">{attendance}%</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
