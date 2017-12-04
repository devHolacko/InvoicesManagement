import { IInvoiceListItem } from './IInvoiceListItem';
import * as Enums from '../enums/AppEnums'

export interface ICreateInvoice extends IInvoiceListItem {
    invoiceType: Enums.InvoiceType;
    invoiceState: Enums.InvoiceState;
    creationDate: string;
}