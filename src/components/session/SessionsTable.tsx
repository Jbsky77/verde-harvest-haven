
import { useCultivation } from "@/context/CultivationContext";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check, CalendarPlus } from "lucide-react";
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

interface SessionsTableProps {
  formatDateToLocale: (date: Date | null) => string;
}

const SessionsTable = ({ formatDateToLocale }: SessionsTableProps) => {
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
  
  const activeSessions = sessions.filter(session => session.isActive);

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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sessions de culture en cours ({activeSessions.length})</h2>
        <Button onClick={handleCreateSession}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Nouvelle session
        </Button>
      </div>

      {activeSessions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Variétés</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeSessions.map((session) => (
              <TableRow key={session.id} className={currentSession?.id === session.id ? 'bg-green-50' : ''}>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell>{formatDateToLocale(new Date(session.startDate))}</TableCell>
                <TableCell>
                  {session.selectedVarieties && session.selectedVarieties.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {session.selectedVarieties.map((varietyId: string) => {
                        const variety = varieties.find(v => v.id === varietyId);
                        return variety ? (
                          <Badge 
                            key={varietyId} 
                            style={{ backgroundColor: variety.color, color: "#fff" }}
                            className="text-xs whitespace-nowrap"
                          >
                            {variety.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Aucune variété</span>
                  )}
                </TableCell>
                <TableCell>
                  {currentSession?.id === session.id ? (
                    <Badge className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-700">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {session.id !== currentSession?.id && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetCurrentSession(session.id)}
                        title="Définir comme session active principale"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Principale
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditSession(session)}
                      title="Modifier la session"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleEndSession(session.id)}
                      title="Terminer la session"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Terminer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-muted-foreground">
            Aucune session en cours. Commencez par créer une nouvelle session.
          </p>
        </div>
      )}

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

export default SessionsTable;
