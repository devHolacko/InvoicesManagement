using System;
using System.Collections.Generic;
using System.Text;

namespace Invoices.Model
{
    //handling the listing paging
    public class ListPaging
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string SearchInput { get; set; }
        public string SortingColumn { get; set; }
        public bool IsDescending { get; set; }
    }
}
