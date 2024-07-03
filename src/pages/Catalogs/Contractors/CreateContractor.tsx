import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const CreateContractor: React.FC = () => {
  const history = useHistory();
  const [employeeId, setEmployeeId] = useState('');
  const [contractingCompany, setContractingCompany] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateContractor = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/contractors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractors: [{ employeeId, contractingCompany, contractStartDate, contractEndDate, action: 1 }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contractor created successfully.');
        history.push('/contractors');
      } else {
        setMessage(data.message || 'Failed to create contractor.');
      }
    } catch (error) {
      console.error('Error during contractor creation:', error);
      setMessage('An error occurred during contractor creation. Please try again.');
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
              <h1 className="ion-text-center">Create Contractor</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={(e) => { e.preventDefault(); handleCreateContractor(); }}>
                <IonLabel position="floating">Employee ID</IonLabel>
                <IonInput
                  type="number"
                  value={employeeId}
                  onIonChange={(e) => setEmployeeId(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Contracting Company</IonLabel>
                <IonInput
                  type="text"
                  value={contractingCompany}
                  onIonChange={(e) => setContractingCompany(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Contract Start Date</IonLabel>
                <IonInput
                  type="date"
                  value={contractStartDate}
                  onIonChange={(e) => setContractStartDate(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonLabel position="floating">Contract End Date</IonLabel>
                <IonInput
                  type="date"
                  value={contractEndDate}
                  onIonChange={(e) => setContractEndDate(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonButton type="submit" expand="full" disabled={loading}>
                  {loading ? 'Creating contractor...' : 'Create Contractor'}
                </IonButton>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateContractor;
