using Invoices.Data.Model.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Data.Model.Entities
{
    //Base entity to be inherited by any other entity with the common fields
    public class BaseEntity : IEntity
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
