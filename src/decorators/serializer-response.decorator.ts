import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

export const SerializerResponse = () =>
  UseInterceptors(ClassSerializerInterceptor);
