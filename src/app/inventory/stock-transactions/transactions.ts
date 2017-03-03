export class Types {
    id: number;
    name: string;
    effect: number;
}
export class Transaction {
    id: number;
    name: string;
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

export class StoreItem {
    store_id: number;
    drug_id: number;
    batch_number: string;
    expiry_date: string;
    balance: number;
    unit_cost: number;
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
    drug_generic: string;
    drug_unit: string;
    drug_dose: string;
    drug_supporter: string;
}

export class Store {
    id: number;
    name: string;
    type: string;
}
