import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiSettings } from "../../../api.settings";
import { map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import {
  NEWS_ID_KEY,
} from 'src/app/shared/utils/constants';
import {LOCAL_STORAGE_PAY_KEY, LOCAL_STORAGE_ROLE_KEY} from 'src/app/shared/utils/localStorageKeys';
@Injectable({
  providedIn: "root",
})
export class QuestionService {
  currentQuestion$$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(protected http: HttpClient) {}

  sendPollAnswers(pollAnswers: string[][]) {
    return this.http.post(
      `${ApiSettings.APP_API}/answers/poll-results/`,
      pollAnswers
    );
  }

  pollListRole() {
    return this.http
      .get(`${ApiSettings.USER_API}/role/`)
      .pipe(
        map((response: any) =>
          response.results.map((question, index) => ({ ...question, index }))
        )
      );
  }

  getQuestionsList() {

    const role_id = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY);

    return this.http
      .get(
        `${ApiSettings.APP_API}/questions/?role=${role_id}&question__version=true`
      )
      .pipe(
        map((response: any) =>
          response.map((question, index) => ({ ...question, index }))
        )
      );
  }
  getQuestionsListFalse() {
    const role_id = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY);

    return this.http
        .get(
            `${ApiSettings.APP_API}/questions/?role=${role_id}&question__version=false`
        )
        .pipe(
            map((response: any) =>
                response.map((question, index) => ({ ...question, index }))
            )
        );
  }

  getQuestionAll() {
    const role_id = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY);

    return this.http.get(`${ApiSettings.APP_API}/questions/?role=${role_id}`)
      .pipe(map((response: any) =>
          response.map((question, index) => ({ ...question, index }))
      )
    );

  }
  checkAnswer(answerData: {
    question: number;
    answers: { id: number; text: string }[];
  }) {
    return this.http.post(
      `${ApiSettings.APP_API}/answers/check-answer/`,
      answerData
    );
  }

  generateTitles() {
    return this.http.get(`${ApiSettings.APP_API}/titles/generate/`);
  }
  generateEvents() {
    return this.http.get(`${ApiSettings.APP_API}/events/generate/`);
  }

  newsCreation(elementsData: { question: number; user: number }) {
    return this.http.post(
      `${ApiSettings.APP_API}/news/create_news/`,
      elementsData
    );
  }

  checkElements(elementsData: {
    elements: { id?: number; text: string }[];
    user: number;
    news_id: number;
  }) {

    const news_id = localStorage.getItem(NEWS_ID_KEY);

    return this.http.post(
      `${ApiSettings.APP_API}/news/${news_id}/elements/check_elements/`,
      elementsData
    );
  }

  saveElements(elementsData: {
    elements: string[];
    user: number;
    news_id: number;
  }) {
    const news_id = localStorage.getItem(NEWS_ID_KEY);

    return this.http.post(
      `${ApiSettings.APP_API}/news/${news_id}/elements/save_elements/`,
      elementsData
    );
  }

  getNewsList() {
    return this.http
      .get(`${ApiSettings.APP_API}/news/`)
      .pipe(
        map((response: any) =>
          response.map((question, index) => ({ ...question, index }))
        )
      );
  }

  createNews(elementsData: { news_id: number[] }) {
    return this.http.post(
      `${ApiSettings.APP_API}/titles/generate_with_elements/`,
      elementsData
    );
  }

  generateNews() {
    return this.http.get(`${ApiSettings.APP_API}/events/generate/`);
  }

  deleteNewsElementById(id: number) {
    return this.http.delete(`${ApiSettings.APP_API}/news/${id}/`);
  }
  deleteElementById(id_element: number){
 const id =  localStorage.getItem(NEWS_ID_KEY)
    return this.http.delete(`${ApiSettings.APP_API}/news/${id}/elements/${id_element}/`)
  }

  getElement(id:number){
    return this.http.get(`${ApiSettings.APP_API}/news/${id}/elements/`)
  }
  generateImg() {
    return this.http.get(`${ApiSettings.APP_API}/character/`);
  }

  getPayList() {
    return this.http.get(`${ApiSettings.APP_API}/rates/`);
  }


  createOrder(createOrder: {
    rate: number,
    user: number;

  }) {
    return this.http.post(
        `${ApiSettings.APP_API}/orders/create_order/`,
        createOrder
    );
  }
  getOrders() {
      return this.http.get(
          `${ApiSettings.APP_API}/orders/`
      );
  }
  questionTechSupport(question: {
    subject: string,
    text: string,

  }) {
    return this.http.post(
        `${ApiSettings.APP_API}/support/send/`,
        question
    );
  }
  GetAfterPayment() {
    return this.http.get(
        `${ApiSettings.APP_API}/after-payment/`
    );
  }
  getEndEvents(){
    return this.http.get(
        `${ApiSettings.APP_API}/events/end/`
    );
  }
}
