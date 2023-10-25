import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'datePipe',
})
export class DatePipePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(date: Timestamp | undefined) {
    return this.datePipe.transform(date?.toMillis(), 'dd/MM/yy HH:mm:ss') ?? '';
  }
}
