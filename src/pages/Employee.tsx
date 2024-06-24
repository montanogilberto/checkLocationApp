import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Employee.css';

const Employee: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Employee</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Employee</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Employee page" />
      </IonContent>
    </IonPage>
  );
};

export default Employee;
