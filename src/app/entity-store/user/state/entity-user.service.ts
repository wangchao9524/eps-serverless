import { UserStore } from './user.store';
import { EntityUserQuery} from './entity-user.query';
import { createEntityUserAvatarModel, EntityUserModel } from './entity-user.model';
import { Injectable } from '@angular/core';
import { VISIBILITY_FILTER } from '../filter/user-filter.model';
import {guid, ID} from '@datorama/akita';
import { cacheable} from '@datorama/akita';
import {API, Storage} from 'aws-amplify';
import {forkJoin, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AvatarService} from '../../../shared/avatar/avatar.service';
import {Globals} from '../../../globals';
import awsconfig from '../../../../aws-exports';
import {AuthService} from '../../../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EntityUserService {
  componentName = 'entity-user-avatar.service';
  apiName = awsconfig.aws_cloud_logic_custom[0].name;
  apiPath = '/items';
  myInit = {
    headers: {
      'Accept': 'application/hal+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  constructor(private userAvatarStore: UserStore,
              private entityUserAvatarQuery: EntityUserQuery,
              private authService: AuthService) { }

  updateFilter(filter: VISIBILITY_FILTER) {
    this.userAvatarStore.update({
      ui: {
        filter
      }
    });
  }


  complete({ username, avatarPath }: EntityUserModel) {
    this.userAvatarStore.update(username, {
      avatarPath
    });
  }


  add(username: string, avatarBase64String: string, avatarPath: string, avatarResolvedUrl: string) {
    const userAvatar = createEntityUserAvatarModel({ username, avatarBase64String, avatarPath, avatarResolvedUrl });
    this.userAvatarStore.add(userAvatar);
  }


  delete(id: ID) {
    console.log(`entity-user-avatar.service: delete ${id}`);
    this.userAvatarStore.remove(id);
  }

  reset() {
    this.userAvatarStore.reset();
  }

  updateAvatar(username: string, avatarPath: string) {
    const data = {
      avatarUrl: avatarPath
    };
    this.getAvatarFromStorage(data)
      .subscribe((result: any) => {
        this.userAvatarStore.update((e) => e.username === username, {
          avatarPath: avatarPath,
          avatarResolvedUrl: result.avatarResolvedUrl
        });
      });
  }

  cacheUsers() {
    console.log(`Retrieving all user avatars`);
    // this.userAvatarStore.setLoading(true);  // this is the initial state before doing anything
    const request$ = this.getUserAvatars()
      .pipe(tap((avatars: any) => {
        console.log(`caching:`);
        console.log(avatars);

        const avatarsArray: EntityUserModel[] = [];
        const observables: Observable<any>[] = [];
        for (let i = 0; i < avatars.length; i++) {
          observables.push(this.getAvatarFromStorage(avatars[i]));
        }

        forkJoin(observables)
          .subscribe((obsResult: any) => {
            for (let i = 0; i < obsResult.length; i++) {
              const username = obsResult[i].username;
              const avatarPath = obsResult[i].avatarPath;
              const avatarBase64String = '';
              const avatarResolvedUrl = obsResult[i].avatarResolvedUrl;
              const avatar = createEntityUserAvatarModel({username, avatarBase64String, avatarPath, avatarResolvedUrl});
              avatarsArray.push(avatar);
            }

            this.userAvatarStore.set(avatarsArray);
            // this.userAvatarStore.setLoading(false);  // this gets set to false automatically after store is set
          });
      }));

    return cacheable(this.userAvatarStore, request$);
  }

  getAvatarFromStorage(userAvatarData: any): Observable<any> {
    console.log('Getting item from storage');

    return new Observable<any>(observer => {
      const split = userAvatarData.avatarUrl.split('/');
      const level = split[0];
      let key;
      let identityId;
      if (level === 'public') {
        key = split.slice(1, split.length).join('/');

      } else {
        key = split.slice(2, split.length).join('/');
        identityId = split[1];
      }

      Storage.get(key, {
        level: level,
        identityId: identityId
      })
        .then((result: string) => {
          console.log(result);
          const data = {
            username: userAvatarData.username,
            avatarPath: userAvatarData.avatarUrl,
            avatarResolvedUrl: result
          };

          observer.next(data);
          observer.complete();
        });
    });
  }

  getUserAvatars(): Observable<any> {
    const functionName = 'getUserAvatars';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Start ${functionFullName}`);

    return new Observable<any>(observer => {
      this.authService.currentAuthenticatedUser()
        .then(user => {
          const token = user.signInUserSession.idToken.jwtToken;
          const myInit = this.myInit;
          myInit.headers['Authorization'] = token;

          API.get(this.apiName, this.apiPath + '/getUserAvatars', myInit).then(data => {
            console.log(`${functionFullName}: successfully retrieved data from API`);
            console.log(data);
            observer.next(data.data);
            observer.complete();
          })
            .catch(err => {
              console.log(`${functionFullName}: error retrieving user avatars data from API`);
              console.log(err);
              observer.next(err);
              observer.complete();
            });
        })
        .catch(err => {
          console.log(`${functionFullName}: error getting current authenticated user from auth service`);
          console.log(err);
          observer.next(err);
          observer.complete();
        });
    });
  }

  showStore() {
    console.log(this.userAvatarStore);
  }
}
