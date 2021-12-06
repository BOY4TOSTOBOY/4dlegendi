import { Component, OnInit } from '@angular/core';
import {StatisticsService} from '../../../core/services/ statistics/statistics.service';
import {takeUntil, tap} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {BehaviorSubject, of} from 'rxjs';

export interface UserStatistics {
count_orders_all: number;
count_users: number;
role_blogger: number;
role_expert: number;
role_seller: number;
}
export interface UserStatisticsPercent {
    count_all_ratings: number;
    count_true_ratings: number;
    text: string;
}

@Component({
  selector: 'statistics-list',
  templateUrl: './statistics-list.component.html',
  styleUrls: ['./statistics-list.component.scss']
})


export class StatisticsListComponent extends BaseDestroyComponent implements OnInit {

    staticList: UserStatistics[] = [];


    percentStatistics: UserStatisticsPercent[] = [] ;
    percentStatistics$$ = new BehaviorSubject<UserStatisticsPercent[]>([]);
    dataSource = this.percentStatistics;
    constructor(public statisticsService: StatisticsService) {super(); }

  ngOnInit() {
    this._staticsList();
    this._staticsListPercent();
  }
  private _staticsList() {
    return this.statisticsService.GetStatistics()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: UserStatistics[]) => {
            if (res) {
                this.staticList = res;
            }
        });
    }

   private _staticsListPercent() {
        return this.statisticsService
            .GetSercentStatistics().subscribe((res: UserStatisticsPercent[])=> {
                res.forEach((el: any) => {
                    el.text = el.text.toString()
                });

                this.percentStatistics.push(...res)
                // this.percentStatistics$$.next(res);
                //
                // this._cardItemsHandler();

            })
    }

    // private _cardItemsHandler() {
    //     this.percentStatistics$$.subscribe((newTypeOfStorage) => {
    //     this.percentStatistics = newTypeOfStorage;
    //     });
    // }
}
