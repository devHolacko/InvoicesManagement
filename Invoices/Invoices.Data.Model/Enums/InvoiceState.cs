using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Data.Model.Enums
{
    //the invoice state enum
    public enum InvoiceState
    {
        New=100,
        Paid=200,
        Cancelled=300
    }
}
