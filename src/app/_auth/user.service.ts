import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { CONFIG } from '../core/config';

import { AuthenticationService } from './authentication.service';
import { User } from './user';

@Injectable()
export class UserService {

    private _apiUrl = CONFIG.baseUrl;
    private _loginURL = this._apiUrl + 'auth/login';

    constructor(
        private _http: Http,
        private _authenticationService: AuthenticationService) {
    }

    getUsers(): Observable<User[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this._authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get users from api
        return this._http.get(this._loginURL, options)
            .map((response: Response) => response.json());
    }
}
