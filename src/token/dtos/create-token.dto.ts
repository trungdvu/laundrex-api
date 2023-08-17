import { IsIn, IsNotEmpty } from 'class-validator';
import { TOKEN_ACTION } from 'src/constants/common.constant';
import { objectValueToArray } from 'src/utils/object.util';

export class CreateTokenDto {
  @IsNotEmpty()
  readonly userId: string;

  @IsIn(objectValueToArray(TOKEN_ACTION))
  readonly action: string;
}
