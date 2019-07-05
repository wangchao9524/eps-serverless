import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {SecurityRole} from '../../shared/securityrole.model';
import {UserService} from '../../shared/user.service';
import {DepartmentService} from '../../shared/department.service';
import {SecurityRoleService} from '../../shared/securityRole.service';
import {Department} from '../../shared/department.model';
import {map} from 'rxjs/operators';
import {AmplifyService} from 'aws-amplify-angular';
import {AuthService} from '../auth.service';
import { environment } from 'src/environments/environment';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  hide = true;

  departments: Department[];
  securityRoles: SecurityRole[];

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSuccessMessage: boolean;
  serverErrorMessages: string;

  selectedUser = this.userService.selectedUser;

  constructor(
    public userService: UserService,
    private departmentService: DepartmentService,
    private securityRoleService: SecurityRoleService,
    private amplifyService: AmplifyService,
    private _authService: AuthService,
    private _router: Router) { }

  ngOnInit() {
    //console.log(this.role);
    //console.log(this.keys());
    this.departmentService.getDepartments()
      .then(deps => {
        this.departments = deps;
        for (let i = 0; i < deps.length; i++) {
          console.log(deps[i]);
        }
      });
    // this.getDepartments().subscribe(deps => {
    //     this.departments = deps;
    //     for (let i = 0; i < deps.length; i++) {
    //       console.log(deps[i]);
    //     }
    //   }
    // );

/*    this.getSecurityRoles().subscribe(secRoles => {
        this.securityRoles = secRoles;
        for (let i = 0; i < secRoles.length; i++) {
          console.log(secRoles[i]);
        }
      }
    );*/
  }

/*  getSecurityRoles() {
    console.log('getSecurityRoles');
    return this.securityRoleService.getSecurityRoles()
      .pipe(
        map(data => {
          return data['securityRoles'];
        }));
  }*/


  getDepartments() {
    console.log('getDepartments');
    // return this.departmentService.getDepartments()
    //   .pipe(
    //     map(data => {
    //       return data['departments'];
    //     }));
    return this.departmentService.getDepartments()
      .then(data => {
        return data;
      });
  }


/*
  onSubmit(form: NgForm) {
    console.log('onSubmit');
    console.log(form.value);
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSuccessMessage = true;
        setTimeout(() => this.showSuccessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        } else {
          this.serverErrorMessages = 'Something went wrong. Please contact admin.';
        }
      }
    );
  }
*/

  
  onSubmit(form: NgForm) {
    console.log('onSubmit');
    console.log(form.value);

    this._authService.signUp({
      'email': form.value.email,
      'password': form.value.password,
      'firstName': form.value.firstName,
      'lastName': form.value.lastName
    })
      .then((data) => {
        environment.confirm.email = form.value.email;
        environment.confirm.password = form.value.password;
        this._router.navigateByUrl('/confirm');
      })
      .catch((error) => console.log(error));

    /*
    this.userService.postUser(form.value).subscribe(
      res => {
        this.showSuccessMessage = true;
        setTimeout(() => this.showSuccessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        } else {
          this.serverErrorMessages = 'Something went wrong. Please contact admin.';
        }
      }
    );
    */
  }

  /*
  signUp() {

    this._authService.signUp({
      "email": this.emailInput.value,
      "password": this.passwordInput.value,
      "firstName": this.fnameInput.value,
      "lastName": this.lnameInput.value
    })
      .then((data) => {
        environment.confirm.email = this.emailInput.value;
        environment.confirm.password = this.passwordInput.value;
        this._router.navigate(['auth/confirm']);
      })
      .catch((error) => console.log(error));
  }
  */

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      securityRole: '',
      department: '',
      points: 0,
      password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }
 
  
}
