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

const COLLECTION_NAME = 'audit5S';

export const saveAuditData = async (data) => {
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
    console.error("Erreur sauvegarde:", error);
    throw error;
  }
};

export const getAllAuditData = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('semaine', 'asc'));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Erreur récupération Audit:", error);
    throw error;
  }
};

export const getAuditDataByWeek = async (week) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('semaine', '==', week));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Erreur récupération semaine:", error);
    throw error;
  }
};

export const updateAuditData = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    return { id, ...data };
  } catch (error) {
    console.error("Erreur mise à jour:", error);
    throw error;
  }
};

export const deleteAuditData = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erreur suppression:", error);
    throw error;
  }
};
