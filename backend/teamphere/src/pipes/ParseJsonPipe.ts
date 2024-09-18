import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform<string> {
  constructor() {}
  transform(value: string, metadata: ArgumentMetadata) {
    console.log('Validation Pipe TRANSFORM:', value);
    if (typeof value !== 'string') {
      return value;
    }
    try {
      console.log('parsing Data from Pipe: ', value);
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Invalid JSON string');
    }
  }
}
