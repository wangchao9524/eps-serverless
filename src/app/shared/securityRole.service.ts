import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityRole } from './securityrole.model';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import {Department} from './department.model';
import Amplify, {API} from 'aws-amplify';
import awsconfig from '../../aws-exports';
import {Globals} from '../globals';

@Injectable({
  providedIn: 'root'
})
export class SecurityRoleService {

  componentName = 'securityRole.service';
  apiName = awsconfig.aws_cloud_logic_custom[0].name;
  apiPath = '/items';
  myInit = {
    headers: {
      'Accept': "application/hal+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      'Content-Type': "application/json;charset=UTF-8"
    }
  };

  constructor(private http: HttpClient, private globals: Globals) {

  }

  // HttpMethods

/*  getSecurityRoles() {
    console.log('getSecurityRoles');
    //console.log(this.http.get(environment.apiBaseUrl + '/getSecurityRoles'));
    return this.http.get(environment.apiBaseUrl + '/getSecurityRoles', this.noAuthHeader);
  }*/

/*  getSecurityRoles() {
    console.log('getSecurityRoles');

    return API.get(this.apiName, this.apiPath + '/getSecurityRoles', {}).then(data => {
      console.log('serverless security roles api');
      console.log(data);
      return data.data;
    });
  }*/

  getSecurityRoles(): Promise<SecurityRole[]> {
    const functionName = 'getSecurityRoles';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Starting ${functionFullName}`);

    const securityRoles: SecurityRole[] = this.globals.securityRoles;
    console.log(`${functionFullName}: check if securityRoles have been cached`);
    if (securityRoles) {
      console.log(`${functionFullName}: securityRoles cache exists`);
      console.log(securityRoles);

      return new Promise(resolve => {
        console.log(`${functionFullName}: returning securityRoles from cache`);
        resolve(securityRoles);
      });
    } else {
      console.log(`${functionFullName}: securityRoles cache does not exist`);
      return new Promise( resolve => {
        console.log(`${functionFullName}: retrieve securityRoles from API`);
        API.get(this.apiName, this.apiPath + '/getSecurityRoles', {}).then(data => {
          console.log(`${functionFullName}: successfully retrieved data from API`);
          console.log(data);
          console.log(`${functionFullName}: caching securityRoles`);
          const securityRoleObjList: SecurityRole[] = [];
          data.data.forEach((securityRole: any) => {
            const securityRoleObj: SecurityRole = {
              Id: securityRole.id,
              Name: securityRole.name
            };

            securityRoleObjList.push(securityRoleObj);
          });

          this.globals.securityRoles = securityRoleObjList;

          console.log(`${functionFullName}: returning securityRoles from API`);
          resolve(securityRoleObjList);
        });
      });
    }
  }


  getSecurityRoleById(securityRoleId: number) {
    const functionName = 'getSecurityRoleById';
    const functionFullName = `${this.componentName} ${functionName}`;
    console.log(`Starting ${functionFullName}`);

    const securityRoles: SecurityRole[] = this.globals.securityRoles;
    console.log(`${functionFullName}: check if securityRoles have been cached`);
    if (securityRoles) {
      console.log(`${functionFullName}: securityRoles cache exists`);

      // console.log(securityRoles);

      return new Promise(resolve => {
        console.log(`${functionFullName}: returning securityRoles from cache`);
        resolve(securityRoles);
      });
    }

    console.log('getSecurityRoleById');
    console.log('securityRoleService.getSecurityRoleById: ' + securityRoleId);
    this.myInit['body'] = {securityRoleId: securityRoleId};
    return API.post(this.apiName, this.apiPath + '/getSecurityRoles', this.myInit).then(data => {
      console.log('serverless getSecurityRoleById');
      console.log(data);
      return data.data;
    });
    // return this.http.post(environment.apiBaseUrl + '/getSecurityRoles', {securityRoleId: securityRoleId}, this.noAuthHeader);
  }
}
