export class Transaction {
    id: number;
    name: string;
    stock_item: StockItem[];
}

export class StockItem {
    id: number;
    batch_number: number;
    expiry_date: string;
    quantity_in: number;
    quantity_out: number;
    quantity_packs: number;
    balance_before: number;
    balance_after: number;
    unit_cost: number;
    total_cost: number;
    comment: string;
    drug_id: number;
    stock_id: number;
    drug: Drug;
}

export class Drug {
    id: number;
    name: string;
    pack_size: number;
    duration: number;
    quantity: number;
    is_arv: number;
    is_tb: number;
    is_oi: number;
    unit_id: number;
    dose_id: number;
    generic_id: number;
    supporter_id: number; 
}