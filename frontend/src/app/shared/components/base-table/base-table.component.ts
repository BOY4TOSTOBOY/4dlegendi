import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TableSource} from '../../classes/table-source';
import {Component, EventEmitter} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {BaseDestroyComponent} from '../base-destroy/base-destroy.component';


@Component({
  selector: '',
  template: '',
})
export class BaseTableComponent extends BaseDestroyComponent {
  isSortStarted = false;
  isFirstLoad = true;

  params: any;
  paramsChange: EventEmitter<any>;

  orderingChangedEvent: EventEmitter<any>;

  sort: MatSort;
  paginator: MatPaginator;

  selection: SelectionModel<any>;
  dataSource: any;
  expandedRowsArray: number[] = [];

  constructor() {
    super();
  }

  get sortActive() {
    if (this.params) {
      return this.params.filters.ordering.slice(0, 1) === '-' ? this.params.filters.ordering.slice(1) : this.params.filters.ordering;
    } else {
      return null;
    }
  }

  get sortDirection() {
    if (this.params) {
      return this.params.filters.ordering.slice(0, 1) === '-' ? 'desc' : 'asc';
    } else {
      return null;
    }
  }

  get startIndex() {
    return this.paginator.pageSize * this.paginator.pageIndex + 1;
  }

  paginatorClicked() {
    this.params.paginatorOptions.limit = this.paginator.pageSize;
    this.params.paginatorOptions.offset = this.paginator.pageIndex * this.paginator.pageSize;

    this.paramsChange.emit(this.params);
    this.orderingChangedEvent.emit(true);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  expandRow(row: any) {
    if (row.document_set) {
      if (this.checkRowExpansion(row)) {
        const expRow = this.expandedRowsArray.indexOf(row);
        this.expandedRowsArray.splice(expRow, 1);
      } else {
        this.expandedRowsArray.push(row);
      }
    }
  }

  checkRowExpansion(row: any) {
    for (let exp of this.expandedRowsArray) {
      if (exp === row) {
        return true;
      }
    }

    return false;
  }

  prepareTable(items: any, isExpandableTable: boolean) {
    if (this.isFirstLoad) {
      this.dataSource = isExpandableTable ? new TableSource(items) : new MatTableDataSource(items);
      this.dataSource.sort = this.sort;

      if (this.sort) {
        this._runSort();
      }
    } else {
      this.dataSource.data = items;
    }
  }

  private _runSort() {
    if (this.isSortStarted) {
      return;
    }

    this.isSortStarted = true;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sort.sortChange
      .subscribe(() => {
        let orderingParams = '';

        if (this.sort.direction === 'desc') {
          orderingParams = '-' + this.sort.active;
        } else {
          orderingParams = this.sort.active;
        }

        this.params.filters.ordering = orderingParams;

        this.params.paginatorOptions.limit = this.paginator.pageSize;
        this.params.paginatorOptions.offset = this.paginator.pageIndex * this.paginator.pageSize;

        this.paramsChange.emit(this.params);
        this.orderingChangedEvent.emit(true);
      });
  }
}
