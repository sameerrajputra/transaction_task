import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [LogModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
