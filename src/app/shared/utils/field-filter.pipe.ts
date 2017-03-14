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
    if (field == 'orders') {
      return items.filter(it =>
        it['code'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['period_begin'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['status'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['facility_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1
      );
    }
    // When filtering the period. The value is passed as "Month-Year".
    // Splits the string to create an array. Each index holds month and year respectively
    // Returns an item whose year and month matches the selected filter option
    if (field === 'period') {
      let monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let a = value.split('-');
        return items.filter(it => new Date(it['period_begin']).getFullYear().toString().toLowerCase().indexOf(a[1].toLowerCase().toString()) > -1 && 
          new Date(it['period_begin']).getMonth().toString().toLowerCase().indexOf(monthsList.indexOf(a[0]).toString()) > -1
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

