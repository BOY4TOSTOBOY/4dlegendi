import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'save-dialog-button',
  templateUrl: './save-dialog-button.component.html',
  styleUrls: ['./save-dialog-button.component.scss']
})
export class SaveDialogButtonComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() label: string;
  @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  submitClick() {
    this.onClick.emit(true);
  }
}
