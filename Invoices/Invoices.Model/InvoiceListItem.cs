using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Model
{
    //object of the required items to be shown in the invoices list
    public class InvoiceListItem
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public float Amount { get; set; }
        public bool CanEdit { get; set; }
    }
}
