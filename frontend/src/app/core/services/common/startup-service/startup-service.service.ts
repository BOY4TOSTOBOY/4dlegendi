import { Injectable, Injector } from "@angular/core";
import {
  StateService,
  Transition,
  TransitionService,
} from "@uirouter/core/lib";
import * as _ from "lodash";
import { CommonAuthService } from "../common-auth/common-auth.service";
import { tap } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { EventService } from "../../event/event.service";

@Injectable()
export class StartupService {
  currentUser: any;

  notProtectedStates = ["reset-password", "login"];
  hasUnviewedEvents = false;

  constructor(
    private injector: Injector,
    private transitionService: TransitionService,
    private eventService: EventService,
    private $state: StateService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    const commonAuthService = this.injector.get(CommonAuthService);
    commonAuthService.currentUser$$
      .pipe(tap((currentUser) => (this.currentUser = currentUser)))
      .subscribe();

    this.eventService.hasReviewedEvents$
      .pipe(tap((value: boolean) => (this.hasUnviewedEvents = value)))
      .subscribe();

    ["facebook", "google", "twitter", "vk"].forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `assets/images/social-network-icons/${icon}.svg`
        )
      );
    });
  }

  initializeApp() {
    this.runOnBefore();
    const commonAuthService = this.injector.get(CommonAuthService);

    return commonAuthService
      .getProfile()
      .toPromise()
      .catch((err: any) => Promise.resolve())
      .then(() => {
        this.transitionService["_router"].urlService.listen();
        this.transitionService["_router"].urlService.sync();
      });
  }

  runOnBefore() {
    const protectedStates = _.chain(this.$state.get())
      .map((state) => state.name)
      .filter(this._filterState.bind(this))
      .value();

    protectedStates.forEach((state) => {
      this.transitionService.onBefore(
        { to: state },
        this.checkPermissionsProtectedState.bind(this)
      );
    });

    this.notProtectedStates.forEach((state) => {
      this.transitionService.onBefore(
        { to: state },
        this.checkPermissionsNotProtectedState.bind(this)
      );
    });
  }

  checkPermissionsProtectedState(transition: Transition) {
    const isAuthenticated = this.isAuthenticated();

    if (!isAuthenticated) {
      return transition.router.stateService.target("login");
    }

    return true;
  }

  checkPermissionsNotProtectedState(transition: Transition) {
    const isAuthenticated = this.isAuthenticated();

    if (isAuthenticated) {
      if (!this.currentUser.is_generate) {
        return transition.router.stateService.target("app.dashboard");
      } else {
        return this.hasUnviewedEvents
          ? transition.router.stateService.target("app.event-review")
          : transition.router.stateService.target("app.event-list");
      }
    }

    return true;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  private _filterState(state) {
    return this.notProtectedStates.indexOf(state) === -1;
  }
}
