import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StateService } from '@uirouter/angular';
import { CommonAuthService } from 'src/app/core/services/common/common-auth/common-auth.service';

interface User {
  email: string;
  first_name: string;
  is_generate: string;
  last_name: string;
  username: string;
  id: number;
  date_end: string;
  count_orders: number;
}

@Component({
  selector: 'promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {
  userProfile: User ;
title:string
promocode:any = {}
  constructor( private dialog: MatDialog, public commonAuthService: CommonAuthService,   private stateService: StateService,) { }

  ngOnInit() { 
    this.userProfile = this.commonAuthService.currentUser$$.value;
  }

  postTitle(){
  this.promocode.title = this.title
  this.commonAuthService.postPromoCode(this.promocode).subscribe((res:any)=>
  {  if(res.ok){
    this.stateService.go("after-payment");
    this.dialog.closeAll();
    }
    else{
      console.log("lox");
      
    }
  }
  )

  

  }


}
