import { Component, OnInit } from "@angular/core";

import {PAY_ID} from "../../../shared/utils/constants";
import {StateService} from "@uirouter/angular";
import {BaseDestroyComponent} from "../../../shared/components/base-destroy/base-destroy.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: "profile-dialog",
  templateUrl: "./pay-dialog.component.html",
  styleUrls: ["./pay-dialog.component.scss"],
})
export class PayDialogComponent  extends BaseDestroyComponent  implements OnInit
{

  PaymentURL: string;

  constructor ( private dialog: MatDialog, private stateService: StateService) {super(); }

  ngOnInit() {
    this._payGo();
  }
  private _payGo() {
    this.PaymentURL = localStorage.getItem(PAY_ID);
  }

  // молитва чтобы работала
  // tslint:disable-next-line:max-line-length
  // أَسْتَوْدِعُ اللهَ دِينِكَ، وَأَمَانَتَكَ، وَخَوَاتِمَ عَمَلِكَ ،  وَأَقْرَأُ عَلَيْكَ السَّلَامَ . اللَّهُمَّ اطْوِ لَهُ البَعِيدَ وَهَوِّنْ عَليهِ السَّفَرَ.  زَوَّدَكَ اللهُ التَّقْوَى، وَغَفَرَ اللهُ ذَنْبَكَ  ويَسَّرَ لَكَ الـخَيْرَ حَيْثُمَا كُنْتَ  جَعَلَ اللَّهُ التَّقْوَى زَادَكَ، وَغَفَرَ ذَنْبَكَ، وَوَجَّهَكَ لِلْخَيْرِ  حَيْثُ مَا ت.
  goToPay() {
    window.location.href = this.PaymentURL;

  }

  goToTariffs() {
    this.stateService.go("app.payment-subscription");
    this.dialog.closeAll();
  }

}
