using Invoices.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Service.Interfaces
{
    //The service layer interface for the invoice to be implemented by the InvoiceService class
    public interface IInvoiceService
    {
        RequestResponse<InvoiceListItem> GetInvoices(ListPaging pagindDetails);
        RequestResponse<CreateInvoiceModel> GetInvoice(Guid invoiceId);
        RequestResponse<object> CreateInvoice(CreateInvoiceModel invoiceToCreate);
        RequestResponse<object> UpdateInvoice(CreateInvoiceModel invoiceToEdit);
    }
}
