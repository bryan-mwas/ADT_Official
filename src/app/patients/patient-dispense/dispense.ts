export class DrugsTable {
    drug_id: number;
    batch_number: number;
    dose_id: number;
    actual_pill_count: number;
    duration: number;
    quantity_out: number;
    indication_id: number;
    unit: string;  //<--- Temporary
    expiry_date: string;
    expected_pill_count: number;
    balance_before: number; // <--- Refers to the stock on hand
    comment: number;
    missed_pill_count: number;
}