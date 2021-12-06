import { TestBed, inject } from "@angular/core/testing";
import { CommonAuthService } from "./common-auth.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { StateService, UIRouterModule } from "@uirouter/angular";
import { QuestionService } from "../../question/question.service";
import { EventService } from "../../event/event.service";

describe("CommonAuthService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, UIRouterModule],
      providers: [HttpClient, StateService, EventService, QuestionService],
    });
  });

  it("should be created", inject(
    [CommonAuthService],
    (service: CommonAuthService) => {
      expect(service).toBeTruthy();
    }
  ));
});
