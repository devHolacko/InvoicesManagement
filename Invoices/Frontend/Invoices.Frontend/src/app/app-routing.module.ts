import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListInvoicesComponent } from './components/invoices/list/list.component'
import { CreateInvoiceComponent } from './components/invoices/create/create.component'
import { UpdateInvoiceComponent } from './components/invoices/update/update.component'
import { NotFoundComponent } from './components/not-found/not-found.component'

const routes: Routes = [
    { path: 'list', component: ListInvoicesComponent },
    { path: 'create', component: CreateInvoiceComponent },
    { path: 'update/:id', component: UpdateInvoiceComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}