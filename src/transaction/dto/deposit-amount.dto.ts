import { IsNumber, IsPositive } from "class-validator";

export class DepositAmountDto {
    @IsNumber()
    createdById: number;
    
    @IsNumber()
    @IsPositive()
    amount: number;
}