// Header.tsx

import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { helpCircleOutline, mailOutline, logOutOutline } from 'ionicons/icons';

interface HeaderProps {
  presentAlertPopover: (e: React.MouseEvent) => void;
  presentMailPopover: (e: React.MouseEvent) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ presentAlertPopover, presentMailPopover, handleLogout }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={presentAlertPopover}>
            <IonIcon slot="icon-only" icon={helpCircleOutline} />
          </IonButton>
          <IonButton onClick={presentMailPopover}>
            <IonIcon slot="icon-only" icon={mailOutline} />
          </IonButton>
          <IonButton routerDirection="forward" onClick={handleLogout} fill="clear">
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
