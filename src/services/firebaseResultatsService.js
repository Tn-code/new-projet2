import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'resultats5S';

export const saveResultatsData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      uap: data.uap,
      ligne: data.ligne,
      semaines: data.semaines || {},
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Erreur sauvegarde Résultats:", error);
    throw error;
  }
};

export const getAllResultatsData = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uap', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération Résultats:", error);
    throw error;
  }
};

export const getResultatsByUAP = async (uap) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('uap', '==', uap));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération par UAP:", error);
    throw error;
  }
};

export const updateResultatsData = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id, ...data };
  } catch (error) {
    console.error("Erreur mise à jour Résultats:", error);
    throw error;
  }
};

export const deleteResultatsData = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erreur suppression Résultats:", error);
    throw error;
  }
};
