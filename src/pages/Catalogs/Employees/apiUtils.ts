import { Employee } from './Types';

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch('https://smartloansbackend.azurewebsites.net/all_employees');
  const data = await response.json();
  return data.employees;
}

export async function saveEmployee(employee: Employee, isNew: boolean): Promise<void> {
  const url = 'https://smartloansbackend.azurewebsites.net/employees';
  const method = isNew ? 'POST' : 'PUT';
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employees: [employee], action: isNew ? 1 : 2 })
  });
  const data = await response.json();
  console.log(data); // Handle response here
}
