import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar } from '@ionic/react';
import { menuOutline, helpCircleOutline, mailOutline, logOutOutline } from 'ionicons/icons';
import { useUser } from './UserContext'; // Ensure correct import path

interface HeaderProps {
  presentAlertPopover: (e: React.MouseEvent) => void;
  presentMailPopover: (e: React.MouseEvent) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ presentAlertPopover, presentMailPopover, handleLogout }) => {
  const { avatarUrl } = useUser();

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center' }}>
          <IonAvatar style={{ marginRight: '10px', width: '40px', height: '40px' }}>
            <img src={avatarUrl} alt="User Avatar" />
          </IonAvatar>
          <IonButton>
            <IonIcon slot="icon-only" icon={menuOutline} />
          </IonButton>
        </IonButtons>
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
