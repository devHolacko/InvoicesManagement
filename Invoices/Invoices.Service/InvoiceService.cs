using Invoices.Service.Interfaces;
using System;
using Invoices.Model;
using Invoices.Data.Context.Interfaces;
using Invoices.Data.Model.Entities;
using Invoices.Data.Model.Enums;
using System.Collections.Generic;
using System.Linq;

namespace Invoices.Service
{
    //The service layer of the Invoice that implements the IInvoiceService interface
    public class InvoiceService : IInvoiceService
    {
        private readonly IRepository<Invoice> _invoiceRepository;
        public InvoiceService(IRepository<Invoice> invoiceRepository)
        {
            _invoiceRepository = invoiceRepository;
        }
        public RequestResponse<object> CreateInvoice(CreateInvoiceModel invoiceToCreate)
        {
            if (invoiceToCreate == null)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Invalid invoice data" };
            if (invoiceToCreate.Amount <= 0)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Invoice amount must be greater than 0" };
            if (invoiceToCreate.CreationDate == default(DateTime))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please enter Creation date" };
            if (invoiceToCreate.DueDate == default(DateTime))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please enter Due Date" };
            if (string.IsNullOrEmpty(invoiceToCreate.Description) || invoiceToCreate.Description.Length > 200)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Invoice description length must be 200 characters maximum" };
            if (!Enum.IsDefined(typeof(InvoiceState), invoiceToCreate.InvoiceState))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please select a valid Invoice State" };
            if (!Enum.IsDefined(typeof(InvoiceType), invoiceToCreate.InvoiceType))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please select a valid invoice type" };
            if (invoiceToCreate.CreationDate > invoiceToCreate.DueDate)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Due Date must be greater than Creation Date" };
            var mappedInvoice = new Invoice { Amount = invoiceToCreate.Amount, CreationDate = invoiceToCreate.CreationDate, Description = invoiceToCreate.Description, DueDate = invoiceToCreate.DueDate, State = (InvoiceState)invoiceToCreate.InvoiceState, Type = (InvoiceType)invoiceToCreate.InvoiceType };

            var createdInvoice = _invoiceRepository.Create(mappedInvoice);
            if (createdInvoice == null)
                return new RequestResponse<object> { Success = false, Data = null, Message = "An error occured. Please try again later" };

            return new RequestResponse<object> { Success = true, Data = null, Message = "Created successfully" };
        }

        public RequestResponse<CreateInvoiceModel> GetInvoice(Guid invoiceId)
        {
            if (invoiceId == Guid.Empty)
                return new RequestResponse<CreateInvoiceModel> { Success = false, Data = null, Message = "Invalid invoice Id" };

            var selectedInvoice = _invoiceRepository.Get(invoiceId);
            if (selectedInvoice == null)
                return new RequestResponse<CreateInvoiceModel> { Success = false, Data = null, Message = "Selected Invoice couldn't be found" };

            var mappedInvoice = new CreateInvoiceModel { Id = selectedInvoice.Id, Amount = selectedInvoice.Amount, CreationDate = selectedInvoice.CreationDate, Description = selectedInvoice.Description, DueDate = selectedInvoice.DueDate, InvoiceState = (int)selectedInvoice.State, InvoiceType = (int)selectedInvoice.Type };

            return new RequestResponse<CreateInvoiceModel> { Success = true, Data = new List<CreateInvoiceModel> { mappedInvoice }, Message = "Selected successfully" };
        }

        public RequestResponse<InvoiceListItem> GetInvoices(ListPaging pagingdDetails)
        {
            //Validate that entered page size is valid
            if (pagingdDetails.PageSize < 1)
                return new RequestResponse<InvoiceListItem> { Success = false, Message = "Page size must be greater than 0", Data = null };
            //validate that entered page number is valid
            if (pagingdDetails.PageNumber < 1)
                return new RequestResponse<InvoiceListItem> { Success = false, Message = "Page number must be greater than 0", Data = null };
            //list of returned invoices
            var lstData = new List<InvoiceListItem>();
            IEnumerable<Invoice> lstFilteredData = _invoiceRepository.ListAll();
            int recordsCount = 0; //total records number
            //checking if the user entered a search criteria or not to check if any record contains this word
            if (!string.IsNullOrEmpty(pagingdDetails.SearchInput))
            {
                lstFilteredData =
                    _invoiceRepository.Filter(i => i.Description.Contains(pagingdDetails.SearchInput)
                    || i.DueDate.ToLongDateString().Contains(pagingdDetails.SearchInput)
                    || i.Amount.ToString().Contains(pagingdDetails.SearchInput));
            }
            //checking that the user clicked a column to sort by or not
            if (!string.IsNullOrEmpty(pagingdDetails.SortingColumn))
            {
                switch (pagingdDetails.SortingColumn.ToLower())
                {
                    case "id":
                        lstFilteredData = pagingdDetails.IsDescending ? lstFilteredData.OrderByDescending(i => i.Id) : lstFilteredData.OrderBy(i => i.Id);
                        break;
                    case "amount":
                        lstFilteredData = pagingdDetails.IsDescending ? lstFilteredData.OrderByDescending(i => i.Amount) : lstFilteredData.OrderBy(i => i.Amount);
                        break;
                    case "description":
                        lstFilteredData = pagingdDetails.IsDescending ? lstFilteredData.OrderByDescending(i => i.Description) : lstFilteredData.OrderBy(i => i.Description);
                        break;
                    case "duedate":
                        lstFilteredData = pagingdDetails.IsDescending ? lstFilteredData.OrderByDescending(i => i.DueDate) : lstFilteredData.OrderBy(i => i.DueDate);
                        break;
                    default:
                        lstFilteredData = pagingdDetails.IsDescending ? lstFilteredData.OrderByDescending(i => i.Id) : lstFilteredData.OrderByDescending(i => i.Id);
                        break;
                }
            }
            else
                //setting the default sort with id in case no column was selected
                lstFilteredData = pagingdDetails.IsDescending ? lstFilteredData.OrderByDescending(i => i.Id) : lstFilteredData.OrderByDescending(i => i.Id);

            //getting total number of records
            recordsCount = lstFilteredData.Count();
            //getting the number of pages
            var totalPages = (int)Math.Ceiling((double)recordsCount / (double)pagingdDetails.PageSize);
            //making sure that the page number doesn't exceed the total pages number
            if (pagingdDetails.PageNumber > totalPages)
                return new RequestResponse<InvoiceListItem> { Success = false, Message = "Page number can't be greater than Total pages", Data = null };
            var skipValue = pagingdDetails.PageNumber - 1 * pagingdDetails.PageSize; //preparing the skip value
            //preparing the take value - here we're calculating the number of records should be taken to be returned to the user. In case it was the last page, we calculate the number of remaining items only to take them
            var takeValue = (totalPages * pagingdDetails.PageSize) < recordsCount ? pagingdDetails.PageSize : recordsCount - ((pagingdDetails.PageNumber - 1) * pagingdDetails.PageSize);
            //checking if the total records count is bigger than the page size or not to apply the paging
            if (lstFilteredData.Count() > pagingdDetails.PageSize)
                lstFilteredData = lstFilteredData.Skip(skipValue).Take(takeValue);
            //mapping the data from the entity to the Model
            foreach (var item in lstFilteredData)
            {
                lstData.Add(new InvoiceListItem { Id = item.Id, Description = item.Description, Amount = item.Amount, DueDate = item.DueDate, CanEdit = item.State != InvoiceState.Paid });
            }

            return new RequestResponse<InvoiceListItem> { Success = true, Message = string.Empty, Data = lstData, PagesNumber = totalPages };
        }

        public RequestResponse<object> UpdateInvoice(CreateInvoiceModel invoiceToEdit)
        {
            if (invoiceToEdit == null || invoiceToEdit.Id == Guid.Empty)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Invalid invoice data" };
            if (invoiceToEdit.Amount <= 0)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Invoice amount must be greater than 0" };
            if (invoiceToEdit.CreationDate == default(DateTime))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please enter Creation date" };
            if (invoiceToEdit.DueDate == default(DateTime))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please enter Due Date" };
            if (string.IsNullOrEmpty(invoiceToEdit.Description) || invoiceToEdit.Description.Length > 200)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Invoice description length must be 200 characters maximum" };
            if (!Enum.IsDefined(typeof(InvoiceState), invoiceToEdit.InvoiceState))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please select a valid Invoice State" };
            if (!Enum.IsDefined(typeof(InvoiceType), invoiceToEdit.InvoiceType))
                return new RequestResponse<object> { Success = false, Data = null, Message = "Please select a valid invoice type" };
            if (invoiceToEdit.CreationDate > invoiceToEdit.DueDate)
                return new RequestResponse<object> { Success = false, Data = null, Message = "Due Date must be greater than Creation Date" };
            var mappedInvoice = new Invoice { Id = invoiceToEdit.Id, Amount = invoiceToEdit.Amount, CreationDate = invoiceToEdit.CreationDate, Description = invoiceToEdit.Description, DueDate = invoiceToEdit.DueDate, State = (InvoiceState)invoiceToEdit.InvoiceState, Type = (InvoiceType)invoiceToEdit.InvoiceType };
            mappedInvoice.ModifiedDate = DateTime.Now;
            _invoiceRepository.Update(mappedInvoice);


            return new RequestResponse<object> { Success = true, Data = null, Message = "Created successfully" };
        }
    }
}
