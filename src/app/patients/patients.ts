export class Patient {
    patient_tb = new PatientTb;
    birth_place = new PlaceOfBirth;
    patient_source = new Source;
    familyplanning = new FamilyPlanning;
    // patient_prophylaxis = new Prophylaxis;
    drug_allergies = new Allergies;
    illness = new Illness;
    oher_illness = new Illness;
    other_drug_allergies = new Allergies;
    id: number;
    ccc_number: string;
    first_name: string;
    last_name: string;
    other_name: string;
    birth_date: string;
    place_of_birth = this.birth_place;
    is_disclosure: any;
    age_in_years: number;
    age_in_months: number;
    initial_weight: number;
    current_weight: number;
    initial_height: number;
    current_height: number;
    initial_bsa: number;
    current_bsa: number;
    phone_number: number;
    physical_address: string;
    gender: string;
    is_pregnant: number;
    is_tb: number;
    is_tb_tested?: number;
    is_sms: number;
    is_smoke: number;
    is_alcohol: number;
    current_status: any;
    enrollment_date: string;
    regimen_start_date: string;
    regimen_id: number;
    service = new Service;
    facility_id: number = 1;
    supporter_id: number = 1;
    who_stage_id: number;
    prophylaxis: Prophylaxis[];
    source_id: number;
    county_sub_id: number;
    // optional properties
    status?: string;
    disclosure?: number;
    spouse_ccc?: number;
    family_planning: FamilyPlanning;
    support_group?: string;
    alternate_number?: number;
    other_drug: any;
    other_illness?: string;
    other_drug_allergy: any;
    illnesses: Illness[];
    drug_allergy: any[];
    current_status_id: number;
    tb_category?: string;
    tb_phase?: string;
    start_date?: string;
    end_date?: string;
    pep_reason?: string;
    isoniazid_start?: string;
    isoniazid_end?: string;
    patient_status: string;
    who_stage = new Who_stage;
    first_visit: Object;
    // toggle
    is_support: boolean;
    is_illness: boolean;
    is_drugs: boolean;
    is_allergies: boolean;
    patient_drug_other: Allergies[];
    tb: PatientTb;
    source = this.patient_source;
    visit: any;
    next_appointment_date: string;
}

export class Service {
    id: number;
    name: string;
}

export class Drugs {
    id: number;
    name: string;
}

// populating the multiselect
export class Allergies {
    id: number;
    name: string;
}

export class PatientTb {
    category: number;
    phase: string;
    start_date: string;
    end_date: string;
}

export class Regimen { id: number; name: string; }

export class Prophylaxis { id: number; name: string; }

export class Who_stage { id: number; stage: string; }

export class Status { id: number; name: string; }

export class Pep_reason { id: number; name: string }


export class Source {
    id: number;
    name: string;
}

export class Illness {
    id: number;
    name: string;
}

export class date {
    months: number;
    years: number;
}

export class FamilyPlanning {
    id: number;
    name: string;
}

export class PlaceOfBirth {
    id: number;
    name: string;
}

