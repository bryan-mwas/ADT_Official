import { Pipe, PipeTransform } from '@angular/core';
import { Supporters } from '../facility'

@Pipe({
  name: 'facilitySupporters'
})
export class FacilitySupportersPipe implements PipeTransform {

  transform(value: Supporters[], column: string, filterBy: string): Supporters[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((supporter: Supporters) =>
      supporter[`${column}`].toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
