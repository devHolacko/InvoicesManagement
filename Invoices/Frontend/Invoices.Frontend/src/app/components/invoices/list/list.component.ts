import { OnInit, Component } from '@angular/core'

import { InvoiceService } from '../../../shared/services/invoice.service'
import { LoaderService } from '../../../shared/services/loader.service'
import { IListPaging } from '../../../shared/interfaces/IListPaging'
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap/pagination/pagination-config';
import { IInvoiceListItem } from '../../../shared/interfaces/IInvoiceListItem';
import * as enums from '../../../shared/enums/AppEnums'
import { resetFakeAsyncZone } from '@angular/core/testing';

@Component({
    selector: 'list-invoice',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListInvoicesComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 1;
    totalPages: number = 0;
    paging: IListPaging;
    arrInvoices: IInvoiceListItem[];
    searchText: string = "";
    isDescending: boolean = false;
    currentSortingColumn: string = "Id";

    invoiceType = enums.InvoiceType;
    invoiceState = enums.InvoiceState;

    maxPageNumber: number = 1;

    enteredPageNumber: number = 1;

    constructor(private invoices: InvoiceService, private loader: LoaderService) {

    }
    ngOnInit() {
        this.paging = {
            IsDescending: this.isDescending,
            PageNumber: this.pageNumber,
            PageSize: this.pageSize,
            SearchInput: "",
            SortingColumn: this.currentSortingColumn
        }
        this.getFilteredInvoices();
    }

    isEnabled(buttonName): boolean {
        var isEnabled = false;
        switch (buttonName) {
            case "LastPage":
                if (this.totalPages == null || this.totalPages == this.pageNumber || this.totalPages == 0)
                    isEnabled = false;
                else
                    isEnabled = true;
                break;

            case "FirstPage":
                if (this.pageNumber == 1)
                    isEnabled = false;
                else
                    isEnabled = true;
                break;
            case "NextPage":
                if (this.totalPages <= this.pageNumber)
                    isEnabled = false;
                else
                    isEnabled = true;
                break;
            case "PreviousPage":
                if (this.pageNumber > 1)
                    isEnabled = true;
                else
                    isEnabled = false;
                break;
            case "PageSearch":
                if (this.totalPages < 2)
                    isEnabled = false;
                else
                    isEnabled = true;
            default:
                isEnabled = false;
                break;
        }

        return isEnabled;
    }

    changePage(type: string) {
        switch (type) {
            case "Next":
                this.pageNumber = this.pageNumber + 1;
                break;
            case "Previous":
                this.pageNumber = this.pageNumber - 1;
                break;
            case "First":
                this.pageNumber = 1;
                break;
            case "Last":
                this.pageNumber = this.totalPages;
            default:
                this.pageNumber = this.pageNumber;
                break;
        }
        this.paging.PageNumber = this.pageNumber;
        this.getFilteredInvoices();
    }

    sort(name) {
        if (this.currentSortingColumn == name)
            this.isDescending = !this.isDescending;

        this.paging.SortingColumn = name;
        this.paging.IsDescending = this.isDescending;
        this.currentSortingColumn = name;
        this.getFilteredInvoices();
    }

    search() {
        this.paging.SearchInput = this.searchText;
        this.getFilteredInvoices();
    }

    filterByEnter() {
        this.pageNumber = this.enteredPageNumber;
        this.paging.PageNumber = this.pageNumber;
        this.getFilteredInvoices();
    }

    getFilteredInvoices() {
        this.maxPageNumber = this.totalPages;
        this.loader.show();
        this.invoices.listInvoices(this.paging).subscribe(result => {
            this.totalPages = result.pagesNumber;
            this.arrInvoices = result.data;
            this.loader.hide();
        }, err => {
            this.loader.hide();
        }, () => {
            this.loader.hide();
        });
    }
}