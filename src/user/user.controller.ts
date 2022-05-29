import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDto, EditUserDto } from './dto';
import { UserService } from './user.service';

const roleMapping = {
    1: 'Super Admin',
    2: 'User'
}

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    // Get all users
    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    // Get user by ID
    @Get('/:id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserById(id);
    }
    
    // Create User
    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }
    
    // update User by ID
    @Patch('/:id')
    editUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: EditUserDto
    ) {
        return this.userService.editUserById(id, dto);
    }
    
    //Delete user by ID
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    deleteUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUserById(id);
    }
}
