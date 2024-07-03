import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const CreateEmploymentType: React.FC = () => {
  const history = useHistory();
  const [employmentType, setEmploymentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateEmploymentType = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/employmentTypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employmentTypes: [{ employmentType, action: 1 }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Employment type created successfully.');
        history.push('/employmentTypes');
      } else {
        setMessage(data.message || 'Failed to create employment type.');
      }
    } catch (error) {
      console.error('Error during employment type creation:', error);
      setMessage('An error occurred during employment type creation. Please try again.');
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
              <h1 className="ion-text-center">Create Employment Type</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={(e) => { e.preventDefault(); handleCreateEmploymentType(); }}>
                <IonLabel position="floating">Employment Type</IonLabel>
                <IonInput
                  type="text"
                  value={employmentType}
                  onIonChange={(e) => setEmploymentType(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonButton type="submit" expand="full" disabled={loading}>
                  {loading ? 'Creating employment type...' : 'Create Employment Type'}
                </IonButton>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateEmploymentType;
