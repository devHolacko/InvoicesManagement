using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Invoices.Model;
using Invoices.Service.Interfaces;

namespace Invoices.Api.Controllers
{
    [Produces("application/json")]
    
    public class InvoiceController : Controller
    {
        private readonly IInvoiceService _invoiceService;
        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }
        [HttpPost]
        [Route("api/Invoice/Create")]
        public RequestResponse<object> Create(CreateInvoiceModel invoiceToCreate)
        {
            return _invoiceService.CreateInvoice(invoiceToCreate);
        }

        [HttpPut]
        [Route("api/Invoice/Update")]
        public RequestResponse<object> Update(CreateInvoiceModel invoiceToUpdate)
        {
            return _invoiceService.UpdateInvoice(invoiceToUpdate);
        }
        

        [HttpGet]
        [Route("api/Invoice/Get/{id}")]
        public RequestResponse<CreateInvoiceModel> Get(Guid id)
        {
            return _invoiceService.GetInvoice(id);
        }

        [HttpPost]
        [Route("api/Invoice/GetList")]
        public RequestResponse<InvoiceListItem> GetList(ListPaging pagingdDetails)
        {
            return _invoiceService.GetInvoices(pagingdDetails);
        }
    }
}