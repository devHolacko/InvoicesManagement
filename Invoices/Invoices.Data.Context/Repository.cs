using Invoices.Data.Context.Interfaces;
using Invoices.Data.Model.Entities;
using Invoices.Data.Model.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Invoices.Data.Context
{
    //generic repository for the crud operations
    public class Repository<T> : IDisposable, IRepository<T> where T : BaseEntity
    {
        private readonly InvoicesContext _context;
        private readonly DbSet<T> _entity;
        public Repository(InvoicesContext context)
        {
            _context = context;
            _entity = _context.Set<T>();
            _context.Database.EnsureCreated();

        }
        public T Create(T entity)
        {
            if (entity == null)
                return null;

            _context.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public void CreateMultiple(ICollection<T> lstToAdd)
        {
            _context.AddRange(lstToAdd);
            _context.SaveChanges();
        }

        public IEnumerable<T> Filter(Func<T, bool> predicate)
        {
            return _entity.Where(predicate);
        }

        public T Get(Guid id)
        {
            if (id == Guid.Empty)
                return null;
            return _entity.SingleOrDefault(e => e.Id.Equals(id));
        }

        public IEnumerable<T> ListAll()
        {
            return _entity.AsEnumerable();
        }

        public void Update(T entity)
        {
            T exist = _context.Set<T>().Find(entity.Id);
            if (exist != null)
            {
                _context.Entry(exist).CurrentValues.SetValues(entity);
                _context.SaveChanges();
            }
        }

        public void Dispose()
        {
            _context.Dispose();

        }

    }
}
