import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LogService } from 'src/log/log.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositAmountDto, TransferAmountDto, WithdrawAmountDto } from './dto';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService, private logservice: LogService) {}

    async depositAmount(dto: DepositAmountDto)
    {
        const checkUser = await this.prisma.user.findUnique({
            where: {
                id: dto.createdById
            },
            include:
            {
                balance: true
            }
        });
        

        if(!checkUser) throw new NotFoundException('User Not Found');

        
        const { balance, id: balanceId } = checkUser.balance;

        try {
            const deposit = this.prisma.finance.create({
                data: {
                    transactionType: 1,
                    ...dto
                }
            });
            const balanceUpdate = this.prisma.balance.update({
                where: {
                    id: balanceId
                },
                data: {
                    balance: balance + dto.amount
                }
            })
            await this.prisma.$transaction([deposit, balanceUpdate]); 
            
            await this.logservice.createLogs([
                `New deposit transaction created by user ID ${checkUser.id} for amount ${dto.amount}`,
                `User with ID ${checkUser.id} balance updated with amount ${balance + dto.amount}`
            ]);
        } catch(error) {            
            await this.logservice.createLogs([
                `Deposit transaction created by user ID ${checkUser.id} amount ${dto.amount} failed.`
            ]);
            throw error;
        }
    }

    async withdrawAmount(dto: WithdrawAmountDto)
    {
        const checkUser = await this.prisma.user.findUnique({
            where: {
                id: dto.createdById
            },
            include:
            {
                balance: true
            }
        });

        if(!checkUser) throw new NotFoundException('User Not Found');

        const { balance, id: balanceId } = checkUser.balance;
        if(balance < 1 || balance < dto.amount)
        {
            throw new ForbiddenException("You don't have enough balance to perform this transaction.");
        }

        try {
            const withdraw = this.prisma.finance.create({
                data: {
                    transactionType: 2,
                    ...dto
                }
            });
            const balanceUpdate = this.prisma.balance.update({
                where: {
                    id: balanceId
                },
                data: {
                    balance: balance - dto.amount
                }
            })
            await this.prisma.$transaction([withdraw, balanceUpdate]);

            await this.logservice.createLogs([
                `New withdraw transaction created by user ID ${checkUser.id} for amount ${dto.amount}`,
                `User with ID 2 balance updated with amount ${balance - dto.amount}`
            ]);
        } catch(error) {        
            await this.logservice.createLogs([
                `Withdraw transaction created by user ID ${checkUser.id} amount ${dto.amount} failed.`
            ]);
            throw error;
        }
    }

    async transferAmount(dto: TransferAmountDto)
    {
        if(dto.createdById === dto.transfferedToId) throw new ForbiddenException('You cannot transfer to yourself.');
        const checkTransferFrom = await this.prisma.user.findUnique({
            where: {
                id: dto.createdById
            },
            include:
            {
                balance: true
            }
        });

        
        const checkTransferTo = await this.prisma.user.findUnique({
            where: {
                id: dto.transfferedToId
            },
            include:
            {
                balance: true
            }
        });

        if(!checkTransferFrom || !checkTransferTo) {
            await this.logservice.createLogs([
                `Transfer transaction created by user ID ${checkTransferFrom.id} to ${checkTransferTo.id} for amount ${dto.amount} failed.`
            ]);
            throw new NotFoundException('Users not found.');
        }
        

        const { balance: balanceFrom, id: idFrom } = checkTransferFrom.balance;
        const { balance: balanceTo, id: idTo  } = checkTransferTo.balance;

        const commission = dto.amount * 0.2;
        const transactionAmount = dto.amount + commission;
        if(balanceFrom < 1 || balanceFrom < transactionAmount)
        {
            await this.logservice.createLogs([
                `Transfer transaction created by user ID ${checkTransferFrom.id} to ${checkTransferTo.id} for amount ${dto.amount} failed.`
            ]);
            throw new ForbiddenException("You don't have enough balance to perform this transaction.");
        }
        
        const superAdmin = await this.prisma.user.findFirst({
            where: {
                role: 1
            },
            include:
            {
                balance: true
            }
        });

        try {
            const transfer = this.prisma.finance.create({
                data: {
                    transactionType: 3,
                    ...dto
                }
            });
            const balanceUpdateFrom = this.prisma.balance.update({
                where: {
                    id: idFrom
                },
                data: {
                    balance: balanceFrom - transactionAmount
                }
            })
            const balanceUpdateTo = this.prisma.balance.update({
                where: {
                    id: idTo
                },
                data: {
                    balance: balanceTo + dto.amount
                }
            })
            const balanceUpdateToSuperAdmin = this.prisma.balance.update({
                where: {
                    id: superAdmin.balance.id
                },
                data: {
                    balance: superAdmin.balance.balance + commission
                }
            })
            await this.prisma.$transaction([transfer, balanceUpdateFrom, balanceUpdateTo, balanceUpdateToSuperAdmin]);
            
            await this.logservice.createLogs([
                `New transfer transaction created by user ID ${checkTransferFrom.id} to ${checkTransferTo.id} for amount ${dto.amount}`,
                `User with ID ${checkTransferFrom.id} balance updated with amount ${balanceFrom - transactionAmount}.`,
                `User with ID ${checkTransferTo.id} balance updated with amount ${balanceTo + dto.amount}`,
                `Super Admin with ID ${superAdmin.id} balance updated with amount ${superAdmin.balance.balance + commission}`
            ]);
        } catch(error) {
            await this.logservice.createLogs([
                `Transfer transaction created by user ID ${checkTransferFrom.id} to ${checkTransferTo.id} for amount ${dto.amount} failed.`
            ]);
            throw error;
        }
    }
}
