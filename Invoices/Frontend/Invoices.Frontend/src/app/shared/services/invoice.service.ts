import { Injectable, Inject } from '@angular/core'
import { Http } from '@angular/http'
import { Observable } from 'rxjs/Observable'

import { IRequestResponse } from '../interfaces/IRequestResponse'
import { ICreateInvoice } from '../interfaces/ICreateInvoice'
import { IListPaging } from '../interfaces/IListPaging'
import { MainService } from '../services/main.service'
import { HelperService } from '../services/helper.service'
import { AppLinks } from '../resources/links.resources'
import { IInvoiceListItem } from '../interfaces/IInvoiceListItem';
import { Guid } from '../types/Guid';

@Injectable()
export class InvoiceService extends MainService {
    constructor(protected http: Http, protected helper: HelperService, protected links: AppLinks) {
        super(http, helper, links);
    }

    public createInvoice(invoiceToAdd: ICreateInvoice): Observable<IRequestResponse<object>> {
        var url = this.links.getCreateInvoiceLink();

        return this.http.post(url, this.helper.objectToUrl(invoiceToAdd).substring(1).trim(), this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public listInvoices(paging: IListPaging): Observable<IRequestResponse<IInvoiceListItem>> {
        var url = this.links.getListAllInvoicesLink();

        return this.http.post(url, this.helper.objectToUrl(paging).substring(1).trim(), this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public updateInvoice(invoiceToUpdate: ICreateInvoice): Observable<IRequestResponse<object>> {
        var url = this.links.getUpdateInvoiceLink();

        return this.http.put(url, this.helper.objectToUrl(invoiceToUpdate).substring(1).trim(), this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getInvoice(invoiceId: Guid): Observable<IRequestResponse<ICreateInvoice>> {
        var url = this.links.getInvoiceLink(invoiceId);
        return this.http.get(url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }
}