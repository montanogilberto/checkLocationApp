import React from 'react';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { documentTextOutline, peopleOutline } from 'ionicons/icons';

interface MenuPopoverProps {
  onClose: () => void;
}

const MenuPopover: React.FC<MenuPopoverProps> = ({ onClose }) => {
  const history = useHistory();

  const navigate = (path: string) => {
    history.push(path);
    onClose(); // Close popover after navigation
  };

  return (
    <IonList>
      <IonItem button onClick={() => navigate('/reports')}>
        <IonIcon slot="start" icon={documentTextOutline} />
        <IonLabel>Reports</IonLabel>
      </IonItem>
      <IonItem button onClick={() => navigate('/employee')}>
        <IonIcon slot="start" icon={peopleOutline} />
        <IonLabel>Employee</IonLabel>
      </IonItem>
    </IonList>
  );
};

export default MenuPopover;
