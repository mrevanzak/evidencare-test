import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
    newEmployee.subordinates = createEmployeeDto.subordinateIds?.map((id) => {
      const subordinate = this.employeesRepository.findOne(id);
      if (!subordinate) {
        throw new HttpException('Subordinate not found', HttpStatus.NOT_FOUND);
      }
      return subordinate;
    });

    if (createEmployeeDto.managerId) {
      const manager = this.employeesRepository.findOne(
        createEmployeeDto.managerId,
      );
      if (!manager) {
        throw new HttpException('Manager not found', HttpStatus.NOT_FOUND);
      }
    }

    return this.employeesRepository.save(newEmployee);
  }

  findAll() {
    return this.employeesRepository.findAll();
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