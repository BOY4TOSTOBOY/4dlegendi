import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { CommonAuthService } from "src/app/core/services/common/common-auth/common-auth.service";
import { BaseDestroyComponent } from "src/app/shared/components/base-destroy/base-destroy.component";

import {map, mergeMap, takeUntil, tap} from "rxjs/operators";
import {ELEMENT_NEWS, NEWS_ID_KEY} from "src/app/shared/utils/constants";
import { QuestionService } from "src/app/core/services/question/question.service";
import { StateService, Transition } from "@uirouter/angular";
import { Observable, of } from "rxjs";
import {log} from "util";
import {element} from "protractor";
interface user {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
}
@Component({
  selector: "news-card",
  templateUrl: "./news-card.component.html",
  styleUrls: ["./news-card.component.scss"],
})
export class NewsCardComponent extends BaseDestroyComponent implements OnInit {
  @Input() errors: { id: number; error: string }[];
  @Input() requiredLength: number;
  @Input() criteria: string[] = [];
  @Output() newsRemoved = new EventEmitter<string>();
  @Output() newsAdded = new EventEmitter<string>();
  @Output() updatePollnews = new EventEmitter<{ id: number; text: string }[]>();

  @HostListener("window:keyup.enter") onKeyUp() {

    this._checkingElements(this.text);

  }
  @ViewChild("newsParamsContainer") newsParamsContainer: ElementRef;

  elements: { id?: number; text: string }[] = [];
  news_id = localStorage.getItem(NEWS_ID_KEY);
  newsList: string = "";
  List: {text:string}[]= [];

  idCounter = 1;
  params:number;
  text: string = "";

  id: number;

  checkElements: { element: any; user: number };

  userProfile: user;

  constructor(
    private stateService: StateService,
    private commonAuthService: CommonAuthService,
    private questionService: QuestionService,
    private toastrService: ToastrService,
    private trans: Transition
  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;
  }

  user: {
    id: number;
  };

  ngOnInit() {

    const user = this.userProfile.id;

    let params = this.trans.targetState().params();

    if (params.element === undefined) {
    this.getElement()
      return
    }
    if (params) {
      this.getElement(params.element.id)
      // this.elements = params.element.elements.map((element, index) => ({id: index+1, text: element}));
      // this.elements = params
      //patch
    }
  }
  getElement(params?){
if(params){

  this.questionService.getElement(params).subscribe((el) => {
    console.log(el)
    // @ts-ignore
    this.elements = el.valueOf()

  })
}else {
  params = localStorage.getItem(NEWS_ID_KEY)
  this.questionService.getElement(params).subscribe((el) => {

    // @ts-ignore
    this.elements = el.valueOf()
  })
}

  }
  getTooltip(): string {
    return this.criteria && this.criteria.length
      ? this.criteria.join(";\n")
      : "";
  }

  getErrorMessage(elementsId: number) {

    if (elementsId) {
      const errorObject = _.find(
        this.errors,
        (error) => error.id === elementsId
      );
      return errorObject ? errorObject.error : "";
    }

    return "";
  }




  goToNews(){
    this.stateService.go("app.news")

  }
  private _checkingElements(text){
    if (this.text && this.userProfile && this.news_id) {
      const preparedAnswerData = {
        news_id: Number(this.news_id),
        elements: [{ text:this.text}],
        user: this.userProfile.id,
      };
      this.questionService
          .checkElements(preparedAnswerData).pipe(
          takeUntil(this.destroy$),
          mergeMap((response: any) => {
            if (!response.ok) {
              this.errors = response;
              this.toastrService.error(
                  "У вас есть вариант ответов неверного формата, введите существительное"
              );}
            else {
              return this.saveElements();
            }
          })
      ).subscribe((res)=> {
        if (this.text === "") {
        } else {
          // @ts-ignore
          this.List.push({
            text: text
          })
          this.text = "";
        }
        if (text) {
          if (!this.elements) {
            this.elements = [];
          }
          this.elements.push({
            text: text,
          });
        } else {
          this.toastrService.info("Нельзя отправить пустой ответ");
        }
      })
    }
  }
  checkingForATransition(){
  if (this.elements && this.userProfile && this.news_id) {
    const preparedAnswerData = {
      news_id: Number(this.news_id),
      elements: this.elements,
      user: this.userProfile.id,
    };
    if (preparedAnswerData.elements.length){
      console.log(preparedAnswerData)
      this.questionService
          .checkElements(preparedAnswerData).pipe(
          takeUntil(this.destroy$),
          tap((response: any) => {
            if (!response.ok) {
              this.errors = response;
              this.toastrService.error(
                  "У вас есть варианты ответов неверного формата"
              );

              return of(null);
            } else
            {
              this.stateService.go("app.news")
            }

          }))

          .subscribe();
    }
    else {
      this.toastrService.error(
          "Нельзя отправить пустое поле, введите слово"
      );
    }
    }

  }


  private saveElements() {
    const preparedAnswerData = {
      news_id: Number(this.news_id),
      // elements: this.elements.map((element) => element.text),
      elements: [this.text],
      user: this.userProfile.id,
    };

    return this.questionService.saveElements(preparedAnswerData).pipe(
        takeUntil(this.destroy$),
        map(()=>{
          return this.getElement(this.params);
        })
  )}


  deleteNews(news) {

    this.questionService.deleteElementById(news.id).subscribe()
    let index = this.elements.indexOf(news);
    this.elements.splice(index, 1);
  }

}
