import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.reposity';
import { Employee } from './entities/employee.entity';
import type { EmployeesInterface } from './employees.interface';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeesRepository: EmployeesRepository,
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = new Employee();
    newEmployee.id = this.employeesRepository.getNextId();
    newEmployee.name = createEmployeeDto.name;
    newEmployee.subordinates =
      createEmployeeDto.subordinateIds?.map((id) => {
        const subordinate = this.employeesRepository.findOne(id);
        if (!subordinate) {
          throw new HttpException(
            `Subordinate with id ${id} not found`,
            HttpStatus.BAD_REQUEST,
          );
        }
        return subordinate;
      }) ?? [];

    if (createEmployeeDto.managerId) {
      const manager = this.employeesRepository.findOne(
        createEmployeeDto.managerId,
      );
      if (!manager) {
        throw new HttpException(
          `Manager with id ${createEmployeeDto.managerId} not found`,
          HttpStatus.BAD_REQUEST,
        );
      }
      newEmployee.manager = manager;
      manager.subordinates.push(newEmployee);
    }

    if (
      this.employeesRepository.root &&
      !newEmployee.manager &&
      newEmployee.subordinates?.length === 0
    ) {
      throw new HttpException(
        'New employee must have either a manager or subordinates when there are already employees in the repository',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.employeesRepository.add(newEmployee);
  }

  findAll() {
    return this.employeesRepository.findAll();
  }

  findOne(id: number): EmployeesInterface | null {
    const employee = this.employeesRepository.findOne(id);
    if (!employee) {
      throw new HttpException(
        `Employee with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: employee?.id,
      name: employee?.name,
      managerId: employee?.manager?.id ?? null,
    };
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
