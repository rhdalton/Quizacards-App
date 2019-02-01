import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QresultComponent } from './qresult.component';

describe('QresultComponent', () => {
  let component: QresultComponent;
  let fixture: ComponentFixture<QresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
