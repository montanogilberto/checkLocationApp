import React from 'react';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonContent,
  IonList, IonItem, IonLabel, IonInput
} from '@ionic/react';
import { EmployeeState } from './Types';

interface EmployeeDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  saveEmployee: () => void;
  selectedEmployee: EmployeeState;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<EmployeeState>>;
  isEditMode: boolean;
  newEmployee: boolean;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  isOpen, closeModal, saveEmployee, selectedEmployee, setSelectedEmployee, isEditMode, newEmployee
}) => (
  <IonModal isOpen={isOpen} onDidDismiss={closeModal}>
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
          {Object.keys(selectedEmployee).map((key) => {
            if (selectedEmployee[key] === null || selectedEmployee[key] === undefined) return null;
            const value = selectedEmployee[key as keyof typeof selectedEmployee]; // Ensure proper type handling

            return (
              <IonItem key={key}>
                <IonLabel position="floating">{formatLabel(key)}</IonLabel>
                <IonInput type="text" value={value as string} readonly={!isEditMode} onIonChange={e => setSelectedEmployee({ ...selectedEmployee, [key]: e.detail.value! })} />
              </IonItem>
            );
          })}
        </IonList>
      ) : (
        <p>Select an employee to view details.</p>
      )}
    </IonContent>
  </IonModal>
);

// Helper function to format the label text from camelCase to regular words with spaces
function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

export default EmployeeDetails;
