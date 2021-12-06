import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
@Component({
  selector: "finish-panel",
  templateUrl: "./finish-panel.component.html",
  styleUrls: [
    "./finish-panel.component.scss",
    "../../styles/login.styles.scss",
  ],
})
export class FinishPanelComponent {
  @Output() goToAuthPageEvent = new EventEmitter();
  @Output() goToProceedEvent = new EventEmitter();

  click: boolean = false;

  goToAuthPage() {
    this.goToAuthPageEvent.emit();
  }
  goToProceed() {
    this.click = !this.click;
    this.goToProceedEvent.emit();
  }
}
