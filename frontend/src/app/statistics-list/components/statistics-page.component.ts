import { Component, OnInit } from "@angular/core";

import {StateService} from '@uirouter/core';
import * as _ from 'lodash';

import {BaseDestroyComponent} from "../../shared/components/base-destroy/base-destroy.component";


@Component({
  selector: "statistics-page",
  templateUrl: "./statistics-page.component.html",
  styleUrls: ["./statistics-page.component.scss"]
})
export class StatisticsPageComponent
  extends BaseDestroyComponent
  implements OnInit
{

  constructor() {
    super();
  }

  ngOnInit() {

  }

}
