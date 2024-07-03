import React, { useEffect, useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton,
  IonLoading, IonAlert, IonDatetime, IonInput, IonGrid, IonRow, IonCol, IonModal, IonDatetimeButton, IonButtons, IonIcon, IonText
} from '@ionic/react';
import './Reports.css';
import { documentTextOutline, cloudDownloadOutline } from 'ionicons/icons';

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
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [searchUserId, setSearchUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchChecks();
  }, []);

  const handleDateChange = (e: CustomEvent) => {
    const dateValue: string | null = typeof e.detail.value === 'string' ? e.detail.value : null;
    setSearchDate(dateValue);
  };

  const handleConfirmDate = () => {
    setIsModalOpen(false); // Close modal after confirming the date
  };

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

  const exportPDF = () => {
    const jsPDF = require('jspdf');
    const doc = new jsPDF();
  
    // Simple text data for example; for more complex data, you'd iterate over your dataset
    doc.text('Report Data:', 10, 10);
    checks.forEach((check, index) => {
      doc.text(`${index + 1}. ${check.description} - ${check.datetimelocal}`, 10, 20 + (10 * index));
    });
  
    doc.save('report.pdf');
  };
  
  const exportExcel = () => {
    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(checks);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
  
    // Write file
    XLSX.writeFile(wb, 'report.xlsx');
  };

  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
      <IonButtons slot="end">
        <IonButton onClick={exportPDF} className="export-button">
          <IonIcon icon={documentTextOutline} size='large' />
          <IonText>PDF</IonText>
        </IonButton>
        <IonButton onClick={exportExcel} className="export-button">
          <IonIcon icon={cloudDownloadOutline} size='large' />
          <IonText>Excel</IonText>
        </IonButton>
      </IonButtons>
      </IonToolbar>
    </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <IonDatetimeButton datetime="select-date" onClick={() => setIsModalOpen(true)}></IonDatetimeButton>
              <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} keepContentsMounted={true}>
                <IonDatetime
                  id="select-date"
                  presentation="date"
                  value={searchDate}
                  onIonChange={handleDateChange}
                ></IonDatetime>
                <IonButton expand="block" onClick={handleConfirmDate}>Confirm Date</IonButton>
              </IonModal>
            </IonCol>
            <IonCol size="12" size-md="6">
              <IonInput value={searchUserId} placeholder="Enter User ID" onIonChange={e => setSearchUserId(e.detail.value!)} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={fetchChecks}>Search</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {loading && <IonLoading isOpen={loading} message="Loading..." />}
        {error && <IonAlert isOpen={!!error} message={error} buttons={['OK']} />}
        <IonList>
          {checks.map((check) => (
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
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Reports;
