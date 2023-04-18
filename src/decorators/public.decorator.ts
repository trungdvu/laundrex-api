import { SetMetadata } from '@nestjs/common';
import { MetaDataKey } from '../constants/meta-data.constant';

export const Public = () => SetMetadata(MetaDataKey.IsPublicApi, true);
