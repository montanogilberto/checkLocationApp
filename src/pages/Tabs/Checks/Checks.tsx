import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonLoading, IonCardContent, IonCard, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonButton, IonAlert, IonText, IonCol, IonRow, IonIcon, IonToast, IonItem, IonLabel, IonList, IonNote, IonInput, IonTextarea } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { locationOutline, timeOutline } from 'ionicons/icons';
import { CheckData } from './types'; // Import CheckData interface
import { fetchAddress, sendDataToServer } from './api'; // Import API functions
import { parseAddress, formatDateForSQL } from './utils'; // Import utility functions
import './Checks.css';


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
    const [alertButtons, setAlertButtons] = useState<any[]>([
        {
            text: 'OK',
            role: 'cancel',
            handler: () => {}
        }
    ]);
    const [comment, setComment] = useState("");
    const [showSubmitButton, setShowSubmitButton] = useState(false);



    useEffect(() => {
        const timer = setInterval(() => {
            const localTime = new Date(new Date().getTime() + localTimeZone * 1000);
            setCurrentTime(localTime.toLocaleString());
        }, 1000);
        return () => clearInterval(timer);
    }, [localTimeZone]);

    const handleCheckIn = async () => {
      setShowLoading(true);
      try {
          const position = await Geolocation.getCurrentPosition();
          const address = await fetchAddress(position.coords.latitude, position.coords.longitude);
          const addressParts = parseAddress(address);
          const now = new Date();
          const localTime = now.toLocaleString()
          const formattedDateTime = formatDateForSQL(now);
          const newCheckInData = {
              time: now.toISOString(),
              localTime: localTime,
              location: position.coords,
              address
          };
          setCheckInData(newCheckInData);
  
          const dataToSend = {
              checks: [{
                  latitude: position.coords.latitude.toString(),
                  longitude: position.coords.longitude.toString(),
                  description: address,
                  datetimelocal: localTime,
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
          const response = await sendDataToServer(dataToSend, 'https://smartloansbackend.azurewebsites.net/checks');
  
          if (response.status === 200 && response.data && response.data.length > 0 ) {
              console.log('Response message:', response.data);
              setToastMessage('Check-in successful!');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 5000);
          } else {
              throw new Error('No response from the server or unknown format');
          }
      } catch (error: any) {
          console.error('Check-in error:', error);
          setToastMessage(error.response ? `${error.response.status}: ${error.response.statusText}` : "Failed to check in. Please try again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
      }
      setShowLoading(false);
    };

    const handleCheckOut = async () => {
        if (!checkInData) {
            setAlertMessage("Please check in before checking out.");
            setShowAlert(true);
            return;
        }
    
        const now = new Date();
        const checkInTime = new Date(checkInData.time);
        const diff = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // Difference in hours
        const hoursRemaining = 8 - diff;
    
        if (diff < 8) {
            setAlertMessage(`Are you sure you want to check out before completing 8 hours? You still have ${hoursRemaining.toFixed(2)} hours remaining.`);
            setShowAlert(true);
            // Set up to handle the user's decision
            setAlertButtons([
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Checkout cancelled');
                    }
                },
                {
                    text: 'Check Out',
                    handler: () => {
                        performCheckout();
                    }
                }
            ]);
            return;
        }
    
        // If 8 hours have passed, proceed to checkout
        performCheckout();
    };
    
    const performCheckout = async () => {
        setShowLoading(true);
        try {
            const position = await Geolocation.getCurrentPosition();
            const address = await fetchAddress(position.coords.latitude, position.coords.longitude);
            const addressParts = parseAddress(address);
            const now = new Date();
            const formattedDateTime = formatDateForSQL(now);
            const newCheckOutData = {
                time: now.toISOString(),
                localTime: now.toLocaleString(),
                location: position.coords,
                address
            };
            setCheckOutData(newCheckOutData);
    
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
                    createdAt: now.toISOString(),
                    updatedAt: null,
                    action: "1"
                }]
            };
    
            const response = await sendDataToServer(dataToSend, 'https://smartloansbackend.azurewebsites.net/checks');
            if (response.status === 200 && response.data && response.data.length > 0) {
                setToastMessage('Check-out successful!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            } else {
                throw new Error('No response from the server or unknown format');
            }
        } catch (error: any) {
            console.error('Check-out error:', error);
            setAlertMessage("Failed to check out. Please try again. " + (error.message || "Unknown error"));
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
        setShowLoading(false);
    };

    const handleCommentSubmit = () => {
        console.log("Comment submitted:", comment);
        // Optionally send the comment to the server here
        // Reset the comment input field
        setComment("");
        // Show a toast or alert to confirm submission
        setToastMessage("Comment submitted successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
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
                        {!checkInData && (
                        <IonButton
                            expand="block"
                            onClick={handleCheckIn} 
                            className="icon-button">
                            <IonIcon 
                                slot="start" // Icon positioning
                                icon={timeOutline} 
                                style={{ fontSize: '54px' }} // Icon size to match the tab icon size
                            />
                            Check In
                        </IonButton>
                        )}
                        {checkInData && !checkOutData && (
                        <IonButton onClick={handleCheckOut} className="icon-button">
                            <IonIcon 
                                slot="start" // Icon positioning
                                icon={timeOutline} 
                                style={{ fontSize: '54px' }} // Icon size to match the tab icon size
                            />
                            Check Out
                        </IonButton>
                        )}
                        </>
                    )}
                </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header="Alert"
                        message={alertMessage}
                        buttons={alertButtons}
                    />
                    {checkInData && (
                        <IonCard>
                                <IonList >
                                    <IonItem style={{ fontSize: '1.2em', fontWeight: 'bold' }} >Checked in at: {checkInData.localTime}</IonItem>
                                    <IonItem>
                                        <IonIcon icon={locationOutline} slot="start" style={{ fontSize: '1.5em' }} /> {/* Location icon */}
                                        <IonLabel>Location</IonLabel>
                                        <IonText slot="end">
                                            {checkInData.address}
                                        </IonText>
                                    </IonItem>
     
                                </IonList>
                        </IonCard>
                    )}
                    {checkOutData && (
                        <IonCard>
                            <IonList >
                                <IonItem style={{ fontSize: '1.2em', fontWeight: 'bold' }} >Checked out at: {checkOutData.localTime}</IonItem>
                                <IonItem>
                                    <IonIcon icon={locationOutline} slot="start" style={{ fontSize: '1.5em' }} /> {/* Location icon */}
                                    <IonLabel>Location</IonLabel>
                                    <IonText slot="end">
                                        {checkOutData.address}
                                    </IonText>
                                </IonItem>
                            </IonList>
                        </IonCard>
                    )}

                    {(checkInData && checkOutData) && (
                    <>
                    <IonItem lines="full">
                        <IonTextarea
                            value={comment}
                            onIonChange={e => setComment(e.detail.value!)}
                            placeholder="Enter your comments here. (optional)"
                            autoGrow={true}
                        />
                    </IonItem>
                    <IonItem lines="none">
                        <IonNote slot="end">{`${comment.length}/100`}</IonNote>
                    </IonItem>
                    {comment && (
                        <IonButton expand="block" onClick={handleCommentSubmit} disabled={!comment.trim()}>Submit Comment</IonButton>
                    )}
                    </>
                    )}

                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => setShowToast(false)}
                        message={toastMessage}
                        duration={5000}
                    />
                    <IonLoading isOpen={showLoading} message="Please wait..." />
                </IonCol>
            </IonRow>
            </IonContent>

        </IonPage>
    );
};

export default Checks;
