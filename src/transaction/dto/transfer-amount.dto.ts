import { IsNumber, IsPositive } from "class-validator";

export class TransferAmountDto {
    @IsNumber()
    createdById: number;

    @IsNumber()
    transfferedToId: number;

    @IsNumber()
    @IsPositive()
    amount: number;
}