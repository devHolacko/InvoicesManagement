using Microsoft.EntityFrameworkCore;
using System;
using Invoices.Data.Model.Entities;

namespace Invoices.Data.Context
{
    //The database context of the project
    public class InvoicesContext : DbContext
    {
        public DbSet<Invoice> Invoices { get; set; }
        public InvoicesContext(DbContextOptions<InvoicesContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Invoice>().HasKey(i => i.Id); //setting the primary key of the Invoice entity
            builder.Entity<Invoice>().Property(i => i.Id).ValueGeneratedOnAdd(); //Auto-generating the id of the Invoices entity
            builder.Entity<Invoice>().Property(i => i.Amount).IsRequired(); // Setting the amount to be required
            builder.Entity<Invoice>().Property(i => i.Description).IsRequired(); // setting the description to be required
            builder.Entity<Invoice>().Property(i => i.Description).HasMaxLength(200); // setting the description length to be 200 characters maximum
            builder.Entity<Invoice>().Property(i => i.DueDate).IsRequired(); // setting the due date to be required.
            builder.Entity<Invoice>().Property(i => i.State).IsRequired(); //setting the Invoice state to be required
            builder.Entity<Invoice>().Property(i => i.Type).IsRequired(); //setting the Invoice type to be required
        }
    }
}
