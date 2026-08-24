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

const COLLECTION_NAME = 'gembaOJT';

export const saveGembaData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      semaine: data.semaine,
      planifie: data.planifie || 0,
      realise: data.realise || 0,
      taux_realisation: data.taux_realisation || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Erreur sauvegarde Gemba:", error);
    throw error;
  }
};

export const getAllGembaData = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('semaine', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération Gemba:", error);
    throw error;
  }
};

export const getGembaDataByWeek = async (week) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('semaine', '==', week));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Erreur récupération semaine Gemba:", error);
    throw error;
  }
};

export const updateGembaData = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id, ...data };
  } catch (error) {
    console.error("Erreur mise à jour Gemba:", error);
    throw error;
  }
};

export const deleteGembaData = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erreur suppression Gemba:", error);
    throw error;
  }
};
