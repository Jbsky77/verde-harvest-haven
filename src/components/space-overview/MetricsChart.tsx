
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from "recharts";

interface MetricsChartProps {
  averageEC: number;
  averagePH: number;
  showAllSpaces?: boolean;
}

export const MetricsChart = ({ averageEC, averagePH, showAllSpaces = false }: MetricsChartProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: "#06b6d4" }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#06b6d4]"></span>
          Moyennes EC & pH
        </CardTitle>
        <CardDescription>Valeurs moyennes{showAllSpaces ? " globales" : " pour cet espace"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'EC', value: averageEC },
                { name: 'pH', value: averagePH }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 'dataMax + 1']} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, '']} />
              <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                {[
                  { name: 'EC', value: averageEC },
                  { name: 'pH', value: averagePH }
                ].map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#06b6d4' : '#9b87f5'} 
                  />
                ))}
                <LabelList dataKey="value" position="top" formatter={(value) => value.toFixed(2)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
