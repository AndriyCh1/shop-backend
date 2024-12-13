import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsInt()
  statusId: number;
}
