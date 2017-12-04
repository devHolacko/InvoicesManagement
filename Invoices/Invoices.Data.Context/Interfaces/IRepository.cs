using Invoices.Data.Model.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Data.Context.Interfaces
{
    //Interface for implementing generic repository
    public interface IRepository<T> where T : IEntity
    {
        T Create(T entity);
        void CreateMultiple(ICollection<T> listToCreate);
        void Update(T entity);
        IEnumerable<T> ListAll();
        IEnumerable<T> Filter(Func<T, bool> predicate);
        T Get(Guid id);
    }
}
