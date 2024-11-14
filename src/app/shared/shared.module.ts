import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './components/input/input.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { ControlValueAccessorDirective } from './directives/control-value-accessor/control-value-accessor.directive';
import { ReactiveFormsModule } from '@angular/forms';

const components = [InputComponent, ValidationErrorsComponent];
const directives = [ControlValueAccessorDirective];

@NgModule({
  declarations: [...components, ...directives],
  imports: [CommonModule, IonicModule, FontAwesomeModule, ReactiveFormsModule],
  exports: [...components, ...directives],
})
export class SharedModule {}
