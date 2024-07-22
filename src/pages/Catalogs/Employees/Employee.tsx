import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonRow, IonCol, IonButton, IonIcon, IonButtons } from '@ionic/react';
import { add, people } from 'ionicons/icons';
import './Employee.css';
import { Employee as EmployeeType, EmployeeState } from './Types';
import EmployeeDetails from './EmployeeDetails';
import EmployeeCard from './EmployeeCard';
import { fetchEmployees, saveEmployee as saveEmployeeApi } from './apiUtils';

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeState>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<boolean>(false);
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const initFetch = async () => {
      const fetchedEmployees = await fetchEmployees();
      setEmployees(fetchedEmployees);
    };

    initFetch();
  }, []);

  const handleEdit = (employee: EmployeeType) => {
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
      imageUrl: "",
      notes: "",
    });
  };

  const saveEmployee = async () => {
    if (selectedEmployee) {
      await saveEmployeeApi(selectedEmployee, newEmployee);
      setIsEditMode(false);
      setNewEmployee(false);
      setSelectedEmployee(null);
    }
  };

  const closeModal = () => {
    setIsEditMode(false);
    setNewEmployee(false);
    setSelectedEmployee(null);
  };

  return (
    <IonPage>
      <IonRow className="ion-justify-content-center">
        <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
          <IonHeader>
            <IonToolbar>
              <IonTitle class="ion-text-center">Employees</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleAddNew}>
                  <IonIcon icon={people} />
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
              <EmployeeCard key={index} employee={employee} handleEdit={handleEdit} />
            ))}
            <EmployeeDetails
              isOpen={!!selectedEmployee}
              closeModal={closeModal}
              saveEmployee={saveEmployee}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              isEditMode={isEditMode}
              newEmployee={newEmployee}
            />
          </IonContent>
        </IonCol>
      </IonRow>
    </IonPage>
  );
};

export default Employee;
