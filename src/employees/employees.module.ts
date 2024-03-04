import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { EmployeesRepository } from './employees.reposity';

@Module({
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    {
      provide: 'EMPLOYEE_REPOSITORY',
      useClass: EmployeesRepository,
    },
  ],
})
export class EmployeesModule {}
