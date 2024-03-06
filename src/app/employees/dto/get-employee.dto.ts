import type { CreateEmployeeDto } from './create-employee.dto';

export interface GetEmployeeDto extends Pick<CreateEmployeeDto, 'name'> {
  id: number;
  managerId: number | null;
}
