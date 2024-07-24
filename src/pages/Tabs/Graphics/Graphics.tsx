import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../../components/ExploreContainer';


const Graphics: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Graphics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Graphics</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Graphics page" />
      </IonContent>
    </IonPage>
  );
};

export default Graphics;