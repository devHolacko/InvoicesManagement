using Invoices.Data.Model.Enums;
using Invoices.Data.Model.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Data.Model.Entities
{
    //the invoice entity
    public class Invoice : BaseEntity
    {

        public string Description { get; set; }
        public InvoiceType Type { get; set; }

        public DateTime DueDate { get; set; }
        public float Amount { get; set; }
        public InvoiceState State { get; set; }

    }
}
