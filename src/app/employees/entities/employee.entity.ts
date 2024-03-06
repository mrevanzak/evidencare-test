export class Employee {
  public id: number;
  public name: string;

  public manager: Employee | null;
  public subordinates: Employee[];
}
