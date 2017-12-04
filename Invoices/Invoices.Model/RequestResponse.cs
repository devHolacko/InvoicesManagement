using System;
using System.Collections.Generic;

namespace Invoices.Model
{
    //The result of any http request should be returning this type to make it easy on the front end to check the request status
    public class RequestResponse<T> where T : class
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<T> Data { get; set; }
        public int? PagesNumber { get; set; }
    }
}
