export class Facility {
    id: number;
    code: string;
    name: string;
    adult_age: number;
    phone_number: number;
    weekday_max: number;
    weekend_max: number;
    type: Types;
    county: Counties;
    subcounty: SubCounties;
    service: Services;
    is_sms: number;
    supporter_id: number;
}

export class User {
    id: number;
    name: string;
    email: string;
    phone_number: number;
    access_level_id: AccessLevel;
    facility_id: number;
    created_by_id: number;
}

export class Counties {
    id: number;
    name: string
}

export class Types {
    id: number;
    name: string;
}

export class SubCounties {
    id: number;
    name: string;
}

export class Services {
    id: number;
    name: string;
}

export class Sources {
    id: number;
    name: string;
}

export class Supporters {
    id: number;
    name: string;
}

export class AccessLevel {
    id: number;
    name: string;
}
