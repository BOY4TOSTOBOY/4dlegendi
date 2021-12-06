import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EventModel} from '../../../shared/models/event.model';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {BaseDestroyComponent} from '../../../shared/components/base-destroy/base-destroy.component';
import {LOCAL_STORAGE_ROLE_KEY} from '../../../shared/utils/localStorageKeys';


@Component({
  selector: 'event-list-table',
  templateUrl: './event-list-table.component.html',
  styleUrls: ['./event-list-table.component.scss']
})
export class EventListTableComponent extends BaseDestroyComponent implements OnInit {
  @Input() source: EventModel[] = [];
  @Input() params: {
    filters: any,
    paginatorOptions: {
      length: number,
      limit: number,
      offset: number
    }
  } = null;
  @Output() paramsChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['title', 'description', 'comment', ];
  // 'start'
  constructor() {
    super();
  }

  ngOnInit() {
  }

  paginatorClicked(event: any) {
    this.params.paginatorOptions.limit = event.pageSize;
    this.params.paginatorOptions.offset = event.pageIndex * event.pageSize;
    this.paramsChange.emit(this.params);

  }
}
