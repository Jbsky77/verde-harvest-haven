
import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  DocumentData,
  CollectionReference
} from 'firebase/firestore';
import { PlantVariety, Fertilizer, CultivationSpace, Plant } from '@/types';

// Définition des collections
export const COLLECTIONS = {
  VARIETIES: 'varieties',
  FERTILIZERS: 'fertilizers',
  CULTIVATION_SPACES: 'cultivation_spaces',
  SESSIONS: 'sessions',
  PLANTS: 'plants'
};

// Fonctions génériques CRUD
export const addDocument = async <T extends DocumentData>(
  collectionName: string, 
  data: T, 
  id?: string
): Promise<string> => {
  try {
    if (id) {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, { ...data, createdAt: new Date() });
      return id;
    } else {
      const docRef = doc(collection(db, collectionName));
      await setDoc(docRef, { ...data, createdAt: new Date() });
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

export const getDocument = async <T>(
  collectionName: string, 
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

export const getCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string, 
  id: string, 
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { ...data, updatedAt: new Date() });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string, 
  id: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Fonctions spécifiques aux entités

// Variétés de plantes
export const addVariety = async (variety: Omit<PlantVariety, 'id'>): Promise<string> => {
  return addDocument(COLLECTIONS.VARIETIES, variety);
};

export const getVarieties = async (): Promise<PlantVariety[]> => {
  return getCollection<PlantVariety>(COLLECTIONS.VARIETIES);
};

export const getVariety = async (id: string): Promise<PlantVariety | null> => {
  return getDocument<PlantVariety>(COLLECTIONS.VARIETIES, id);
};

export const updateVariety = async (id: string, data: Partial<PlantVariety>): Promise<void> => {
  return updateDocument(COLLECTIONS.VARIETIES, id, data);
};

export const deleteVariety = async (id: string): Promise<void> => {
  return deleteDocument(COLLECTIONS.VARIETIES, id);
};

// Fertilisants
export const addFertilizer = async (fertilizer: Omit<Fertilizer, 'id'>): Promise<string> => {
  return addDocument(COLLECTIONS.FERTILIZERS, fertilizer);
};

export const getFertilizers = async (): Promise<Fertilizer[]> => {
  return getCollection<Fertilizer>(COLLECTIONS.FERTILIZERS);
};

export const getFertilizer = async (id: string): Promise<Fertilizer | null> => {
  return getDocument<Fertilizer>(COLLECTIONS.FERTILIZERS, id);
};

export const updateFertilizer = async (id: string, data: Partial<Fertilizer>): Promise<void> => {
  return updateDocument(COLLECTIONS.FERTILIZERS, id, data);
};

export const deleteFertilizer = async (id: string): Promise<void> => {
  return deleteDocument(COLLECTIONS.FERTILIZERS, id);
};

// Espaces de culture
export const addCultivationSpace = async (space: Omit<CultivationSpace, 'id'>): Promise<string> => {
  return addDocument(COLLECTIONS.CULTIVATION_SPACES, space);
};

export const getCultivationSpaces = async (): Promise<CultivationSpace[]> => {
  return getCollection<CultivationSpace>(COLLECTIONS.CULTIVATION_SPACES);
};

export const updateCultivationSpace = async (id: string, data: Partial<CultivationSpace>): Promise<void> => {
  return updateDocument(COLLECTIONS.CULTIVATION_SPACES, id, data);
};

// Sessions de culture
export const addSession = async (session: any): Promise<string> => {
  return addDocument(COLLECTIONS.SESSIONS, session);
};

export const getSessions = async (): Promise<any[]> => {
  return getCollection(COLLECTIONS.SESSIONS);
};

export const getSession = async (id: string): Promise<any | null> => {
  return getDocument(COLLECTIONS.SESSIONS, id);
};

export const updateSession = async (id: string, data: any): Promise<void> => {
  return updateDocument(COLLECTIONS.SESSIONS, id, data);
};

export const deleteSession = async (id: string): Promise<void> => {
  return deleteDocument(COLLECTIONS.SESSIONS, id);
};

// Fonctions pour les plantes
export const addPlant = async (plant: Omit<Plant, 'id'>): Promise<string> => {
  return addDocument(COLLECTIONS.PLANTS, plant);
};

export const updatePlant = async (id: string, data: Partial<Plant>): Promise<void> => {
  return updateDocument(COLLECTIONS.PLANTS, id, data);
};

export const getPlants = async (): Promise<Plant[]> => {
  return getCollection<Plant>(COLLECTIONS.PLANTS);
};

export const getPlantsBySession = async (sessionId: string): Promise<Plant[]> => {
  try {
    const plantsRef = collection(db, COLLECTIONS.PLANTS);
    const q = query(plantsRef, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Plant);
  } catch (error) {
    console.error("Error getting plants by session:", error);
    throw error;
  }
};

export const getPlantsBySpace = async (spaceId: number): Promise<Plant[]> => {
  try {
    const plantsRef = collection(db, COLLECTIONS.PLANTS);
    const q = query(plantsRef, where("position.space", "==", spaceId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Plant);
  } catch (error) {
    console.error("Error getting plants by space:", error);
    throw error;
  }
};
