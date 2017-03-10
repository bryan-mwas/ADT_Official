export interface IDrugs {
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
    generic: IGeneric;
}

export interface StockDrugs {
    unit: string;
    pack_size: number;
    generic: string;
    dose: string;
    batch_number: string;
    expiry_date: string;
    balance_before: number;
    balance_after: number;
    unit_cost: number;
    comment: string;
    store: number;
    id: number;
    name: string;
}

export interface IGeneric {
    id: number;
    name: string;
}

export interface IStockDrug {
    drug: IDrugs;
    unit;
    stock_item: IStockItem;
    stock: IStock;
}

export interface IStockItem {
    id: number;
    batch_number: string;
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
}

export interface IStock {
    id: number;
    transaction_time: string; // TODO: Make it of type date/time
    transaction_detail: string;
    ref_number: number;
    user_id: number;
    store_id: number;
    facility_id: number;
    transaction_type_id: number;
}

export class Store {
    id: number;
    name: string;
    type: string;
}
