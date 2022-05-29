import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [LogModule],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
