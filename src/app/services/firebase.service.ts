import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFirestore) { }

  getAppVersion() {
    return this.db.collection('appversion').doc('version');
  }

  getQuizs() {
    return this.db.collection('quizcards').ref;
  }
  getQuiz(id) {
    return this.db.collection('quizcards').doc(id);
  }

  getCards(id) {
    return this.db.collection('cards')
      .ref
      .where('quiz_id', '==', id)
      .orderBy('sortorder')
      .get();
  }
}
