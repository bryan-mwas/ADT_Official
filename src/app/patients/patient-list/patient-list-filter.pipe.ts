import { PipeTransform, Pipe } from '@angular/core';
import { Patient } from '../patients';

@Pipe({
    name: 'patientFilter'
})
export class PatientFilterPipe implements PipeTransform {
    transform(value: Patient[], filterBy: string): Patient[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        let patient = new Patient;
        if (patient.current_status && patient.current_status[0]) {
            return filterBy ? value.filter((patient: Patient) =>
            patient.current_status[0].name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
        }
    }
}