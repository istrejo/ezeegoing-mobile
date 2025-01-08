import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Visitor } from 'src/app/core/models/visitor.state';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() visitor!: Visitor;
  @Output() deleteVisitor = new EventEmitter();
  @Output() updateVisitor = new EventEmitter();
  faUser = faUser;

  constructor() {}

  ngOnInit() {}

  onDeleteVisitor() {
    this.deleteVisitor.emit(this.visitor.id);
  }
  onUpdateVisitor() {
    this.deleteVisitor.emit(this.visitor.id);
  }
}
