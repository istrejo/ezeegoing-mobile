import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChargerFormPage } from './charger-form.page';

describe('ChargerFormPage', () => {
  let component: ChargerFormPage;
  let fixture: ComponentFixture<ChargerFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargerFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
