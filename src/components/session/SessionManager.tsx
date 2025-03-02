
import { useState } from "react";
import { useCultivation } from "@/context/CultivationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Edit, Trash2, Check } from "lucide-react";
import SessionDialog from "./SessionDialog";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SessionManager = () => {
  const { 
    sessions, 
    currentSession, 
    setCurrentSession, 
    deleteSession, 
    endCultivationSession, 
    varieties 
  } = useCultivation();
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateSession = () => {
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (session: any) => {
    setEditingSession(session);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
  };

  const confirmDeleteSession = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
      
      toast({
        title: "Session supprimée",
        description: "La session a été supprimée avec succès.",
        variant: "default",
      });
    }
  };

  const handleSetCurrentSession = (sessionId: string) => {
    setCurrentSession(sessionId);
    toast({
      title: "Session active mise à jour",
      description: "La session sélectionnée est maintenant active.",
      variant: "default",
    });
  };

  const handleEndSession = (sessionId: string) => {
    endCultivationSession(sessionId);
    toast({
      title: "Session terminée",
      description: "La session a été marquée comme terminée.",
      variant: "default",
    });
  };

  const getVarietyNameById = (id: string) => {
    const variety = varieties.find(v => v.id === id);
    return variety ? variety.name : "Inconnue";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des sessions</h2>
        <Button onClick={handleCreateSession}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Nouvelle session
        </Button>
      </div>

      {currentSession && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-800 text-lg">
              Session active: {currentSession.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-2">
              Date de début: {formatDate(currentSession.startDate)}
            </p>
            {currentSession.selectedVarieties && currentSession.selectedVarieties.length > 0 && (
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">Variétés incluses:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentSession.selectedVarieties.map((varietyId: string) => {
                    const variety = varieties.find(v => v.id === varietyId);
                    return variety ? (
                      <Badge 
                        key={varietyId} 
                        style={{ backgroundColor: variety.color, color: "#fff" }}
                        className="text-xs"
                      >
                        {variety.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditSession(currentSession)}
              >
                <Edit className="mr-1 h-3 w-3" />
                Modifier
              </Button>
              {currentSession.isActive && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEndSession(currentSession.id)}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Terminer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Toutes les sessions ({sessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                Aucune session créée. Commencez par créer une nouvelle session.
              </p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id} className={`
                    overflow-hidden
                    ${currentSession?.id === session.id ? 'border-green-300' : ''}
                    ${!session.isActive ? 'bg-gray-50' : ''}
                  `}>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {session.name}
                            {!session.isActive && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Terminée
                              </Badge>
                            )}
                            {currentSession?.id === session.id && (
                              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                Active
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Début: {formatDate(session.startDate)}
                            {session.endDate && ` - Fin: ${formatDate(session.endDate)}`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {session.id !== currentSession?.id && session.isActive && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleSetCurrentSession(session.id)}
                              title="Définir comme session active"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditSession(session)}
                            title="Modifier la session"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteSession(session.id)}
                            title="Supprimer la session"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {session.selectedVarieties && session.selectedVarieties.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Variétés:</p>
                          <div className="flex flex-wrap gap-1">
                            {session.selectedVarieties.map((varietyId: string) => {
                              const variety = varieties.find(v => v.id === varietyId);
                              return variety ? (
                                <Badge 
                                  key={varietyId} 
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {variety.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {session.id !== currentSession?.id && session.isActive && (
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSetCurrentSession(session.id)}
                          >
                            Définir comme session active
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => handleEndSession(session.id)}
                          >
                            Terminer la session
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <SessionDialog 
        open={isSessionDialogOpen} 
        onOpenChange={setIsSessionDialogOpen} 
      />

      <SessionDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        isEditing={true}
        currentSession={editingSession}
      />

      <AlertDialog open={sessionToDelete !== null} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSession}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionManager;
