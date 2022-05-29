import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogService {
    constructor(private prisma: PrismaService) {}
    async createLogs(messages: string[]) {
        for (let message of messages) {
            await this.prisma.logs.create({
                data: {
                    message
                }
            })
        }
    }

    getLogs() {
        return this.prisma.logs.findMany();
    }
}
