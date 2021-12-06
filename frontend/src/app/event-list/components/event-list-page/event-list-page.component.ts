import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {EventModel} from '../../../shared/models/event.model';
import {debounceTime, map, share, takeUntil, tap} from 'rxjs/operators';
import {EventService} from '../../../core/services/event/event.service';
import * as _ from 'lodash';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {CommonAuthService} from '../../../core/services/common/common-auth/common-auth.service';
import {StatisticsService} from '../../../core/services/ statistics/statistics.service';
import {StateService} from '@uirouter/angular';
import {Paginator_Pay, TEXT_FILTER} from '../../../shared/utils/constants';
import {ToastrService} from "ngx-toastr";
import {build$} from "protractor/built/element";


interface user {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
  count_orders: number;
}


@Component({
  selector: 'event-list-page',
  templateUrl: './event-list-page.component.html',
  styleUrls: ['./event-list-page.component.scss']
})
export class EventListPageComponent extends BaseDestroyComponent implements OnInit {
  searchQueryCtrl: FormControl = new FormControl('');
  click = 1;
  events$: Observable<EventModel[]> = of([]);
  eventParams = {
    filters: {
      title: null,
      ordering: 'start',
    },

    paginatorOptions: {
      length: 13,
      limit: 6,
      offset: 0
    }
  };
  userProfile: user;

  transitionToApprove: boolean;
  constructor(private eventService: EventService,
              private commonAuthService: CommonAuthService,
              private statisticsService: StatisticsService,
              private stateService: StateService,
              private toastrService: ToastrService,
  ) {
    super();
    this.userProfile = this.commonAuthService.currentUser$$.value;

    if (this.searchQueryCtrl) {
      this.searchQueryCtrl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(300),
          tap(() => {
            this.eventParams.paginatorOptions.offset = 0;
            this.getEvents();
          })
        )
        .subscribe( );
    }
  }

  ngOnInit() {
   this.transitionToApprove =this.eventService.transitionToApprove
    this.getEvents();

  }

  getEvents() {
    this.events$ = this._getEvents()
      .pipe(
        share()
      );
  }


  downloadContentPlan() {
    const statistics = {
      user: this.userProfile.id,
      click: this.click,
    };

    this.eventService.downloadContentPlan()
        .pipe(takeUntil(this.destroy$))
        .subscribe();

  }

  private _getEvents() {
    if (this.searchQueryCtrl) {
      this.eventParams.filters.title = this.searchQueryCtrl.value;

    }
      if (!this.eventParams.filters.title){

        const params = this.eventParams.paginatorOptions.limit;
        const offset = this.eventParams.paginatorOptions.offset;
        localStorage.setItem(Paginator_Pay, String(offset));
        return this.eventService.getEvents(params)
            .pipe(
                takeUntil(this.destroy$),
                map( (response: {count: number, results: any}) => {
                  if (response) {
                    this.eventParams.paginatorOptions.length = response.count;

                    return response.results;
                  }
                })
            );
      }else {
        localStorage.setItem(TEXT_FILTER, this.eventParams.filters.title)
        const params = this.eventParams.paginatorOptions.limit;
        const offset = this.eventParams.paginatorOptions.offset;
        localStorage.setItem(Paginator_Pay, String(offset));
       return  this.eventService.getEventsFilter(params).pipe(
            takeUntil(this.destroy$),
            map((response: { count: number, results: any }) => {
              if (response) {
                this.eventParams.paginatorOptions.length = response.count;
                return response.results;
              }
            })
        )
      }
  }

  private _generateParams(genericParams) {
    const params = {
      ordering: null,
      title: null,
      length: null,
      status: 1
    };
    _.merge(params, genericParams.filters);
    _.merge(params, genericParams.paginatorOptions);

    delete params.length;

    return params;
  }
  goToReview() {
    if(this.eventService.transitionToApprove === true){
    this.stateService.go("app.event-review");
  }else {
      this.toastrService.info("Вы проверили все посты");
    }
  }
  goToPay() {
    this.stateService.go("app.payment-subscription");
  }
}
