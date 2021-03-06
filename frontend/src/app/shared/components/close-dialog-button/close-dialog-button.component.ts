import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'close-dialog-button',
  templateUrl: './close-dialog-button.component.html',
  styleUrls: ['./close-dialog-button.component.scss']
})
export class CloseDialogButtonComponent implements OnInit {
  @Input() label: string;

  constructor() { }

  ngOnInit() {
  }

}
