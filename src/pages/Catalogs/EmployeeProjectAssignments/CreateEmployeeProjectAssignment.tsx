import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const CreateEmployeeProjectAssignment: React.FC = () => {
  const history = useHistory();
  const [employeeId, setEmployeeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignmentStartDate, setAssignmentStartDate] = useState('');
  const [assignmentEndDate, setAssignmentEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateEmployeeProjectAssignment = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/employeeProjectAssignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeProjectAssignments: [{ employeeId, projectId, assignmentStartDate, assignmentEndDate, action: 1 }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Employee project assignment created successfully.');
        history.push('/employeeProjectAssignments');
      } else {
        setMessage(data.message || 'Failed to create employee project assignment.');
      }
    } catch (error) {
      console.error('Error during employee project assignment creation:', error);
      setMessage('An error occurred during employee project assignment creation. Please try again.');
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
              <h1 className="ion-text-center">Create Employee Project Assignment</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={(e) => { e.preventDefault(); handleCreateEmployeeProjectAssignment(); }}>
                <IonLabel position="floating">Employee ID</IonLabel>
                <IonInput
                  type="number"
                  value={employeeId}
                  onIonChange={(e) => setEmployeeId(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Project ID</IonLabel>
                <IonInput
                  type="number"
                  value={projectId}
                  onIonChange={(e) => setProjectId(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Assignment Start Date</IonLabel>
                <IonInput
                  type="date"
                  value={assignmentStartDate}
                  onIonChange={(e) => setAssignmentStartDate(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Assignment End Date</IonLabel>
                <IonInput
                  type="date"
                  value={assignmentEndDate}
                  onIonChange={(e) => setAssignmentEndDate(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonButton type="submit" expand="full" disabled={loading}>
                  {loading ? 'Creating employee project assignment...' : 'Create Employee Project Assignment'}
                </IonButton>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateEmployeeProjectAssignment;
