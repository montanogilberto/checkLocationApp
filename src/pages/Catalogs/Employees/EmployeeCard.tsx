import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonIcon } from '@ionic/react';
import { create } from 'ionicons/icons';
import { Employee } from './Types';
import './Employee.css'

interface EmployeeCardProps {
  employee: Employee;
  handleEdit: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, handleEdit }) => (
  <IonCard onClick={() => handleEdit(employee)}>
    <IonCardHeader>
      <IonCardTitle class='ion-card-tittle'>{employee.firstName} {employee.lastName}</IonCardTitle>
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
          <IonIcon icon={create} size="large" onClick={(e) => {
            e.stopPropagation();
            handleEdit(employee);
          }} slot="end" />
        </IonItem>
      </IonList>
    </IonCardContent>
  </IonCard>
);

export default EmployeeCard;
