import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('logs')
export class LogController {
    constructor(private logService: LogService) {}

    @Get()
    getLogs() {
        return this.logService.getLogs();
    }
}
