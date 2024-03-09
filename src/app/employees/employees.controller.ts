import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { TransformInterceptor } from 'src/interceptors/tranform.interceptor';

@Controller('employees')
@UseInterceptors(TransformInterceptor)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('managers')
  @ResponseMessage(
    'Managers data all the way up to the root retrieved successfully',
  )
  getManagers(@Query('search') search?: string) {
    return this.employeesService.getManagers(search);
  }

  @Post()
  @ResponseMessage('Employee created successfully')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Post('bulk')
  @ResponseMessage('Employees created successfully')
  createBulk(@Body() createEmployeeDto: CreateEmployeeDto[]) {
    return createEmployeeDto.map((employee) =>
      this.employeesService.create(employee),
    );
  }

  @Get()
  @ResponseMessage('Employees retrieved successfully')
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.employeesService.findOne(search);
    }
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ResponseMessage(`Employee retrieved successfully`)
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Get(':id/direct-reports')
  @ResponseMessage('Direct reports for this employee retrieved successfully')
  getDirectReports(@Param('id') id: string) {
    return this.employeesService.getDirectReports(id);
  }

  @Get(':id/direct-reports/count')
  @ResponseMessage(
    'Direct reports count for this employee retrieved successfully',
  )
  getDirectReportsCount(@Param('id') id: string) {
    const directReports = this.employeesService.getDirectReports(id);
    return {
      total: directReports.length,
    };
  }

  @Get(':id/indirect-reports')
  @ResponseMessage('Indirect reports for this employee retrieved successfully')
  getIndirectReports(@Param('id') id: string) {
    return this.employeesService.getIndirectReports(id);
  }

  @Get(':id/indirect-reports/count')
  @ResponseMessage(
    'Indirect reports count for this employee retrieved successfully',
  )
  getIndirectReportsCount(@Param('id') id: string) {
    const indirectReports = this.employeesService.getIndirectReports(id);
    return {
      total: indirectReports.length,
    };
  }

  @Delete(':id')
  @ResponseMessage('Employee removed successfully')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
