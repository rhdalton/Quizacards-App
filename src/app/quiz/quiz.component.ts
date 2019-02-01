import { Component, OnInit } from '@angular/core';
import { Quiz } from '../models/quiz';
import { Card } from '../models/card';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NetworkClass } from '../network';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quiz: Quiz;
  quiz_type: string;
  card: Card;
  cards: Card[];
  currentCard = 0;
  totalCards = 0;
  totalCorrect = 0;
  quizDone = false;
  correct_audio = new Audio();
  incorrect_audio = new Audio();

  constructor(
    private db: FirebaseService,
    private route: ActivatedRoute,
    private storage: Storage,
    private _net: NetworkClass) {
    this.quiz = {};
    this.quiz_type = this.route.snapshot.params.type;
    this.quiz.id = this.route.snapshot.params.id;
  }

  async ngOnInit() {
    this.loadQuizSounds();
    await this.getQuizFromStorage();
    this.startQuiz();
  }

  getQuizFromStorage() {
    // get quiz and cards from Storage
    // if not exist, get quiz and cards from Firebase and add to storage
    return new Promise(resolve => {
      this.storage.get(this.quiz.id).then(quiz => {
        if (quiz) {
          this.quiz = JSON.parse(quiz);
          console.log('Quiz: ' + this.quiz.id + ' loaded from local storage...');
          this.getCardsFromStorage().then(() => resolve());
        } else
        // check if user is online to download Quiz Cards from Firebase
        if (this._net.onlineStatus) {
          this.getQuizFromFirebase().then(() => {
            this.storage.set(this.quiz.id, JSON.stringify(this.quiz)).then(() => {
              console.log('Quiz: ' + this.quiz.id + ' loaded from firebase and set to local storage...');
              this.getCardsFromStorage().then(() => resolve());
            });
          });
        // If not online, alert Offline message
        } else {
          this._net.alertOffline();
        }
      });
    });
  }

  async getCardsFromStorage() {
    return new Promise(resolve => {
      this.storage.get(this.quiz.id + '-cards').then(cards => {
        if (cards) {
          this.cards = JSON.parse(cards);
          console.log('Cards loaded from storage...');
          resolve();
        } else {
          this.getCardsFromFirebase()
            .then(() => {
              // save cards to storage
              this.storage.set(this.quiz.id + '-cards', JSON.stringify(this.cards))
                .then(() => {
                  console.log('Cards loaded from firebase and saved to storage...');
                  resolve();
              });
            });
        }
      });
    });
  }

  async getQuizFromFirebase() {
    return this.db.getQuiz(this.quiz.id).ref.get().then((quiz) => {
      this.quiz.quizname = quiz.data().quizname;
      this.quiz.answerchoices = quiz.data().answerchoices;
    });
  }

  async getCardsFromFirebase() {
    this.cards = (await this.db.getCards(this.quiz.id)).docs.map(e => {
      return {
        id: e.id,
        ...e.data()
      } as Card;
    });
  }

  async startQuiz() {
    this.currentCard = 0;
    this.totalCorrect = 0;
    this.totalCards = this.cards.length;
    if (this.quiz_type === 'quiz') {
      this.cards = this.randomSortArray(this.cards);
      this.card = this.cards[0];
      this.randomSortAnswers();
    } else {
      this.card = this.cards[0];
    }
    this.textSmall();
    this.quizDone = false;
    console.log('quizloaded: ' + this.quiz_type + ', ' + this.quiz.id);
  }

  randomSortAnswers() {
    // Get all possible answer choices from quiz, and format into array
    let allChoices = this.quiz.answerchoices.split('|');
    // randomize the array of choices
    allChoices = this.randomSortArray(allChoices);

    // put the correct answer at beginning of answer choices array
    let answerChoices = [];
    answerChoices.push([0, this.card.c_correct]);
    // loop through 3 times to add random wrong answers to answerChoices
    let x = 1;
    while (x <= 3) {
      let take = allChoices.pop();
      if (take !== this.card.c_correct) {
        answerChoices.push([x, take]);
        x++;
      }
    }

    // Now randomize the 4 choices, so the correct answer is not always first
    answerChoices = this.randomSortArray(answerChoices);

    // Put the random array of choices to Choice view while still tracking the correct choice
    this.card.c_viewalist = [];
    for (let i = 0; i < answerChoices.length; i++) {
      this.card.c_viewalist.push(answerChoices[i][1]);
        if (answerChoices[i][0] === 0) this.card.c_viewacorrect = i;
    }
  }

  loadQuizSounds() {
    this.correct_audio.src = '../assets/sounds/UI_Quirky19.mp3';
    this.correct_audio.load();
    this.incorrect_audio.src = '../assets/sounds/UI_Quirky33.mp3';
    this.incorrect_audio.load();
  }

  nextCard() {
    this.currentCard++;
    if (this.currentCard === this.totalCards) {
      this.quizDone = true;
      return;
    }
    return new Promise((resolve) => {
      this.card = this.cards[this.currentCard];
      this.textSmall();
      if (this.quiz_type === 'quiz') this.randomSortAnswers();
      resolve();
    });
  }

  prevCard() {
    return new Promise((resolve) => {
      this.card = this.cards[--this.currentCard];
      this.textSmall();
      resolve();
    });
  }

  textSmall() {
    if (this.card.c_text.length > 7) this.card.smalltext = true;
    else this.card.smalltext = false;
  }

  retakeQuiz(quiz_type) {
    this.quiz_type = quiz_type;
    this.startQuiz();
  }

  randomSortArray(array) {
    return array.sort(function() { return 0.5 - Math.random(); });
  }
}
