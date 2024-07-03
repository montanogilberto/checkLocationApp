import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSearchbar, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonModal, IonButton, IonButtons,
  IonList, IonItem, IonLabel, IonInput, IonText, IonIcon, IonFabButton, IonAvatar, IonImg
} from '@ionic/react';
import { add, create } from 'ionicons/icons';
import './Employee.css';

// Define the Employee type
type Employee = {
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

// Define the EmployeeState type
type EmployeeState = Employee | null;

const EmployeeComponent: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeState>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<boolean>(false);
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://smartloansbackend.azurewebsites.net/all_employees');
        const data = await response.json();
        setEmployees(data.employees);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee: Employee) => {
    setIsEditMode(true);
    setSelectedEmployee({...employee});
  };

  const handleAddNew = () => {
    setNewEmployee(true);
    setIsEditMode(true);
    setSelectedEmployee({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      position: "",
      employmentTypeId: 1,
      departmentId: 1,
      statusId: 1,
      hireDate: new Date().toISOString(),
      emergencyContactName: "",
      emergencyContactRelationship: "",
      emergencyContactPhone: "",
      notes: "",
      imageUrl: "",
    });
  };

  const saveEmployee = async () => {
    const url = `https://smartloansbackend.azurewebsites.net/employees`;
    const method = newEmployee ? 'POST' : 'PUT';
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employees: [selectedEmployee], action: newEmployee ? 1 : 2 })
      });
      const data = await response.json();
      console.log(data); // Handle response here
      setIsEditMode(false);
      setNewEmployee(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const closeModal = () => {
    setIsEditMode(false);
    setNewEmployee(false);
    setSelectedEmployee(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Employee</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAddNew}>
              <IonIcon icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} placeholder="Search by name"></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {employees.filter(emp => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchText.toLowerCase())).map((employee, index) => (
        <IonCard key={index} onClick={() => setSelectedEmployee(employee)}>
        <IonCardHeader>
          <IonCardTitle>{employee.firstName} {employee.lastName}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList lines="none">
            <IonItem>
              <IonAvatar slot="start">
                <IonImg src={employee.imageUrl || 'https://via.placeholder.com/150'} />
              </IonAvatar>
              <IonLabel>
                
                <h3>Email: {employee.email}</h3>
                <p>Position: {employee.position}</p>
                <p>Hire Date: {employee.hireDate}</p>
              </IonLabel>
              <IonIcon icon={create} size='large' onClick={(e) => {
                e.stopPropagation(); // Prevent onClick from firing for the card
                handleEdit(employee);
              }} slot="end" />
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>
        ))}
        <IonModal ref={modal} isOpen={!!selectedEmployee} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{newEmployee ? "Add New Employee" : "Edit Employee"}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={closeModal}>Close</IonButton>
                {isEditMode && <IonButton onClick={saveEmployee}>Save</IonButton>}
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedEmployee ? (
              <IonList>
                <IonItem>
                    <IonLabel position="floating">First Name</IonLabel>
                    <IonInput value={selectedEmployee.firstName} readonly={!isEditMode} onIonChange={e => setSelectedEmployee({...selectedEmployee, firstName: e.detail.value!})} />
                </IonItem>
                {/* Additional fields as inputs or text */}
              </IonList>
            ) : (
              <p>Select an employee to view details.</p>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EmployeeComponent;
