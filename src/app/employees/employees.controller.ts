import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { TransformInterceptor } from 'src/interceptors/tranform.interceptor';

@Controller('employees')
@UseInterceptors(TransformInterceptor)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ResponseMessage('Employee created successfully')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ResponseMessage('Employees retrieved successfully')
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ResponseMessage(`Employee retrieved successfully`)
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
