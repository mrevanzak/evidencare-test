import { ArrayUnique, IsAlpha, IsNumber, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  // check if the name contains only letters
  @IsAlpha()
  readonly name: string;

  @IsOptional()
  @IsNumber()
  readonly managerId?: number;

  @IsOptional()
  @ArrayUnique()
  @IsNumber({}, { each: true })
  //TODO: check if the subordinateIds values are not the same as the managerId
  readonly subordinateIds?: number[];
}
