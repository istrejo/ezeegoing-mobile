import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservePage } from './reserve.page';

describe('ReservePage', () => {
  let component: ReservePage;
  let fixture: ComponentFixture<ReservePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
