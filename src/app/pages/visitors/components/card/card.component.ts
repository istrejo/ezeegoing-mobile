import { Component, Input, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Visitor } from 'src/app/core/models/visitor.state';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() visitor!: Visitor;
  faUser = faUser;

  constructor() {}

  ngOnInit() {}

  deleteVisitor() {
    throw new Error('Method not implemented.');
  }
  editVisitor() {
    throw new Error('Method not implemented.');
  }
}
