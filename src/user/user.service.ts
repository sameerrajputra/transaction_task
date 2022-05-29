import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { LogService } from 'src/log/log.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private logservice: LogService) {}

    async getUsers() {
        await this.logservice.createLogs(['Get all users.']);
        return this.prisma.user.findMany();
    }

    async getUserById(id: number) {        
        await this.logservice.createLogs([`Get user by ID ${id}`]);
        return this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }
    
    async createUser(dto: CreateUserDto) {
        try
        {
            const user = await this.prisma.user.create({
                data: {
                    role: 2,
                    ...dto
                }
            });

            if(user)
            {
                await this.prisma.balance.create({
                    data: {
                        userId: user.id,
                        balance: 0
                    }
                });
                
                await this.logservice.createLogs([
                    `User with ID ${user.id} created.`,
                    `Balance with amount 0 created with for user ID ${user.id}.`
                ]);                
                return user;
            }
        } catch(error)
        {                
            await this.logservice.createLogs([
                `Error creating user.`
            ]); 
            if(error instanceof PrismaClientKnownRequestError)
            {
                if(error.code === 'P2002') throw new ConflictException('Email already exists.')
                throw new InternalServerErrorException();
            }
        }
    }
    
    async editUserById(id: number, dto: EditUserDto) {
        const user = await this.getUserById(id);

        if(!user) throw new ForbiddenException('Access to resource denied');

        const updatedUser = await this.prisma.user.update({
            where: {
                id
            },
            data: dto
        });      
        await this.logservice.createLogs([
            `Edit user by ID ${id}`
        ]); 
        
        return updatedUser;
    }
    
    async deleteUserById(id: number) {
        const user = await this.getUserById(id);

        if(!user || user.role === 1) throw new ForbiddenException('Access to resource denied');

        try{
            await this.prisma.user.delete({
                where: {
                    id
                }
            });
            await this.logservice.createLogs([
                `Delete user by ID ${id}`
            ]);
        } catch (error) 
        {                
            await this.logservice.createLogs([
                `Error creating user.`
            ]); 
            if(error instanceof PrismaClientKnownRequestError)
            {
                if(error.code === 'P2003') throw new ConflictException('User is associated with other tables.')
                throw new InternalServerErrorException();
            }
        }
    }
}
