import { Injectable } from '@angular/core'
import { Guid } from '../types/Guid'

@Injectable()
export class AppLinks {
    private readonly baseUrl = "http://localhost:3388/api/";

    private readonly invoicesModule = "Invoice/";

    private readonly createInvoice = "Create";
    private readonly updateInvoice = "Update";
    private readonly listAllInvoices = "GetList";
    private readonly getInvoice = "Get/";

    public getInvoiceLink(invoiceId: Guid): string {
        return this.baseUrl + this.invoicesModule + this.getInvoice + invoiceId.toString();
    }

    public getListAllInvoicesLink(): string {
        return this.baseUrl + this.invoicesModule + this.listAllInvoices;
    }

    public getUpdateInvoiceLink(): string {
        return this.baseUrl + this.invoicesModule + this.updateInvoice;
    }

    public getCreateInvoiceLink(): string {
        return this.baseUrl + this.invoicesModule + this.createInvoice;
    }
}