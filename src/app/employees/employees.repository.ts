import type { Employee } from './entities/employee.entity';
import type { EmployeesInterface } from './employees.interface';
import { HttpException } from '@nestjs/common';

export class EmployeesRepository {
  public root: Employee | null;

  constructor() {
    this.root = null;
  }

  public add(employee: Employee): EmployeesInterface {
    if (!this.root) this.root = employee;

    if (employee.subordinates.includes(this.root)) {
      this.root = employee;
    }

    return {
      id: employee.id,
      name: employee.name,
      managerId: employee.manager?.id ?? null,
    };
  }

  public remove(id: number): boolean {
    if (!this.root) return false;

    if (this.root.id === id) {
      if (this.root.subordinates.length > 1) {
        throw new HttpException(
          'Cannot remove this employee because that would make the tree disconnected',
          400,
        );
      }
      this.root = this.root.subordinates[0] ?? null;
      this.root.manager = null;
      return true;
    }

    const targetNode = this.depthFirstSearch(id);
    if (!targetNode) return false;

    const manager = targetNode.manager;
    if (manager) {
      manager.subordinates = manager.subordinates.filter(
        (subordinate) => subordinate.id !== id,
      );
    }

    return true;
  }

  public findOne(search: string | number): Employee | null {
    if (!this.root) return null;
    if (this.root.id === Number(search) || this.root.name === search)
      return this.root;

    return this.depthFirstSearch(search);
  }

  public findAll(): EmployeesInterface[] {
    if (!this.root) return [];

    const employees: EmployeesInterface[] = [];
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

  public getManagers(search: string): EmployeesInterface[] {
    if (!this.root) return [];

    const employee = this.findOne(search);
    const managers: EmployeesInterface[] = [];
    function recursiveManagerTraverse(currentNode: Employee) {
      managers.push({
        id: currentNode.id,
        name: currentNode.name,
        managerId: currentNode.manager?.id ?? null,
      });

      if (currentNode.manager) recursiveManagerTraverse(currentNode.manager);
    }

    if (employee) recursiveManagerTraverse(employee);
    return managers;
  }

  public getDirectReports(id: string): EmployeesInterface[] {
    if (!this.root) return [];

    const employee = this.findOne(id);
    if (!employee) return [];

    const directReports: EmployeesInterface[] = [];
    function recursiveDirectReportTraverse(currentNode: Employee) {
      for (let i = 0; i < currentNode.subordinates.length; i++) {
        directReports.push({
          id: currentNode.subordinates[i].id,
          name: currentNode.subordinates[i].name,
          managerId: currentNode.subordinates[i].manager?.id ?? null,
        });
      }
    }

    recursiveDirectReportTraverse(employee);
    return directReports;
  }

  public depthFirstSearch(search: string | number): Employee | null {
    if (!this.root) throw new Error('Employee repository is empty');

    let targetNode = null;
    let found = false;

    function recursiveDepthTraverse(currentNode: Employee) {
      // traverse over given node children elements
      for (let i = 0; i < currentNode.subordinates.length; i++) {
        // if element matches targetKey, break here
        if (
          currentNode.subordinates[i].id === Number(search) ||
          currentNode.subordinates[i].name === search
        ) {
          found = true;
          targetNode = currentNode.subordinates[i];
          break;
        }

        recursiveDepthTraverse(currentNode.subordinates[i]);
        // signal condition to stop the original loop if it is found (goes to next step)
        if (found) break;
      }
    }

    recursiveDepthTraverse(this.root);
    return targetNode;
  }
}
