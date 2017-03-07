import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {
  // Returns patients with a status other than active
  filterByStatus(patient) {
    if (patient.current_status_name !== 'active') {
      return true;
    }
  }
  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    if (!value) return items;
    // Filter all the fields
    if (field == 'all') {
      return items.filter(it =>
        it['ccc_number'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['first_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['other_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['last_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['phone_number'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1
      );
    }
    if(field == 'patient_name') {
      return items.filter(it =>
        it['first_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['other_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['last_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1
      );
    }
    if (field == 'current_status_name' && value == 'inactive') {
      return items.filter(this.filterByStatus);
    }
    return items.filter(it => it[field].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1);
  }
}

