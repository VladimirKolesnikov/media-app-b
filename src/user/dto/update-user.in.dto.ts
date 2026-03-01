import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInDto } from './create-user.in.dto';

export class UpdateUserInDto extends PartialType(CreateUserInDto) {}
