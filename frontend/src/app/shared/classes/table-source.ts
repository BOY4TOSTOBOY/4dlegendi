import { Observable } from 'rxjs/Observable';
import { MatSort } from '@angular/material/sort';
import {of} from 'rxjs';

export class TableSource {
  data: any;
  sortData: ((data: any, sort: MatSort) => any);
  constructor(tableData: any) {
    this.data = tableData;
  }

  connect(): Observable<any> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));

    return of(rows);
  }


}
