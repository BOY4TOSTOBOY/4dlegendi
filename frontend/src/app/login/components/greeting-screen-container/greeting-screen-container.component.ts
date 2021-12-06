import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "greeting-screen-container",
  templateUrl: "./greeting-screen-container.component.html",
  styleUrls: [
    "./greeting-screen-container.component.scss",
    "../../styles/login.styles.scss",
  ],
})
export class GreetingScreenContainerComponent implements OnInit {
  @Input() isFirstPoll: boolean;
  @Output() startPollEvent = new EventEmitter();
  @Output() goToLoginEvent = new EventEmitter();
  @Output() goToFinishEvent = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  startPoll() {
    this.startPollEvent.emit(true);
  }

  goToLogin() {
    this.goToLoginEvent.emit(true);
  }

  goToFinish() {
    this.goToFinishEvent.emit(true);
  }
}
