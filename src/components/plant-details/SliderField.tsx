
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type SliderFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export const SliderField = ({ 
  id, 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange 
}: SliderFieldProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm font-medium">{value.toFixed(2)}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};
