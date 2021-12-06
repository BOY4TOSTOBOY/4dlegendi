import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { ResetPasswordService } from "./reset-password.service";

describe("ResetPasswordService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [HttpClientModule],
    })
  );

  it("should be created", () => {
    const service: ResetPasswordService = TestBed.get(ResetPasswordService);
    expect(service).toBeTruthy();
  });
});
