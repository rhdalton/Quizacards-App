import { Component, Input, OnChanges, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';

import { Card } from '../models/card';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-qcard',
  templateUrl: './qcard.component.html',
  styleUrls: ['./qcard.component.scss']
})
export class QcardComponent implements OnChanges {
  @Input('card') card: Card;
  @Input('quiz_type') quiz_type: string;
  cardCount = 0;
  madeChoice = false;
  audioActive = false;
  audioCard;

  constructor(private quiz: QuizComponent, private render: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {
    const newcard: SimpleChange = changes.card;
    this.card = newcard.currentValue;
    this.playAudioCard();
  }

  async selectAnswer(choice, event) {
    // if user already made choice, return
    if (this.madeChoice) return;

    this.madeChoice = true;
    // if choice is correct, highlight correct color and play sound
    if (choice === this.card.c_viewacorrect) {
      this.quiz.totalCorrect++;
      this.render.addClass(event.target, 'correct-answer');
      this.playCorrectAudio();
    // else if incorrect, play incorrect sound
    } else {
      this.render.addClass(event.target, 'incorrect-answer');
      this.playIncorrectAudio();
    }
    // delay one second
    await this.delay(1000);
    // then remove color class and go to next card
    this.render.removeClass(event.target, 'correct-answer');
    this.render.removeClass(event.target, 'incorrect-answer');
    this.toNextCard();
  }

  async toNextCard() {
    // next card, add one to card count, load next card in quiz
    this.cardCount++;
    await this.quiz.nextCard();
    this.madeChoice = false;
  }
  async toPrevCard() {
    this.cardCount--;
    await this.quiz.prevCard();
    this.madeChoice = false;
  }

  nextCard() {
    this.toNextCard();
  }
  prevCard() {
    // if current card is greater than 0, go to prev card
    if (this.quiz.currentCard >= 0) this.toPrevCard();
  }

  playCorrectAudio() {
    this.quiz.correct_audio.play();
  }
  playIncorrectAudio() {
    this.quiz.incorrect_audio.play();
  }

  playAudioCard(ms = 500) {
    if (this.card.c_audio) {
      this.audioCard = new Audio;
      this.audioCard.src = '../assets/sounds/' + this.card.quiz_id + '/' + this.card.c_audio;
      this.audioCard.load();
      this.playAudio(ms);
    }
  }
  async playAudio(ms) {
    await this.delay(ms);
    this.audioActive = true;
    await this.play();
    this.audioActive = false;
  }
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  play() {
    return new Promise((res) => {
      this.audioCard.play();
      this.audioCard.onended = res;
    });
  }

}
