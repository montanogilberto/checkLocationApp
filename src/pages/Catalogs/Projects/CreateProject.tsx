import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const CreateProject: React.FC = () => {
  const history = useHistory();
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projects: [{ projectName, action: 1 }],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Project created successfully.');
        history.push('/projects');
      } else {
        setMessage(data.message || 'Failed to create project.');
      }
    } catch (error) {
      console.error('Error during project creation:', error);
      setMessage('An error occurred during project creation. Please try again.');
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
              <h1 className="ion-text-center">Create Project</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
                <IonLabel position="floating">Project Name</IonLabel>
                <IonInput
                  type="text"
                  value={projectName}
                  onIonChange={(e) => setProjectName(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <IonButton type="submit" expand="full" disabled={loading}>
                  {loading ? 'Creating project...' : 'Create Project'}
                </IonButton>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreateProject;
