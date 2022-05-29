import { Body, Controller, Post } from '@nestjs/common';
import { DepositAmountDto, TransferAmountDto, WithdrawAmountDto } from './dto';
import { TransactionService } from './transaction.service';

const transactionTypeMapping = {
    1: 'Deposit',
    2: 'WithDraw',
    3: 'Transfer'
}

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) {}
    // Create the financial Transaction where User will request to deposit amount by given amount.
    @Post('/deposit')
    depositAmount(@Body() dto: DepositAmountDto)
    {
        return this.transactionService.depositAmount(dto);
    }

    @Post('/withdraw')
    withdrawAmount(@Body() dto: WithdrawAmountDto)
    {
        return this.transactionService.withdrawAmount(dto);
    }

    @Post('/transfer')
    transferAmount(@Body() dto: TransferAmountDto)
    {
        return this.transactionService.transferAmount(dto);
    }
}
