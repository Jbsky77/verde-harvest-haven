
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

interface VarietyDistributionChartProps {
  varietyDistributionData: Array<{ name: string; count: number }>;
  showAllSpaces?: boolean;
}

export const VarietyDistributionChart = ({ varietyDistributionData, showAllSpaces = false }: VarietyDistributionChartProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: "#f43f5e" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#f43f5e]"></span>
          {t('varieties.distribution')}
        </CardTitle>
        <CardDescription>
          {t('varieties.topVarieties')}{showAllSpaces ? ` ${t('varieties.allSpaces')}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={varietyDistributionData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              layout="vertical"
            >
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              />
              <Tooltip formatter={(value) => [`${value} plantes`, '']} />
              <Bar 
                dataKey="count" 
                fill="#f43f5e" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              >
                <LabelList 
                  dataKey="count" 
                  position="insideRight" 
                  fill="white" 
                  fontWeight="bold" 
                  formatter={(value) => value} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
