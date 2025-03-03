
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type NotesFieldProps = {
  notes?: string;
  onChange: (notes: string) => void;
};

export const NotesField = ({ notes, onChange }: NotesFieldProps) => {
  return (
    <div>
      <Label htmlFor="notes">Notes</Label>
      <Input 
        id="notes" 
        value={notes || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
