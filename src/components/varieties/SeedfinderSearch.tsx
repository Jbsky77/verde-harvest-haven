
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Types for Seedfinder varieties
interface SeedfinderVariety {
  name: string;
  breeder: string;
  externalId: string;
  seedfinderUrl: string;
  flowering_time?: number;
  growth_time?: number;
  germination_time?: number;
  genetics?: string;
  thc_content?: string;
  cbd_content?: string;
  effects?: string;
  description?: string;
  image_url?: string;
}

const SeedfinderSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SeedfinderVariety[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState<SeedfinderVariety | null>(null);
  const [addingVariety, setAddingVariety] = useState(false);
  const [addedVarieties, setAddedVarieties] = useState<string[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  // Search for varieties
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      uiToast({
        title: "Terme de recherche requis",
        description: "Veuillez entrer un terme de recherche",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSelectedVariety(null);
    setSearchError(null);

    try {
      console.log("Searching for:", searchTerm);
      
      const { data, error } = await supabase.functions.invoke("search-seedfinder", {
        body: { searchTerm: searchTerm },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Erreur de l'API: ${error.message}`);
      }

      if (data && data.success && Array.isArray(data.data)) {
        console.log("Search results:", data.data.length);
        setSearchResults(data.data);
        if (data.data.length === 0) {
          toast("Aucun résultat trouvé pour ce terme de recherche");
        }
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchError(error instanceof Error ? error.message : "Erreur pendant la recherche");
      toast.error("Erreur de recherche: " + (error instanceof Error ? error.message : "Erreur inconnue"));
    } finally {
      setIsSearching(false);
    }
  };

  // Add a variety to my collection
  const handleAddVariety = async (variety: SeedfinderVariety) => {
    setAddingVariety(true);
    try {
      console.log("Adding variety:", variety.name);
      const { data, error } = await supabase.functions.invoke("add-seedfinder-variety", {
        body: { variety },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Erreur de l'API: ${error.message}`);
      }

      if (data && data.success) {
        setAddedVarieties(prev => [...prev, variety.externalId]);
        toast.success(`La variété "${variety.name}" a été ajoutée à votre collection`);
        
        // Force reload the app context to refresh varieties
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error("Error adding variety:", error);
      toast.error("Erreur: " + (error instanceof Error ? error.message : "Erreur lors de l'ajout de la variété"));
    } finally {
      setAddingVariety(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Recherche Seedfinder.eu</CardTitle>
        <CardDescription>
          Recherchez et ajoutez des variétés depuis la base de données Seedfinder.eu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="search">Recherche</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedVariety}>
              Détails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search-term" className="sr-only">
                  Rechercher une variété
                </Label>
                <Input
                  id="search-term"
                  placeholder="Rechercher une variété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Rechercher
              </Button>
            </div>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {searchError}
              </div>
            )}

            {isSearching && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Recherche en cours...</span>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div>
                <Label className="block mb-2">Résultats ({searchResults.length})</Label>
                <ScrollArea className="h-64 border rounded-md p-2">
                  <div className="space-y-1">
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.externalId || index}`}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                          selectedVariety?.externalId === result.externalId ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedVariety(result)}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{result.name}</div>
                          {result.breeder && (
                            <div className="text-xs text-muted-foreground">
                              {result.breeder}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          {addedVarieties.includes(result.externalId) ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddVariety(result);
                              }}
                              disabled={addingVariety}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selectedVariety && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {selectedVariety.image_url && (
                    <div className="w-full md:w-1/3">
                      <img
                        src={selectedVariety.image_url}
                        alt={selectedVariety.name}
                        className="w-full h-auto rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold">{selectedVariety.name}</h3>
                      {selectedVariety.breeder && (
                        <p className="text-sm text-muted-foreground">
                          Breeder: {selectedVariety.breeder}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedVariety.genetics && (
                        <div>
                          <span className="font-medium">Génétique:</span>{" "}
                          {selectedVariety.genetics}
                        </div>
                      )}
                      {selectedVariety.flowering_time && (
                        <div>
                          <span className="font-medium">Floraison:</span>{" "}
                          {selectedVariety.flowering_time} jours
                        </div>
                      )}
                      {selectedVariety.thc_content && (
                        <div>
                          <span className="font-medium">THC:</span>{" "}
                          {selectedVariety.thc_content}
                        </div>
                      )}
                      {selectedVariety.cbd_content && (
                        <div>
                          <span className="font-medium">CBD:</span>{" "}
                          {selectedVariety.cbd_content}
                        </div>
                      )}
                    </div>

                    {selectedVariety.effects && (
                      <div className="text-sm">
                        <span className="font-medium">Effets:</span> {selectedVariety.effects}
                      </div>
                    )}
                    
                    {selectedVariety.description && (
                      <div className="text-sm mt-2">
                        <span className="font-medium">Description:</span>
                        <p className="mt-1">{selectedVariety.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => handleAddVariety(selectedVariety)}
                    disabled={addingVariety || addedVarieties.includes(selectedVariety.externalId)}
                    className="w-full max-w-xs"
                  >
                    {addingVariety ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Ajout en cours...
                      </>
                    ) : addedVarieties.includes(selectedVariety.externalId) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Déjà ajoutée
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter à ma collection
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Données fournies par Seedfinder.eu. Utilisé uniquement à des fins éducatives.
      </CardFooter>
    </Card>
  );
};

export default SeedfinderSearch;
