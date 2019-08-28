import {Component, Input, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {AvatarService} from './avatar.service';
import {LeaderboardService} from '../leaderboard.service';
import {Globals} from '../../globals';
import {FeedcardService} from '../feedcard/feedcard.service';
import {EntityUserService} from '../../entity-store/user/state/entity-user.service';
import {EntityUserQuery} from '../../entity-store/user/state/entity-user.query';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  @Input() avatarUrl: string;

  componentName = 'avatar.component';
  isImageLoading: boolean;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageToShow: any = '';
  isCardLoading: boolean;

  avatarUpload = false;
  avatarSelect = false;

  constructor(private avatarService: AvatarService,
              private leaderboardService: LeaderboardService,
              private globals: Globals,
              private feedcardService: FeedcardService,
              private entityUserService: EntityUserService,
              public userQuery: EntityUserQuery) { }

  ngOnInit() {
    this.croppedImageToShow = this.userQuery.getCurrentUserAvatar()[0].avatarResolvedUrl;
    console.log('croppedImageToShow:');
    console.log(this.croppedImageToShow);
  }

  toggleAvatarUpload() {
    this.avatarUpload = true;
    this.avatarSelect = false;
  }

  toggleAvatarSelect() {
    this.avatarSelect = true;
    this.avatarUpload = false;
  }

  onImageSelected(event) {
    const functionName = 'onImageSelected';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Start ${functionFullName}`);

    console.log(`${functionFullName}: event: ${event}`);
    console.log(`${functionFullName}: this.croppedImage: ${this.croppedImage}`);


    this.avatarService.saveUserAvatar(this.croppedImage).subscribe((saveResult) => {
      console.log(`${functionFullName}: saveResult: ${saveResult}`);
      if (saveResult === true) {
        this.leaderboardService.isUserInLeaderboardTop5(this.globals.getUsername()).subscribe(isTop5Result => {
          console.log(`${functionFullName}: isTop5Result: ${isTop5Result}`);
          if (isTop5Result === true) {
            console.log(`${functionFullName}: user is in the Leaderboard Top 5. Refreshing leaderboard data`);
            this.leaderboardService.getPointsLeaderboard()
              .subscribe(leaderboardData => {
                console.log(`${functionFullName}: populating leaderboard data`);
                this.leaderboardService.populateLeaderboardDataSource(leaderboardData).subscribe(() => {
                  console.log(`${functionFullName}: leaderboard data populated`);
                });
              });
          }
        });

        this.feedcardService.refreshPointTransactionAvatars();
      }

    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageToShow = event.base64;
    this.croppedImage = event.file;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  generateRandomAvatar() {
    this.avatarSelect = false;
    this.avatarUpload = false;

    this.avatarService.generateRandomAvatar()
      .subscribe((data: any) => {
        const currentFn = this;
        const reader = new FileReader();
        reader.readAsDataURL(data.result);
        reader.onloadend = function() {
          const base64data = reader.result;
          console.log(base64data);
          console.log(data.avatarUrl);
          currentFn.avatarUrl = base64data.toString();
          currentFn.entityUserService.update(data.avatarUrl, base64data.toString());
          currentFn.avatarService.saveUserAvatar(data.result).subscribe();
        };
      });
  }
}