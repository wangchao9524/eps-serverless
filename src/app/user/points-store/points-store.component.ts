import { Component, OnInit } from '@angular/core';
import awsconfig from '../../../aws-exports';
import {API, Storage} from 'aws-amplify';
import {AuthService} from '../../login/auth.service';
import {Observable, from} from 'rxjs';
import {StoreItemStore} from '../../entity-store/store-item/state/store-item.store';
import {StoreItemQuery} from '../../entity-store/store-item/state/store-item.query';
import {StoreItemService} from '../../entity-store/store-item/state/store-item.service';
import {StoreItemModel} from '../../entity-store/store-item/state/store-item.model';
import {EntityCurrentUserQuery} from '../../entity-store/current-user/state/entity-current-user.query';
import { ConfirmationDialogComponent } from '../components/shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatSnackBar, VERSION } from '@angular/material';
import { EntityCurrentUserService } from 'src/app/entity-store/current-user/state/entity-current-user.service';
import { CostExplorer } from 'aws-sdk';
import { CurrentUserStore } from 'src/app/entity-store/current-user/state/current-user.store';
import {UserHasStoreItemService} from '../../entity-store/user-has-store-item/state/user-has-store-item.service';
import {EntityUserQuery} from '../../entity-store/user/state/entity-user.query';
import {UserHasStoreItemQuery} from '../../entity-store/user-has-store-item/state/user-has-store-item.query';

@Component({
  selector: 'app-points-store',
  templateUrl: './points-store.component.html',
  styleUrls: ['./points-store.component.css']
})
export class PointsStoreComponent implements OnInit {
  componentName = 'points-store.component';
  dialogResult = " ";
  version = VERSION;


  items: StoreItemModel[] = [];
  numRows: number;
  rows = [];
  selectedStoreItem;

  constructor(private storeItemStore: StoreItemStore,
              private storeItemQuery: StoreItemQuery,
              private storeItemService: StoreItemService,
              private entityCurrentUserService: EntityCurrentUserService,
              private currentUserStore: CurrentUserStore,
              private currentUserQuery: EntityCurrentUserQuery,
              private userHasStoreItemService: UserHasStoreItemService,
              private userHasStoreItemQuery: UserHasStoreItemQuery,
              private userQuery: EntityUserQuery,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog ) {}


  openDialog(): void {
    console.log(`User's manager:`);
    const requestUser = this.currentUserQuery.getAll()[0];
    console.log(this.userQuery.getDepartmentManager(requestUser.department.Id)[0]);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Would you like to redeem this gift?"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;

      if (result === 'Confirm') {
        const checkPointsResult = this.checkPoints();
        if (checkPointsResult !== true) {
          console.log('Not enough points.');
        } else {
          console.log('Enough points. Submitting request');
          this.submitStoreItemPurchaseRequest(this.selectedStoreItem);
        }
      } else if (result === 'Cancel') {
        console.log('Test567');
        console.log(this.selectedStoreItem);
      }
    });
  }

  selectStoreItem(storeItem) {
    this.selectedStoreItem = storeItem;
    console.log(this.selectedStoreItem);
  }



  checkPoints(): boolean {
    const userPoints = this.currentUserQuery.getAll()[0].points;
    const itemCost = this.selectedStoreItem.cost;
    console.log(`The item costs: ${itemCost}`);
    console.log(`You currently have: ${userPoints}`);

    if (userPoints < itemCost) {
      const snack = this.snackBar.open('You do not have enough points to redeem this item' , 'Close', {
        duration: 5000,
      });
      console.log(`You do not have enough points`);
      return false;
    } else {
      const snack = this.snackBar.open(`You have enough points to redeem this item. An email has been sent to your manager for approval`, 'Close', {
        duration: 5000,
      });
      console.log(`You have enough points to redeem this item. An email has been sent to your manager for approval`);
      return true;
    }
  }

  submitStoreItemPurchaseRequest(storeItem: StoreItemModel) {
    const functionName = 'submitStoreItemPurchaseRequest';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Start ${functionFullName}`);

    const requestUser = this.currentUserQuery.getAll()[0]; // Retrieve current user info
    const managerUser = this.userQuery.getDepartmentManager(requestUser.department.Id)[0]; // Retrieve user's manager's info
    console.log(storeItem);

    this.userHasStoreItemService.newUserHasStoreItemRecord(storeItem.itemId)
      .subscribe((result: any) => {
        console.log(`${functionFullName}: result:`);
        console.log(result);
        if (result.status === true) {
          // Send the manager an email
          console.log(`${functionFullName}: Trying to send an email to user's manager:`);
          console.log(managerUser);
          this.storeItemService.sendStoreItemPurchaseRequestEmail(managerUser, requestUser, storeItem)
            .subscribe(emailResult => {
              console.log(`${functionFullName}: email result:`);
              console.log(emailResult);
            });
        } else {
          console.log(`${functionFullName}: Something went wrong...`);
        }
      });
  }

  ngOnInit() {
    const functionName = 'ngOnInit';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Start ${functionFullName}`);

    this.storeItemService.cacheStoreItems().subscribe();
    this.userHasStoreItemService.cacheUserHasStoreItemRecords().subscribe();
  }

  listStoreItems() {
    // const storeItems = this.storeItemQuery.getAll();
    // const storeItems = this.rows;
    // console.log(storeItems);
    console.log('items:');
    console.log(this.items);
    console.log('numRows:');
    console.log(this.numRows);
    console.log('rows:');
    console.log(this.rows);
    console.log('getAll()');
    console.log(this.storeItemQuery.getAll());
  }

  getStoreItems() {
    this.items = this.storeItemQuery.getAll();
    console.log(this.storeItemQuery.getAll());
    console.log(this.items);
    this.numRows = Math.ceil(this.items.length / 3);
    let index = 0;
    for (let i = 0; i < this.numRows; i++) {
      /*          const row = {
                  items: [this.items[index], this.items[index + 1], this.items[index + 2]]
                };*/

      const row = [];
      row.push(this.items[index]);
      row.push(this.items[index + 1]);
      row.push(this.items[index + 2]);
      console.log('row:');
      console.log(row);
      this.rows.push(row);
      index = index + 3;
    }

    console.log('rows:');
    console.log(this.rows);
  }




}
