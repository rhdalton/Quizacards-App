import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-qresult',
  templateUrl: './qresult.component.html',
  styleUrls: ['./qresult.component.scss']
})
export class QresultComponent implements OnInit {
  quiz_id;
  quiz_type;
  totalcards;
  totalcorrect;

  constructor(private quiz: QuizComponent, private router: Router) {
    this.quiz_id = quiz.quiz.id;
    this.quiz_type = quiz.quiz_type;
    this.totalcards = quiz.totalCards;
    this.totalcorrect = quiz.totalCorrect;
  }

  ngOnInit() {
  }
  retakeQuiz(quiz_type) {
    this.quiz.retakeQuiz(quiz_type);
  }

  returnHome() {
    this.router.navigate(['/home']);
  }
}
