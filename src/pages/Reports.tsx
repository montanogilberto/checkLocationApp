import React, { useEffect, useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonLoading, IonAlert, IonDatetime,
  IonInput
} from '@ionic/react';
import './Reports.css';

interface Check {
    checkId: number;
    latitude: string;
    longitude: string;
    description: string;
    datetimelocal: string;
    checkTypeId: number;
    userId: number;
    street: string;
    postalCode: string;
    city: string;
    state: string;
    createdAt: string;
    updatedAt: string | null;
}

const Reports: React.FC = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [searchDate, setSearchDate] = useState<string | null>('');
  const [searchUserId, setSearchUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);

  const handleDateChange = (e: CustomEvent) => {
    const dateValue: string | null = typeof e.detail.value === 'string' ? e.detail.value : null;
    setSearchDate(dateValue);
  };

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/all_checks');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setChecks(data.checks);
    } catch (error: any) {
      setError("Failed to fetch checks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckDetails = async (checkId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://smartloansbackend.azurewebsites.net/one_checks?checkId=${checkId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSelectedCheck(data.checks[0]);
    } catch (error: any) {
      setError("Failed to fetch check details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Employee Reports</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonDatetime
          value={searchDate}
          onIonChange={handleDateChange}
        />
        <IonInput value={searchUserId} placeholder="Enter User ID" onIonChange={e => setSearchUserId(e.detail.value!)} />
        <IonButton onClick={() => fetchChecks()}>Search</IonButton>
        {loading && <IonLoading isOpen={loading} message="Loading..." />}
        {error && <IonAlert isOpen={!!error} message={error} buttons={['OK']} />}
        <IonList>
          {checks.filter(check => 
            (searchDate ? check.datetimelocal.startsWith(searchDate) : true) &&
            (check.userId.toString() === searchUserId || searchUserId === '')
          ).map((check) => (
            <IonItem key={check.checkId} button onClick={() => fetchCheckDetails(check.checkId)}>
              <IonLabel>
                <h2>{check.description}</h2>
                <p>Date: {check.datetimelocal} - User ID: {check.userId}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        {selectedCheck && (
          <div>
            <h2>Details for Check ID: {selectedCheck.checkId}</h2>
            <p>{selectedCheck.description}</p>
            <p>Date: {selectedCheck.datetimelocal}</p>
            <p>Latitude: {selectedCheck.latitude}, Longitude: {selectedCheck.longitude}</p>
            {/* Display other details as needed */}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reports;
