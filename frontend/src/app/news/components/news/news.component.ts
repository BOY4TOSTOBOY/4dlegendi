import { Component, Input, OnInit } from "@angular/core";
import { StateService } from "@uirouter/angular";
import { QuestionService } from "src/app/core/services/question/question.service";

import { mergeMap, takeUntil, tap } from "rxjs/operators";
import { BaseDestroyComponent } from "src/app/shared/components/base-destroy/base-destroy.component";
import { CommonAuthService } from "src/app/core/services/common/common-auth/common-auth.service";
import {ELEMENT_NEWS, NEWS_ID_KEY} from "src/app/shared/utils/constants";
import {BehaviorSubject, of, throwError} from "rxjs";
import { ToastrService } from "ngx-toastr";
import {element} from "protractor";

interface user {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
  role:number;
}

@Component({
  selector: "news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent extends BaseDestroyComponent implements OnInit {
  @Input() errors: { id: number; error: string }[];

  question:number;
  news_id = localStorage.getItem(NEWS_ID_KEY);
  userProfile: user;
  getNewsList = new BehaviorSubject([]);

  isLoading = false;

  constructor(
    private stateService: StateService,
    private questionService: QuestionService,
    private commonAuthService: CommonAuthService,
    private toastrService: ToastrService
  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;
  }

  user: {
    id: number;
  };

  ngOnInit() {

    const user = this.userProfile.id;
    this._question();
    this._getNewsList();
  }

  private _question() {
    if (this.userProfile.role === 1) {
    this.question = 3;
    } else if (this.userProfile.role === 2) {
      this.question = 10;
    } else if (this.userProfile.role === 3) {
      this.question = 17;
    }
}
  private _getNewsList() {
     this.questionService.getNewsList().subscribe((res) => {
      this.getNewsList.next(res)

    });
  }
    endEvents(){
      this.questionService.getEndEvents().subscribe()
    }
  goToNews(element: any) {
    this.isLoading = true;

    if (this.getNewsList) {
    this.endEvents()
      const preparedElementsData = { news_id: [element.id] };
      this.questionService
        .createNews(preparedElementsData)
        .pipe(
          takeUntil(this.destroy$),
          mergeMap((response: any) => {
            if (!response.ok) {
              this.errors = response;
              this.toastrService.error(
                "У вас есть варианты ответов неверного формата"
              );

              return throwError("error");
            }

            const preparedAnswerData = {
              news_id: [Number(this.news_id)],
            };

            return this.questionService.generateNews();
          }),

          tap(() => {
            this.stateService.go("app.event-review");
          })
        )
        .subscribe();
    }
  }

  editElement(element: any) {

    localStorage.setItem(NEWS_ID_KEY, element.id);
    this.stateService.go("app.news-card", { element: element });


  }



  deleteElement(element) {
    let index = this.getNewsList.value.indexOf(element);
    this.getNewsList.value.splice(index, 1);

    if (element) {
      this.questionService.deleteNewsElementById(element.id).subscribe();
    }
  }

  goToCreateNews() {
    if (this.question && this.userProfile) {
      const preparedElementsData = {
        user: this.userProfile.id,
        question: this.question,
      };
      this.questionService
        .newsCreation(preparedElementsData)
        .pipe(
          takeUntil(this.destroy$),
          tap((response: any) => {})
        )
        .subscribe((res) => {
          localStorage.setItem(NEWS_ID_KEY, res.news_id);
          this.stateService.go("app.news-card");
        });
    }
  }
}
