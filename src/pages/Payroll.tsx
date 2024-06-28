import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Payroll.css';

const Payroll: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Payroll</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Payroll</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Payroll page" />
      </IonContent>
    </IonPage>
  );
};

export default Payroll;