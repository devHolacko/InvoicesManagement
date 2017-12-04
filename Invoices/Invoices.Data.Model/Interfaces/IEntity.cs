using System;

namespace Invoices.Data.Model.Interfaces
{
    //Base entity interface to be implemented by the base entity class
    public interface IEntity
    {
        Guid Id { get; set; }
        DateTime CreationDate { get; set; }
    }
}
