
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plant, PlantState, PlantVariety } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCultivation } from "@/context/CultivationContext";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, QrCode, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantQRCode from "@/components/plants/PlantQRCode";

type PlantDetailsProps = {
  plant?: Plant;
  onUpdate?: (plant: Plant) => void;
  standalone?: boolean;
};

const stateOptions: { value: PlantState; label: string }[] = [
  { value: "germination", label: "Germination" },
  { value: "growth", label: "Croissance" },
  { value: "flowering", label: "Floraison" },
  { value: "drying", label: "Séchage" },
  { value: "harvested", label: "Récolté" }
];

const PlantDetails = ({ plant, onUpdate, standalone = false }: PlantDetailsProps) => {
  const { varieties, getEstimatedFloweringDate, getEstimatedHarvestDate, currentSession, getPlantById } = useCultivation();
  const [formState, setFormState] = useState<Plant | null>(plant || null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();
  
  // Base URL for QR code - in a production environment, this would be your deployed URL
  const baseUrl = window.location.origin;
  
  useEffect(() => {
    if (standalone && plantId) {
      const foundPlant = getPlantById(plantId);
      if (foundPlant) {
        setFormState(foundPlant);
      }
    }
  }, [standalone, plantId, getPlantById]);

  // If we're in standalone mode but no plant was found, show a message
  if (standalone && !formState) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-xl font-bold">Plante non trouvée</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            La plante que vous recherchez n'a pas été trouvée. Vérifiez l'URL ou retournez à la page précédente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!formState) return null;
  
  const handleChange = (field: keyof Plant, value: any) => {
    setFormState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
        lastUpdated: new Date()
      };
    });
  };
  
  const handleVarietyChange = (varietyId: string) => {
    const selectedVariety = varieties.find(v => v.id === varietyId);
    if (selectedVariety) {
      setFormState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          variety: selectedVariety,
          lastUpdated: new Date()
        };
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState && onUpdate) {
      onUpdate(formState);
    }
  };
  
  const floweringDate = getEstimatedFloweringDate(formState.id);
  const harvestDate = getEstimatedHarvestDate(formState.id);
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Non disponible";
    return format(date, "PPP", { locale: fr });
  };
  
  // Show automated state transition info only if we have an active session
  const showAutomationInfo = currentSession && currentSession.isActive;
  
  // Wrapper component styling based on standalone mode
  const containerClass = standalone 
    ? "container max-w-2xl mx-auto p-6" 
    : "w-full";

  return (
    <div className={containerClass}>
      {standalone && (
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-xl font-bold">
            Détails de la plante: {formState.variety.name}
          </h1>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="details" className="flex items-center gap-1">
            Détails
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-1">
            <QrCode className="h-4 w-4" />
            QR Code
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {showAutomationInfo && (
              <Alert className="bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Transitions automatiques</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  Les états de la plante passeront automatiquement de germination à croissance puis à floraison en fonction des temps définis pour cette variété.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="space">Espace</Label>
                <Input 
                  id="space" 
                  value={`Espace ${formState.position.space}`} 
                  disabled 
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  value={`L${formState.position.row} - C${formState.position.column}`} 
                  disabled 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="variety">Variété</Label>
                <Select 
                  value={formState.variety.id}
                  onValueChange={handleVarietyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une variété" />
                  </SelectTrigger>
                  <SelectContent>
                    {varieties.map(variety => (
                      <SelectItem 
                        key={variety.id} 
                        value={variety.id}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: variety.color }} 
                          />
                          <span>{variety.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="state">État</Label>
                <Select 
                  value={formState.state}
                  onValueChange={(value: PlantState) => handleChange("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un état" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map(option => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="ec">EC</Label>
                  <span className="text-sm font-medium">{formState.ec.toFixed(2)}</span>
                </div>
                <Slider
                  id="ec"
                  min={0.5}
                  max={2.5}
                  step={0.01}
                  value={[formState.ec]}
                  onValueChange={(values) => handleChange("ec", values[0])}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="ph">pH</Label>
                  <span className="text-sm font-medium">{formState.ph.toFixed(2)}</span>
                </div>
                <Slider
                  id="ph"
                  min={5.0}
                  max={7.0}
                  step={0.01}
                  value={[formState.ph]}
                  onValueChange={(values) => handleChange("ph", values[0])}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  value={formState.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
              
              {/* Dates estimées */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Floraison estimée</Label>
                  <p className="text-sm font-medium">{formatDate(floweringDate)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Récolte estimée</Label>
                  <p className="text-sm font-medium">{formatDate(harvestDate)}</p>
                </div>
              </div>
            </div>
            
            {!standalone && onUpdate && (
              <div className="flex justify-end gap-2 pt-2">
                <Button type="submit">Enregistrer</Button>
              </div>
            )}
          </form>
        </TabsContent>
        
        <TabsContent value="qrcode">
          <PlantQRCode plant={formState} baseUrl={baseUrl} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantDetails;
