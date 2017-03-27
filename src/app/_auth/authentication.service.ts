import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from './user';
import 'rxjs/add/operator/map';
import { CONFIG } from '../core/config';

@Injectable()
export class AuthenticationService {
    public token: string;

    private _apiUrl = CONFIG.baseUrl;
    private _loginURL = this._apiUrl + 'auth/login';

    constructor(private _http: Http) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
    login(body: User): any {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); // Create a request option
        // let user: User;
        // let loginInfo = { email, password }
        return this._http.post(this._loginURL, body, options)
            // .subscribe(u => console.log (u));
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().data.token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store email and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ email: body.email, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
