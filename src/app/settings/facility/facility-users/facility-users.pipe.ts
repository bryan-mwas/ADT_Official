import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../facility';

@Pipe({
  name: 'facilityUsers'
})
export class FacilityUsersPipe implements PipeTransform {

  transform(value: User[], column: string, filterBy: string): User[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((users: User) =>
      users[`${column}`].toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
