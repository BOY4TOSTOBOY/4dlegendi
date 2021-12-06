import { OnInit } from "@angular/core";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { QuestionService } from "../../../../core/services/question/question.service";
import { BaseDestroyComponent } from "../../../../shared/components/base-destroy/base-destroy.component";
import { takeUntil, tap } from "rxjs/operators";
import { LOCAL_STORAGE_ROLE_KEY } from "src/app/shared/utils/localStorageKeys";

@Component({
  selector: "role",
  templateUrl: "./role.component.html",
  styleUrls: ["./role.component.scss"],
})
export class RoleComponent extends BaseDestroyComponent implements OnInit {
  @Input() isFirstPoll: boolean;
  @Output() startPollEvent = new EventEmitter<number>();

  pollListRole = [];
  constructor(private questionService: QuestionService) {
    super();
  }

  ngOnInit() {
    this._pollListRole();
  }

  startPoll(role_id: number) {
    this.startPollEvent.emit(role_id);
    localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, String(role_id));
  }

  private _pollListRole() {
    return this.questionService
      .pollListRole()
      .pipe(
        takeUntil(this.destroy$),
        tap((response: any) => {
          if (response) {
            this.pollListRole = response;
          }
        })
      )
      .subscribe();
  }
}
