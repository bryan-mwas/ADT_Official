export class Order {
    id: number;
    code: string;
    period_begin: string;
    period_end: string;
    status: string;
    facility_id: Facility;
}

export class Facility {
    id: number;
    name: string;
}