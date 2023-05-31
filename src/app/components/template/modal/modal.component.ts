import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  @Input() public banco;
  @Input() public status:boolean = false;
  @Input() public mensagem:string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor( public modalA:NgbActiveModal ){}

  ngOnInit(): void {}

  passBack() {
    this.passEntry.emit(this.banco);
    this.passEntry.emit(this.status);
    this.passEntry.emit(this.mensagem);
    this.modalA.close();
  }

}
