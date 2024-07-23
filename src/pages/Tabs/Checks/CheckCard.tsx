// CheckCard.tsx
import React from 'react';
import { IonCard, IonCardHeader, IonCardContent } from '@ionic/react';
import { CheckData } from './types';

interface CheckCardProps {
  data: CheckData;
  title: string;
}

const CheckCard: React.FC<CheckCardProps> = ({ data, title }) => (
  <IonCard>
    <IonCardHeader>{title}: {data.localTime}</IonCardHeader>
    <IonCardContent>
      Location: {data.location.latitude.toFixed(6)}, {data.location.longitude.toFixed(6)}
      <br />
      Address: {data.address}
    </IonCardContent>
  </IonCard>
);

export default CheckCard;
