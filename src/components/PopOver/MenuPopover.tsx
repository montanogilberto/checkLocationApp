import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { IonModal, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonLabel, IonButton } from '@ionic/react';
import { documentTextOutline, peopleOutline, cashOutline, barChartOutline, closeOutline } from 'ionicons/icons';

import './MenuPopover.css'

interface MenuModalProps {
  isOpen: boolean;
  onDidDismiss: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onDidDismiss }) => {
  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);

  const navigate = (path: string) => {
    history.push(path);
    onDidDismiss(); // Close modal after navigation
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.5, 0.75]}>
      <IonContent className="ion-padding custom-tab-bar">
        <IonGrid>
          <IonRow>
            <IonCol className="icon-button" onClick={() => navigate('/reports')}>
              <IonIcon icon={documentTextOutline} />
              <IonLabel>Reports</IonLabel>
            </IonCol>
            <IonCol className="icon-button" onClick={() => navigate('/employee')}>
              <IonIcon icon={peopleOutline} />
              <IonLabel>Employee</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="icon-button" onClick={() => navigate('/payroll')}>
              <IonIcon icon={cashOutline} />
              <IonLabel>Payroll</IonLabel>
            </IonCol>
            <IonCol className="icon-button" onClick={() => navigate('/graphics')}>
              <IonIcon icon={barChartOutline} />
              <IonLabel>Graphics</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="icon-button" onClick={onDidDismiss}>
              <IonIcon icon={closeOutline} />
              <IonLabel>Cancel</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default MenuModal;
