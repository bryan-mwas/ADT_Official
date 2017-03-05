import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldFilter',
})
export class FieldFilterPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    if (!value) return items;
    // Filter all the fields
    if (field == 'All') {
      return items.filter(it => 
        it['ccc_number'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['first_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1 ||
        it['phone_number'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1
        // it['current_status_name'].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1
        );
    }
    return items.filter(it => it[field].toString().toLowerCase().indexOf(value.toLowerCase().toString()) > -1);
  }
}

