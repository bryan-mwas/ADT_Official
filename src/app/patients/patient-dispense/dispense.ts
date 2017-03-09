export class DrugsTable {
    drug_id: number;
    batch_number: number;
    dose_id: number;
    actual_pill_count: number;
    duration: number;
    quantity_out: number;
    indication_id: number;
    unit_cost: number;  //<--- Temporary
    expiry_date: string;
    expected_pill_count: number;
    balance_after: number; // <--- Refers to the stock on hand
    comment: number;
    missed_pill_count: number;
}