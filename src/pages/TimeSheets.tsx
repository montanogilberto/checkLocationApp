import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './TimeSheets.css';

const TimeSheets: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reports</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Time Sheets</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Time Sheets page" />
      </IonContent>
    </IonPage>
  );
};

export default TimeSheets;