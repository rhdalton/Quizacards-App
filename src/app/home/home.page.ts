import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Quiz } from '../models/quiz';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NetworkClass } from '../network';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  appv;
  localappv;
  Quizes: Quiz[];

  constructor(
    private db: FirebaseService,
    private storage: Storage,
    private router: Router,
    private _net: NetworkClass) { }

  async ngOnInit() {
    //await this.clearStorage();
    // Get quizes from local Storage
    // If not exist, get quizes from Firebase and add them to local Storage
    this.storage.get('quizlist').then(quizes => {
      if (quizes) {
        this.Quizes = JSON.parse(quizes);
        console.log('Quizes loaded from local storage...');
      } else
      if (this._net.onlineStatus) {
        this.getQuizesFromFirebase().then(() => {
          this.storage.set('quizlist', JSON.stringify(this.Quizes)).then(() => {
            console.log('Quizes loaded from Firebase and set in local storage...');
          });
        });
      } else {
        this._net.alertOffline();
      }
    });
  }

  async getCurrentAppVersion() {
    await this.db.getAppVersion().ref.get().then(v => {
      this.appv = v.data().name;
    });
  }

  async getQuizesFromFirebase() {
    this.Quizes = (await this.db.getQuizs()
    .where('quizactive', '==', true)
    .orderBy('sortorder')
    .get()).docs.map(e => {
      return {
        id: e.id,
        quizname: e.data().quizname
      } as Quiz;
    });
  }

  loadQuiz(quiz_type, quiz_id) {
    this.router.navigate(['/quiz', quiz_type, quiz_id]);
  }

  clearStorage() {
    return new Promise(resolve => {
      this.storage.clear().then(() => resolve());
    });
  }
}
