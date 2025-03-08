
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PlantState } from "@/types";
import { stateColors } from "./utils";
import { useTranslation } from "react-i18next";

interface PlantStateChartProps {
  plantsByState: Record<PlantState, number>;
}

export const PlantStateChart = ({ plantsByState }: PlantStateChartProps) => {
  const { t } = useTranslation();
  
  const plantStateData = Object.entries(plantsByState).map(([state, count]) => ({
    name: t(`plantState.states.${state}`),
    value: count,
    color: stateColors[state as PlantState]
  }));

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: "#9b87f5" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#9b87f5]"></span>
          {t('plantState.title')}
        </CardTitle>
        <CardDescription>{t('plantState.distribution')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={plantStateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {plantStateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} plantes`, '']} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
