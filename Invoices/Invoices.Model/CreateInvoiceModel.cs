using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Model
{
    //required fields for Creating a new invoice or updating existing one
    public class CreateInvoiceModel : InvoiceListItem
    {
        public int InvoiceType { get; set; }
        public DateTime CreationDate { get; set; }
        public int InvoiceState { get; set; }
    }
}
