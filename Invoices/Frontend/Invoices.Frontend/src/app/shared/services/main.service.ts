import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { IRequestResponse } from '../interfaces/IRequestResponse'
import { HelperService } from '../services/helper.service'
import { AppLinks } from '../resources/links.resources'

@Injectable()

export class MainService {
    protected options: RequestOptions;
    constructor(protected http: Http, protected helper: HelperService, protected links: AppLinks) {
        var header = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        });

        this.options = new RequestOptions({ headers: header });
    }

    protected extractData(res: Response): IRequestResponse<any> {
        let body = res.json();
        return <IRequestResponse<any>>body;
    }

    protected handleError(error: Response | any) {
        console.error(error);
        return Observable.throw(error.message || error);
    }

    protected handleErrorPromise(error: Response | any) {
        console.error(error);
        return Promise.reject(error.message | error);

    }
}