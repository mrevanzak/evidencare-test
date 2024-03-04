import { Inject, Injectable } from '@nestjs/common';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.reposity';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeesRepository: EmployeesRepository,
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = new Employee();
    newEmployee.name = createEmployeeDto.name;

    return this.employeesRepository.save(newEmployee);
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
