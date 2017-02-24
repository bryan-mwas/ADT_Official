import { Pipe, PipeTransform } from '@angular/core';
import { Sources } from '../facility'

@Pipe({
  name: 'facilityPatientSources'
})
export class FacilityPatientSourcesPipe implements PipeTransform {

  transform(value: Sources[], column: string, filterBy: string): Sources[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((source: Sources) =>
      source[`${column}`].toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }
}