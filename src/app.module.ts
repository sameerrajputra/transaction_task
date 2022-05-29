import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    TransactionModule,
    PrismaModule,
    LogModule],
  controllers: [],
  providers: [ PrismaService],
})
export class AppModule {}
