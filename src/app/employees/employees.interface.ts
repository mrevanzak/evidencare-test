import type { CreateEmployeeDto } from './dto/create-employee.dto';

export interface EmployeesInterface extends Pick<CreateEmployeeDto, 'name'> {
  id: number;
  managerId: number | null;
}
