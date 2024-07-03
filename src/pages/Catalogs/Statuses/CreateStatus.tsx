import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const CreateStatus: React.FC = () => {
  const history = useHistory();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statuses: [{ status, action: 1 }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Status created successfully.');
        history.push('/statuses');
      } else {
        setMessage(data.message || 'Failed to create status.');
      }
    } catch (error) {
      console.error('Error during status creation:', error);
      setMessage('An error occurred during status creation. Please try again.');
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
              <h1 className="ion-text-center">Create Status</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={(e) => { e.preventDefault(); handleCreateStatus(); }}>
                <IonLabel position="floating">Status</IonLabel>
                <IonInput
                  type="text"
                  value={status}
                  onIonChange={(e) => setStatus(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonButton type="submit" expand="full" disabled={loading}>
                  {loading ? 'Creating status...' : 'Create Status'}
                </IonButton>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateStatus;
