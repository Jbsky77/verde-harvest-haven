
import { useState } from 'react';
import { generateInitialSpaces, initialFertilizers } from '../../initialData';
import { Alert, CultivationSpace, Fertilizer, PlantVariety, RoomType } from '@/types';
import { CultivationSession } from '../../types';

export const useCultivationState = () => {
  const [spaces, setSpaces] = useState(generateInitialSpaces);
  const [varieties, setVarieties] = useState<PlantVariety[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [fertilizers, setFertilizers] = useState(initialFertilizers);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(1);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<CultivationSession[]>([]);
  const [currentSession, setCurrentSessionState] = useState<CultivationSession | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>("flowering");
  const [isLoading, setIsLoading] = useState(true);

  const getSpacesByRoomType = (roomType: RoomType) => {
    return spaces.filter(space => space.roomType === roomType);
  };

  return {
    spaces, 
    setSpaces,
    varieties, 
    setVarieties,
    alerts, 
    setAlerts,
    fertilizers, 
    setFertilizers,
    selectedSpaceId, 
    setSelectedSpaceId,
    selectedPlantIds, 
    setSelectedPlantIds,
    sessions, 
    setSessions,
    currentSession, 
    setCurrentSessionState,
    selectedRoomType, 
    setSelectedRoomType,
    isLoading, 
    setIsLoading,
    getSpacesByRoomType
  };
};
