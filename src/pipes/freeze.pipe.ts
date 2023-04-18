import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FreezePipe implements PipeTransform {
  transform(value: unknown) {
    return Object.freeze(value);
  }
}
