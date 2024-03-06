import { HttpException, HttpStatus } from '@nestjs/common';
import type { Employee } from './entities/employee.entity';
import type { GetEmployeeDto } from './dto/get-employee.dto';

export class EmployeesRepository {
  private root: Employee | null;
  private size: number;

  constructor() {
    this.root = null;
    this.size = 0;
  }

  public getNextId(): number {
    return this.size + 1;
  }

  public add(employee: Employee): GetEmployeeDto {
    if (this.root && !employee.manager && employee.subordinates?.length === 0) {
      throw new HttpException(
        'New employee must have either a manager or subordinates when there are already employees in the repository',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.root) {
      this.root = employee;
    }

    this.size++;
    return {
      id: employee.id,
      name: employee.name,
      managerId: employee.manager?.id ?? null,
    };
  }

  public findOne(id: number): Employee | null {
    if (!this.root) {
      return null;
    }

    if (this.root.id === id) {
      return this.root;
    }

    return this.depthFirstSearch(id);
  }

  public findAll(): GetEmployeeDto[] {
    if (!this.root) {
      return [];
    }

    const employees: GetEmployeeDto[] = [];
    function recursiveDepthTraverse(currentNode: Employee) {
      employees.push({
        id: currentNode.id,
        name: currentNode.name,
        managerId: currentNode.manager?.id ?? null,
      });

      for (let i = 0; i < currentNode.subordinates.length; i++) {
        recursiveDepthTraverse(currentNode.subordinates[i]);
      }
    }

    recursiveDepthTraverse(this.root);
    return employees;
  }

  public depthFirstSearch(id: number): Employee | null {
    if (!this.root) {
      throw new Error('Employee repository is empty');
    }

    let targetNode = null;
    let found = false;

    function recursiveDepthTraverse(currentNode: Employee) {
      // traverse over given node children elements
      for (let i = 0; i < currentNode.subordinates.length; i++) {
        // if element matches targetKey, break here
        if (currentNode.subordinates[i].id === id) {
          found = true;
          targetNode = currentNode.subordinates[i];
          break;
        }

        recursiveDepthTraverse(currentNode.subordinates[i]);
        // signal condition to stop the original loop if it is found (goes to next step)
        if (found) {
          break;
        }
      }
    }

    recursiveDepthTraverse(this.root);
    return targetNode;
  }
}
