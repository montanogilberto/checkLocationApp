export type Employee = {
    [key: string]: any;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    position: string;
    employmentTypeId: number;
    departmentId: number;
    statusId: number;
    hireDate: string;
    emergencyContactName: string;
    emergencyContactRelationship: string;
    emergencyContactPhone: string;
    imageUrl: string;
    notes?: string;
    employeeId?: number;
  };
  
  export type EmployeeState = Employee | null;
  