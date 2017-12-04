import { OnInit, Component } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ToastrService } from 'toastr-ng2'
import { Router } from '@angular/router'

import { HelperService } from '../../../shared/services/helper.service';
import * as enums from '../../../shared/enums/AppEnums'
import { ICreateInvoice } from '../../../shared/interfaces/ICreateInvoice';
import { InvoiceService } from '../../../shared/services/invoice.service'
import { LoaderService } from '../../../shared/services/loader.service'
import { Route } from '@angular/router/src/config';

@Component({
    selector: 'create-invoice',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateInvoiceComponent implements OnInit {

    invoiceTypeKeys: any;
    invoiceStateKeys: any;

    invoiceType = enums.InvoiceType;
    invoiceState = enums.InvoiceState;


    newInvoiceForm: FormGroup;
    private minDate;
    private minDueDate;
    constructor(private helper: HelperService, private toastr: ToastrService, private invoices: InvoiceService, private loader: LoaderService, private router: Router) {
        this.invoiceTypeKeys = this.helper.dropDownFromEnum(this.invoiceType);
        this.invoiceStateKeys = this.helper.dropDownFromEnum(this.invoiceState);

        var day: number = new Date().getDate();
        var month: number;
        if (new Date().getUTCMonth() != 12)
            month = new Date().getUTCMonth() + 1;
        else
            month = 1;
        var year: number = new Date().getUTCFullYear();
        this.minDate = { year: year, month: month, day: day };
        this.minDueDate = { year: year, month: month, day: day };
    }
    ngOnInit() {
        this.initFormGroup();

        this.newInvoiceForm.valueChanges.subscribe(data => {
            this.initFormGroup();
        })
    }

    isFieldValid(field: string): boolean {
        var result = !this.newInvoiceForm.get(field).valid && this.newInvoiceForm.get(field).dirty;
        if (field == "DueDate") {
            var dueDate = this.newInvoiceForm.get(field).value;
            var creationDate = this.newInvoiceForm.get("CreationDate").value;

            if (Date.parse(dueDate) <= Date.parse(creationDate)) {
                return true;
            }
        }
        return result;
    }

    newInvoice(formResult) {
        let values = <ICreateInvoice>formResult.value;
        if (formResult.valid) {
            var toPost: ICreateInvoice = values;
            var creationDate = (<any>toPost.creationDate).year + "-" + (<any>toPost.creationDate).month + "-" + (<any>toPost.creationDate).day;
            var dueDate = (<any>toPost.dueDate).year + "-" + (<any>toPost.dueDate).month + "-" + (<any>toPost.dueDate).day;
            toPost.creationDate = creationDate;
            toPost.dueDate = dueDate;
            this.loader.show();
            this.invoices.createInvoice(toPost).subscribe(result => {
                if (result.success) {
                    this.toastr.success("Invoice created successfully", "Create Invoice");
                    this.router.navigateByUrl('/list');
                } else {
                    this.toastr.warning(result.message, "Create Invoice");
                }
                this.loader.hide();
            }, err => {
                this.toastr.error("An error occured", "Create Invoice");
                this.loader.hide();
            }, () => {
                this.loader.hide();
            });

        } else {
            Object.keys(this.newInvoiceForm.controls).forEach(key => {
                if (!this.newInvoiceForm.controls[key].valid) {
                    this.newInvoiceForm.controls[key].markAsDirty();
                }
            });
            this.toastr.warning("Please enter the required fields", "Create Invoice");
        }
    }

    initFormGroup() {
        if (this.newInvoiceForm == null) {
            this.newInvoiceForm = new FormGroup({
                invoiceType: new FormControl("", [Validators.required]),
                invoiceState: new FormControl("", [Validators.required]),
                description: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
                creationDate: new FormControl("", Validators.required),
                dueDate: new FormControl("", [Validators.required]),
                amount: new FormControl("", [Validators.required, Validators.min(1)])
            });
        }
    }



    creationDateChanged(data) {
        var monthsMoreThan30 = [1, 3, 5, 7, 8, 10, 12];
        var year = data.year;
        var month = data.month;
        var day = data.day;
        if (month == 12 && day == 31) {
            month = 1;
            day = 1;
            year = year + 1;
        } else if (month == 12 && day < 31) {
            day = day + 1;
        } else if (monthsMoreThan30.includes(month)) {
            if (day == 31) {
                day = 1;
                month = month + 1;
            } else {
                day = day + 1;
            }
        } else {
            if (month == 2) {
                if (day == 28 || day == 29) {
                    day = 1;
                    month = month + 1;
                }
                else {
                    day = day + 1;
                }
            } else {
                if (day == 30) {
                    day = 1;
                    month = month + 1;
                } else {
                    day = day + 1;
                }
            }
        }

        this.minDueDate = { year: year, month: month, day: day };
    }

}