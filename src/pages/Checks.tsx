import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonPage, IonLoading, IonCardContent, IonCard, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonButton, IonAlert, IonText, IonCol, IonRow, IonIcon, IonToast } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import { timeOutline, checkmarkDoneOutline } from 'ionicons/icons';
import './Checks.css';

interface CheckData {
    time: string;
    localTime: string;
    location: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        altitudeAccuracy?: number | null;
        altitude?: number | null;
        speed?: number | null;
        heading?: number | null;
    };
    address?: string;
}

const parseAddress = (address: string) => {
  const parts = address.split(',').map((part: string) => part.trim());
  if (parts.length < 4) {
      return { street: parts[0], postalCode: '', city: parts[1], state: parts[2] };
  }
  return { street: parts[0], postalCode: parts[1], city: parts[2], state: parts[3] };
};


const Checks = () => {
    const [checkInData, setCheckInData] = useState<CheckData | null>(null);
    const [checkOutData, setCheckOutData] = useState<CheckData | null>(null);
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
    const [localTimeZone, setLocalTimeZone] = useState(0);
    const [trackingComplete, setTrackingComplete] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const localTime = new Date(new Date().getTime() + localTimeZone * 1000);
            setCurrentTime(localTime.toLocaleString());
        }, 1000);
        return () => clearInterval(timer);
    }, [localTimeZone]);

    const fetchAddress = useCallback(async (latitude: number, longitude: number): Promise<string> => {
        const subscriptionKey = '8otatwu41roiQR3rNcsgwewjclmHYjEamWcF1eXdGlnXwcoBRDH1JQQJ99AFACYeBjFsu8ALAAAgAZMPSW63';
        const url = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&query=${latitude},${longitude}&subscription-key=${subscriptionKey}`;
        try {
            const response = await axios.get(url);
            if (response.data && response.data.addresses && response.data.addresses.length > 0) {
                return response.data.addresses[0].address.freeformAddress;
            }
            return "Unknown location";
        } catch (error) {
            console.error('Error fetching address:', error);
            return "Failed to fetch location";
        }
    }, []);

    const formatDateForSQL = (date: any) => {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    

    const handleCheckIn = async () => {
      setShowLoading(true); // Show a loading indicator
      try {
          const position = await Geolocation.getCurrentPosition();
          const address = await fetchAddress(position.coords.latitude, position.coords.longitude);
          const addressParts = parseAddress(address);
          const now = new Date();
          const formattedDateTime = formatDateForSQL(now);
          const checkInData = {
              time: now.toISOString(),
              localTime: formattedDateTime,
              location: position.coords,
              address
          };
          setCheckInData(checkInData);
  
          const dataToSend = {
              checks: [{
                  latitude: position.coords.latitude.toString(),
                  longitude: position.coords.longitude.toString(),
                  description: address,
                  datetimelocal: formattedDateTime,
                  checkTypeId: 1,
                  userId: 1,
                  street: addressParts.street,
                  postalCode: addressParts.postalCode,
                  city: addressParts.city,
                  state: addressParts.state,
                  createdAt: now.toISOString(),
                  updatedAt: null,
                  action: '1'
              }]
          };
  
          console.log('Data sent to server:', dataToSend);
          const response = await axios.post('https://smartloansbackend.azurewebsites.net/checks', dataToSend);
  
          // Check if the response is successful and has the expected data
          if (response.status === 200 && response.data && response.data.length > 0 ) {
              console.log('Response message:', response.data); // Log the message
              setToastMessage('Check-in successful!');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 5000); 
          } else {
              throw new Error('No response from the server or unknown format');
          }
      } catch (error: any) {
          console.error('Check-in error:', error);
          // If the error is from Axios and has a response, use the status text, else use a generic message
          setToastMessage(error.response ? `${error.response.status}: ${error.response.statusText}` : "Failed to check in. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
      }
      setShowLoading(false); // Hide the loading indicator
  };
  
    

    const handleCheckOut = async () => {
        if (!checkInData) {
            setAlertMessage("Please check in before checking out.");
            setShowAlert(true);
            return;
        }

        setShowLoading(true);
        try {
            const position = await Geolocation.getCurrentPosition();
            const address = await fetchAddress(position.coords.latitude, position.coords.longitude);
            const addressParts = parseAddress(address);
            const now = new Date();
            const formattedDateTime = formatDateForSQL(now);
            const checkOutData = {
                time: new Date().toISOString(),
                localTime: new Date().toLocaleString(),
                location: position.coords,
                address
            };
            setCheckOutData(checkOutData);

            const dataToSend = {
                checks: [{
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                    description: address,
                    datetimelocal: formattedDateTime,
                    checkTypeId: 2,
                    userId: 1,
                    street: addressParts.street,
                    postalCode: addressParts.postalCode,
                    city: addressParts.city,
                    state: addressParts.state,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    action: "1"
                }]
            };

            console.log(dataToSend,'post data')

            const response = await axios.post('https://smartloansbackend.azurewebsites.net/checks', dataToSend);
            // Check if the response is successful and has the expected data
            if (response.status === 200 && response.data && response.data.length > 0 ) {
                console.log('Response message:', response.data); // Log the message
                setToastMessage(response.data); // Set the message to be displayed in an alert
                setShowToast(true); // Show the alert
                setTimeout(() => setShowToast(false), 5000); 
            } else {
                throw new Error('No response from the server or unknown format');
            }
        } catch (error: any) {
            console.error('Check-out error:', error);
            setAlertMessage("Failed to check out. Please try again. " + error.message || "Unknown error");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000); 
        }
        setShowLoading(false);
    };

    return (
        <IonPage>
            <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{currentTime}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                </IonCol>
            </IonRow>
            <IonContent>
                <IonRow className="ion-justify-content-center">
                    <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
                        {trackingComplete ? (
                            <IonText style={{ textAlign: 'center', fontSize: '18px', padding: '20px', color: 'green' }}>
                                Hours tracking complete
                            </IonText>
                        ) : (
                            <>
                                <br />
                                {!checkInData && (
                                    <IonButton expand="block" onClick={handleCheckIn} className="large-button">
                                        <IonIcon slot="start" icon={timeOutline} />
                                        Check In
                                    </IonButton>
                                )}
                                {checkInData && !checkOutData && (
                                    <IonButton expand="block" onClick={handleCheckOut} className="large-button">
                                        <IonIcon slot="start" icon={checkmarkDoneOutline} />
                                        Check Out
                                    </IonButton>
                                )}
                            </>
                        )}
                        <IonAlert
                            isOpen={showAlert}
                            onDidDismiss={() => setShowAlert(false)}
                            header={'Alert'}
                            message={alertMessage}
                            buttons={['OK']}
                        />
                        {checkInData && (
                            <IonCard>
                                <IonCardHeader>Checked in at: {checkInData.localTime}</IonCardHeader>
                                <IonCardContent>
                                    Location: {checkInData.location.latitude.toFixed(6)}, {checkInData.location.longitude.toFixed(6)}
                                    <br />
                                    Address: {checkInData.address}
                                </IonCardContent>
                            </IonCard>
                        )}
                        {checkOutData && (
                            <IonCard>
                                <IonCardHeader>Checked out at: {checkOutData.localTime}</IonCardHeader>
                                <IonCardContent>
                                    Location: {checkOutData.location.latitude.toFixed(6)}, {checkOutData.location.longitude.toFixed(6)}
                                    <br />
                                    Address: {checkOutData.address}
                                </IonCardContent>
                            </IonCard>
                        )}
                        <IonToast
                            isOpen={showToast}
                            onDidDismiss={() => setShowToast(false)}
                            message={toastMessage}
                            duration={5000}
                        />
                        <IonLoading isOpen={showLoading} message={'Please wait...'} />
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Checks;
