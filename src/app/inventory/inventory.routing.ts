import { RouterModule, Routes } from '@angular/router';
import { BinCardComponent } from './bin-card/bin-card.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { StockTransactionsComponent } from './stock-transactions/stock-transactions.component';

export const routes: Routes = [
    {
        path: 'inventory-management',
        component: InventoryManagementComponent,
        data: { pageTitle: 'Store / Inventory Management' }
    },
    {
        path: 'bin-card/:id',
        component: BinCardComponent,
        data: { pageTitle: 'Drug Bin Card' }
    },
    {
        path: 'stock-transactions/:id',
        component: StockTransactionsComponent,
        data: { pageTitle: 'Stock Transactions' }
    }
];

export const routing = RouterModule.forChild(routes);