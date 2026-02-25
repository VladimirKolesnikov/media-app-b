import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaInDto } from './create-media.in.dto';

export class UpdateMediaDto extends PartialType(CreateMediaInDto) {}
