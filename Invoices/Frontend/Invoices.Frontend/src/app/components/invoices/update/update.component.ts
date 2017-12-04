import { OnInit, Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { ToastrService } from 'toastr-ng2'
import { HelperService } from '../../../shared/services/helper.service';
import * as enums from '../../../shared/enums/AppEnums'
import { ICreateInvoice } from '../../../shared/interfaces/ICreateInvoice';
import { InvoiceService } from '../../../shared/services/invoice.service'
import { LoaderService } from '../../../shared/services/loader.service'
import { Guid } from '../../../shared/types/Guid'
import { resetFakeAsyncZone } from '@angular/core/testing';

@Component({
    selector: 'update-invoice',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss']
})
export class UpdateInvoiceComponent implements OnInit {

    invoiceId: string;
    invoiceTypeKeys: any;
    invoiceStateKeys: any;

    invoiceType = enums.InvoiceType;
    invoiceState = enums.InvoiceState;

    editInvoiceForm: FormGroup;
    private minDate;
    private minDueDate;
    showContent: boolean;
    showData: boolean;
    constructor(private route: ActivatedRoute, private loader: LoaderService,
        private toastr: ToastrService, private router: Router, private invoices: InvoiceService,
        private helper: HelperService) {

        this.route.params.subscribe(params => {
            var id = params['id'];

            if (id && id != "" && Guid.isGuid(id)) {

                this.invoiceId = id;
                this.showContent = true;
                this.showData = false;
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
            } else {
                this.toastr.warning("Invalid Invoice Data", "Edit Post");
                this.showContent = false;
                this.showData = false;
            }

        });

    }

    ngOnInit() {
        if (this.showContent) {

            this.loader.show();
            this.invoices.getInvoice(new Guid(this.invoiceId)).subscribe(result => {
                this.loader.hide();
                if (result.success == true) {

                    if (result.data.length > 0) {
                        console.log(result.data[0]);
                        var invoice = result.data[0];
                        this.initFormGroup(invoice);
                        this.showContent = true;
                        this.editInvoiceForm.valueChanges.subscribe(data => {
                            this.initFormGroup(invoice);
                        })
                    } else {
                        this.showData = false;
                        this.showContent = false;
                        this.toastr.warning("Invalid invoice", "Edit Invoice");
                    }
                } else {
                    this.loader.hide();
                    this.toastr.warning(result.message, "Edit Invoice");
                }
            }, err => {
                this.loader.hide();
                this.toastr.error("An error occured", "Edit Invoice");
                this.showContent = false;
                this.showData = false;
                this.router.navigateByUrl('/not-found');
            }, () => {
                this.loader.hide();
            });
        } else {
        }
    }

    initFormGroup(invoice: ICreateInvoice) {
        if (this.editInvoiceForm == null) {
            var creationDate = new Date(invoice.creationDate);
            var day: number = creationDate.getDate();
            var month: number = creationDate.getUTCMonth() + 1;
            var year: number = creationDate.getUTCFullYear();
            var newCreationDate = { year: year, month: month, day: day };

            var dueDate = new Date(invoice.dueDate);
            var dueDay: number = dueDate.getDate();
            var dueMonth: number = dueDate.getUTCMonth() + 1;
            var dueYear: number = dueDate.getUTCFullYear();
            var newDueDate = { year: dueYear, month: dueMonth, day: dueDay };
            this.editInvoiceForm = new FormGroup({
                amount: new FormControl(invoice.amount, [Validators.required, Validators.min(1)]),
                description: new FormControl(invoice.description, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
                invoiceType: new FormControl(invoice.invoiceType, [Validators.required]),
                invoiceState: new FormControl(invoice.invoiceState, [Validators.required]),
                creationDate: new FormControl(newCreationDate, Validators.required),
                dueDate: new FormControl(newDueDate, [Validators.required]),

            });
            this.showData = true;
        }
    }

    editInvoice(formResult) {
        let values = <ICreateInvoice>formResult.value;
        if (formResult.valid) {
            var toPost: ICreateInvoice = values;

            var creationDate = (<any>toPost.creationDate).year + "-" + (<any>toPost.creationDate).month + "-" + (<any>toPost.creationDate).day;
            var dueDate = (<any>toPost.dueDate).year + "-" + (<any>toPost.dueDate).month + "-" + (<any>toPost.dueDate).day;
            toPost.creationDate = creationDate;
            toPost.dueDate = dueDate;
            toPost.id = new Guid(this.invoiceId);
            console.log(toPost.id);
            this.loader.show();
            this.invoices.updateInvoice(toPost).subscribe(result => {
                if (result.success) {
                    this.toastr.success("Invoice updated successfully", "Edit Invoice");
                    this.router.navigateByUrl('/list');
                } else {
                    this.toastr.warning(result.message, "Edit Invoice");
                }
                this.loader.hide();
            }, err => {
                this.toastr.error("An error occured", "Edit Invoice");
                this.loader.hide();

            }, () => {
                this.loader.hide();
            });

        } else {
            Object.keys(this.editInvoiceForm.controls).forEach(key => {
                if (!this.editInvoiceForm.controls[key].valid) {
                    this.editInvoiceForm.controls[key].markAsDirty();
                }
            });
            this.toastr.warning("Please enter the required fields", "Edit Invoice");
        }
    }

    isFieldValid(field: string): boolean {
        var result = !this.editInvoiceForm.get(field).valid && this.editInvoiceForm.get(field).dirty;
        if (field == "DueDate") {
            var dueDate = this.editInvoiceForm.get(field).value;
            var creationDate = this.editInvoiceForm.get("CreationDate").value;

            if (Date.parse(dueDate) <= Date.parse(creationDate)) {
                return true;
            }
        }
        return result;
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