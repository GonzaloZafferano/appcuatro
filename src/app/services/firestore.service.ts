import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, addDoc, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

import { Firestore, collectionData, collection, } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ganador } from '../models/ganador';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private ganadores: CollectionReference<DocumentData> =
    collection(this.firestore, 'ganadores');
    private ganadoresMedio: CollectionReference<DocumentData> =
    collection(this.firestore, 'ganadoresMedio');
    private ganadoresDificil: CollectionReference<DocumentData> =
    collection(this.firestore, 'ganadoresDificil');

  constructor(private firestore: Firestore) { }

  guardar(ganador: Ganador) {
    const documentoNuevo = doc(this.ganadores);
    const nuevoId = documentoNuevo.id;

    setDoc(documentoNuevo, {
      nombre: ganador.usuario,
      milisegundos: ganador.milisegundos,
      segundos: ganador.segundos,
      fecha: ganador.fecha,
      id: nuevoId
    });
  }

  obtenerGanadores() {
    let coleccion = collection(this.firestore, 'ganadores');

    let q = query(coleccion);

    return collectionData(q);
  }

  eliminarGanador(id: string) {
    const coleccion = collection(this.firestore, 'ganadores');
    const documento = doc(coleccion, id);
    deleteDoc(documento);
  }

//Medio
  guardarMedio(ganador: Ganador) {
    const documentoNuevo = doc(this.ganadoresMedio);
    const nuevoId = documentoNuevo.id;

    setDoc(documentoNuevo, {
      nombre: ganador.usuario,
      milisegundos: ganador.milisegundos,
      segundos: ganador.segundos,
      fecha: ganador.fecha,
      id: nuevoId
    });
  }

  obtenerGanadoresMedio() {
    let coleccion = collection(this.firestore, 'ganadoresMedio');

    let q = query(coleccion);

    return collectionData(q);
  }

  eliminarGanadorMedio(id: string) {
    const coleccion = collection(this.firestore, 'ganadoresMedio');
    const documento = doc(coleccion, id);
    deleteDoc(documento);
  }

  //Dificil
  guardarDificil(ganador: Ganador) {
    const documentoNuevo = doc(this.ganadoresDificil);
    const nuevoId = documentoNuevo.id;

    setDoc(documentoNuevo, {
      nombre: ganador.usuario,
      milisegundos: ganador.milisegundos,
      segundos: ganador.segundos,
      fecha: ganador.fecha,
      id: nuevoId
    });
  }

  obtenerGanadoresDificil() {
    let coleccion = collection(this.firestore, 'ganadoresDificil');

    let q = query(coleccion);

    return collectionData(q);
  }

  eliminarGanadorDificil(id: string) {
    const coleccion = collection(this.firestore, 'ganadoresDificil');
    const documento = doc(coleccion, id);
    deleteDoc(documento);
  }
}
