import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcardComponent } from './qcard.component';

describe('QcardComponent', () => {
  let component: QcardComponent;
  let fixture: ComponentFixture<QcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
