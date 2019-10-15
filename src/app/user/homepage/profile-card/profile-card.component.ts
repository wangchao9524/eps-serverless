import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {forkJoin, Observable} from 'rxjs';
import {ImageService} from '../../../shared/image.service';
import {AvatarService} from '../../../shared/avatar/avatar.service';
import {GALLERY_IMAGE} from 'ngx-image-gallery';
import {Globals} from '../../../globals';
import {LeaderboardService, LeaderboardUser} from '../../../shared/leaderboard.service';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {Auth, Storage} from 'aws-amplify';
import awsconfig from '../../../../aws-exports';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import {FeedcardService} from '../../../shared/feedcard/feedcard.service';
import {NgxSpinnerService} from 'ngx-spinner';
// import {AchievementService} from '../../../shared/achievement/achievement.service';
import {UserService} from '../../../shared/user.service';
import {CurrentUserStore} from '../../../entity-store/current-user/state/current-user.store';
import {EntityCurrentUserQuery} from '../../../entity-store/current-user/state/entity-current-user.query';
import {EntityCurrentUserService} from '../../../entity-store/current-user/state/entity-current-user.service';
import {DomSanitizer} from '@angular/platform-browser';
import {AchievementService} from '../../../entity-store/achievement/state/achievement.service';
import {AchievementQuery} from '../../../entity-store/achievement/state/achievement.query';
import {EntityUserService} from '../../../entity-store/user/state/entity-user.service';
import {EntityUserModel} from '../../../entity-store/user/state/entity-user.model';
import {EntityUserQuery} from '../../../entity-store/user/state/entity-user.query';
import {MetricsService} from '../../../entity-store/metrics/state/metrics.service';
import {AuthService} from '../../../login/auth.service';
import {UserHasStoreItemQuery} from '../../../entity-store/user-has-store-item/state/user-has-store-item.query';
import {UserHasStoreItemService} from '../../../entity-store/user-has-store-item/state/user-has-store-item.service';
import {StoreItemService} from '../../../entity-store/store-item/state/store-item.service';
import {FeatureService} from '../../../entity-store/feature/state/feature.service';

// Create a variable to interact with jquery
declare var $: any;

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  componentName = 'profile-card.component';
  isImageLoading: boolean;
  leaderboardUsers$: Observable<EntityUserModel[]>;

  pendingBalance$;
  currentUser$;
  currentUser;
  isCardLoading: boolean;

  constructor(private http: HttpClient,
              private imageService: ImageService,
              private globals: Globals,
              private leaderboardService: LeaderboardService,
              private feedcardService: FeedcardService,
              private spinner: NgxSpinnerService,
              private achievementService: AchievementService,
              public achievementQuery: AchievementQuery,
              private userService: UserService,
              private currentUserStore: CurrentUserStore,
              public currentUserQuery: EntityCurrentUserQuery,
              private entityCurrentUserService: EntityCurrentUserService,
              private sanitizer: DomSanitizer,
              private entityUserService: EntityUserService,
              private entityUserQuery: EntityUserQuery,
              private userHasStoreItemService: UserHasStoreItemService,
              private userHasStoreItemQuery: UserHasStoreItemQuery,
              private storeItemService: StoreItemService,
              private metricsService: MetricsService,
              private authService: AuthService,
              private changeDetector: ChangeDetectorRef,
              private featureService: FeatureService) { }

  ngOnInit() {
    const functionName = 'ngOnInit';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Start ${functionFullName}`);

    this.isCardLoading = true;
    this.isImageLoading = true;
    this.spinner.show('profile-card-spinner');

/*      const text_max = 200;
    $('#count_message').html(text_max + ' remaining');

    $('#text').keyup(function() {
      const text_length = $('#text').val().length;
      const text_remaining = text_max - text_length;

      $('#count_message').html(text_remaining + ' remaining');
    });*/


    this.currentUser$ = this.currentUserQuery.selectAll();
    this.entityUserService.cacheUsers().subscribe();
    // this.featureService.cacheFeatures().subscribe().unsubscribe();
    this.leaderboardUsers$ = this.entityUserQuery.selectAll({
      filterBy: userEntity => userEntity.securityRole.Id === 1,
    });

/*    this.storeItemService.cacheStoreItems().subscribe(() => {
      this.userHasStoreItemService.cacheUserHasStoreItemRecords().subscribe(() => {
        this.userHasStoreItemService.getPendingBalance().subscribe(balance => {
          console.log('balance: ' + balance);
          this.entityCurrentUserService.updatePointsBalance(balance);
        });
      });
    });*/

    // this.pendingBalance$ = this.entityCurrentUserService.getPendingBalance();
    this.isImageLoading = false;
    this.isCardLoading = false;
    this.spinner.hide('profile-card-spinner');
  }

  getPendingBalance(): Observable<any> {
    return new Observable(observer => {
      this.currentUserQuery.selectAll()
        .subscribe(user => {
          if (user[0]) {
            observer.next(user[0].pointsBalance);
            observer.complete();
          } else {
            observer.complete();
          }

        });
    });
  }

  avatarClick() {
    $('#avatarModal').modal('show');
  }


  Debug() {

    // const avatarPath = this.globals.getUserAttribute('picture');
    // const level = avatarPath.split('/')[0];
    // const cognitoIdentityId = avatarPath.split('/')[1];
    // const key = avatarPath.split('/')[2];

    // this.entityUserService.showStore();

/*    console.log('avatarPath');
    console.log(avatarPath);

    Auth.currentUserInfo().then(result => console.log(result));

    Storage.get(key, {
      level: level,
      identityId: cognitoIdentityId
    })
      .then(result => {
        console.log(result);
        this.avatarService.userAvatarUrl = result;
      })
      .catch(err => {
        console.log('Error');
        console.log(err);
      });*/
  }

  test() {

  }
}
