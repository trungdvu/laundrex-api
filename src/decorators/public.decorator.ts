import { SetMetadata } from '@nestjs/common';
import { META_DATA_KEY } from '../constants/common.constant';

export const Public = () => SetMetadata(META_DATA_KEY.IS_PUBLIC_API, true);
