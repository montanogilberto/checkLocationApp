import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const CreateEmployee: React.FC = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [employmentTypeId, setEmploymentTypeId] = useState(1);
  const [position, setPosition] = useState('');
  const [departmentId, setDepartmentId] = useState(1);
  const [statusId, setStatusId] = useState(1);
  const [hireDate, setHireDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateEmployee = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employees: [{
            firstName, lastName, email, phoneNumber, address, employmentTypeId, position, departmentId, statusId, hireDate, endDate,
            emergencyContactName, emergencyContactRelationship, emergencyContactPhone, notes, action: 1
          }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Employee created successfully.');
        history.push('/employees');
      } else {
        setMessage(data.message || 'Failed to create employee.');
      }
    } catch (error) {
      console.error('Error during employee creation:', error);
      setMessage('An error occurred during employee creation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
              <h1 className="ion-text-center">Create Employee</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={(e) => { e.preventDefault(); handleCreateEmployee(); }}>
                <IonLabel position="floating">First Name</IonLabel>
                <IonInput
                  type="text"
                  value={firstName}
                  onIonChange={(e) => setFirstName(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Last Name</IonLabel>
                <IonInput
                  type="text"
                  value={lastName}
                  onIonChange={(e) => setLastName(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Phone Number</IonLabel>
                <IonInput
                  type="text"
                  value={phoneNumber}
                  onIonChange={(e) => setPhoneNumber(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Address</IonLabel>
                <IonInput
                  type="text"
                  value={address}
                  onIonChange={(e) => setAddress(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Employment Type ID</IonLabel>
                <IonInput
                  type="number"
                  value={employmentTypeId}
                  onIonChange={(e) => setEmploymentTypeId(Number(e.detail.value!))}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Position</IonLabel>
                <IonInput
                  type="text"
                  value={position}
                  onIonChange={(e) => setPosition(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Department ID</IonLabel>
                <IonInput
                  type="number"
                  value={departmentId}
                  onIonChange={(e) => setDepartmentId(Number(e.detail.value!))}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Status ID</IonLabel>
                <IonInput
                  type="number"
                  value={statusId}
                  onIonChange={(e) => setStatusId(Number(e.detail.value!))}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Hire Date</IonLabel>
                <IonInput
                  type="date"
                  value={hireDate}
                  onIonChange={(e) => setHireDate(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">End Date</IonLabel>
                <IonInput
                  type="date"
                  value={endDate}
                  onIonChange={(e) => setEndDate(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Emergency Contact Name</IonLabel>
                <IonInput
                  type="text"
                  value={emergencyContactName}
                  onIonChange={(e) => setEmergencyContactName(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Emergency Contact Relationship</IonLabel>
                <IonInput
                  type="text"
                  value={emergencyContactRelationship}
                  onIonChange={(e) => setEmergencyContactRelationship(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Emergency Contact Phone</IonLabel>
                <IonInput
                  type="text"
                  value={emergencyContactPhone}
                  onIonChange={(e) => setEmergencyContactPhone(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Notes</IonLabel>
                <IonInput
                  type="text"
                  value={notes}
                  onIonChange={(e) => setNotes(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonButton type="submit" expand="full" disabled={loading}>
                  {loading ? 'Creating employee...' : 'Create Employee'}
                </IonButton>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateEmployee;
