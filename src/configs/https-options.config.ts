import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const httpsOptions: HttpsOptions = {
  key: readFileSync(resolve('./certs/private.key')),
  cert: readFileSync(resolve('./certs/certificate.crt')),
};
