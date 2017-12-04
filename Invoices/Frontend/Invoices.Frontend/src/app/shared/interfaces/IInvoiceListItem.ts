import { Guid } from '../types/Guid'

export interface IInvoiceListItem {
    id: Guid;
    description: string;
    dueDate: string;
    amount: number;
    canEdit:boolean;
}