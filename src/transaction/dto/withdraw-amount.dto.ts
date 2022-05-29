import { IsNumber, IsPositive } from "class-validator";

export class WithdrawAmountDto {
    @IsNumber()
    createdById: number;
    
    @IsNumber()
    @IsPositive()
    amount: number;
}