import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityRole } from './securityrole.model';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import {Department} from './department.model';
import {GlobalVariableService} from './global-variable.service';
import {forEach} from '@angular/router/src/utils/collection';
import Amplify, {API} from 'aws-amplify';
import awsconfig from '../../aws-exports';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  //departments: Department[];
  apiName = awsconfig.aws_cloud_logic_custom[0].name;
  // apiName = "api9819f38d";
  apiPath = '/items';
  myInit = {
    headers: {
      'Accept': "application/hal+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      'Content-Type': "application/json;charset=UTF-8"
    }
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient,
              private globalVariableService: GlobalVariableService,
              ) {
  }

  // HttpMethods

  getDepartments() {
    console.log('getDepartments');
    // console.log(awsconfig);
    return API.get(this.apiName, this.apiPath + '/getDepartments', {}).then(data => {
      console.log('serverless departments api');
      console.log(data);
      return data.data;
    });
  }

  storeDepartments() {
    console.log('storeDepartments');
    this.getDepartments()
      .then((result: any) => {
        console.log('departments:');
        console.log(result);
        const departmentObjList: Department[] = [];
        result.forEach(department => {
          const departmentObj: Department = {
            Id: department.id,
            Name: department.name
          };

          departmentObjList.push(departmentObj);
        });

        this.globalVariableService.setDepartmentList(departmentObjList);
      });
  }
  
  getDepartmentById(departmentId: number) {
    console.log('departmentService.getDepartmentById: ' + departmentId);
    // return this.http.post(environment.apiBaseUrl + '/getDepartments', {departmentId: departmentId});
    this.myInit['body'] = {departmentId: departmentId};
    return API.post(this.apiName, this.apiPath + '/getDepartments', this.myInit).then(data => {
      console.log('serverless departments api');
      console.log(data);
      return data.data;
    });
  }

  getEmployeesByDepartmentId(departmentId: number) {
    console.log('getEmployeesByDepartmentId');
    return this.http.post(environment.apiBaseUrl + '/getEmployeesByDepartmentId', {departmentId: departmentId});
  }

}
