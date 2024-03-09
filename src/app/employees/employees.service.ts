import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';
import { Employee } from './entities/employee.entity';
import type { EmployeesInterface } from './employees.interface';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('EMPLOYEE_REPOSITORY')
    private readonly employeesRepository: EmployeesRepository,
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    if (this.employeesRepository.root && !createEmployeeDto.managerId) {
      throw new HttpException(
        "Manager id is required when there's already a root employee",
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      createEmployeeDto.managerId === createEmployeeDto.id ||
      createEmployeeDto.subordinateIds?.includes(
        createEmployeeDto.id ?? createEmployeeDto.managerId,
      )
    ) {
      throw new HttpException(
        'Employee cannot be a manager of itself or a subordinate of itself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isIdExists = this.employeesRepository.findOne(createEmployeeDto.id);
    if (isIdExists) {
      throw new HttpException(
        `Employee with id ${createEmployeeDto.id} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newEmployee = new Employee();
    newEmployee.id = createEmployeeDto.id;
    newEmployee.name = createEmployeeDto.name;

    if (
      createEmployeeDto.subordinateIds &&
      createEmployeeDto.subordinateIds.length > 0
    ) {
      if (!createEmployeeDto.managerId)
        throw new HttpException(
          'Manager id is required when creating an employee with subordinates',
          HttpStatus.BAD_REQUEST,
        );

      let previousSubordinate: Employee | null = null;
      newEmployee.subordinates = createEmployeeDto.subordinateIds.map((id) => {
        const subordinate = this.employeesRepository.findOne(id);
        if (!subordinate) {
          throw new HttpException(
            `Subordinate with id ${id} not found`,
            HttpStatus.BAD_REQUEST,
          );
        }
        if (previousSubordinate && previousSubordinate.id !== subordinate.id) {
          throw new HttpException(
            'Subordinates must be from the same manager',
            HttpStatus.BAD_REQUEST,
          );
        }

        subordinate.manager = newEmployee;
        previousSubordinate = subordinate;
        return subordinate;
      });
    }

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
      manager.subordinates = manager.subordinates.filter(
        (subordinate) =>
          !createEmployeeDto.subordinateIds?.includes(subordinate.id),
      );
    }

    return this.employeesRepository.add(newEmployee);
  }

  findAll() {
    return this.employeesRepository.findAll();
  }

  findOne(search: string): EmployeesInterface | null {
    const employee = this.employeesRepository.findOne(search);
    if (!employee) {
      if (isNaN(+search)) {
        throw new HttpException(
          `Employee with name ${search} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        `Employee with id ${search} not found`,
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
    const removed = this.employeesRepository.remove(id);
    if (!removed) {
      throw new HttpException(
        `Employee with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return true;
  }

  getManagers(search?: string) {
    if (!search) {
      throw new HttpException(
        'Search parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.employeesRepository.getManagers(search);
  }

  getDirectReports(id: string) {
    return this.employeesRepository.getDirectReports(id);
  }

  getIndirectReports(id: string) {
    return this.employeesRepository.getIndirectReports(id);
  }
}
