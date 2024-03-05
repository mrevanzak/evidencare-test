import type { Employee } from './entities/employee.entity';

export class EmployeesRepository {
  private readonly entity: Map<number, Employee>;

  constructor() {
    this.entity = new Map<number, Employee>();
  }

  public save(entity: Employee): Employee {
    this.entity.set(entity.id, entity);
    return entity;
  }

  public findOne(id: number): Employee | undefined {
    return this.entity.get(id);
  }
}
