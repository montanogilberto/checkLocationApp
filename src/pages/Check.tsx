import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonPage, IonLoading, IonCardContent, IonCard, IonCardHeader, IonFab, IonFabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonButton, IonAlert, IonText } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import { timeOutline, checkmarkDoneOutline } from 'ionicons/icons';
import './Check.css';

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

const Check = () => {
    const [checkInData, setCheckInData] = useState<CheckData | null>(null);
    const [checkOutData, setCheckOutData] = useState<CheckData | null>(null);
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
    const [localTimeZone, setLocalTimeZone] = useState(0);
    const [trackingComplete, setTrackingComplete] = useState(false);


    useEffect(() => {
        const timer = setInterval(() => {
            const localTime = new Date(new Date().getTime() + localTimeZone * 1000);
            setCurrentTime(localTime.toLocaleString());
        }, 1000);
        return () => clearInterval(timer);
    }, [localTimeZone]);

    const fetchAddress = useCallback(async (latitude: number, longitude: number): Promise<string> => {
        const subscriptionKey = '7VP8ehPu5PpMzY3bU4kwr8yzFybNFxOo6nZAmJasoElzjL5HOYC0JQQJ99AFACYeBjFsu8ALAAAgAZMPwE5p';
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

    const handleCheckIn = async () => {
        setShowLoading(true);
        const position = await Geolocation.getCurrentPosition();
        const address = await fetchAddress(position.coords.latitude, position.coords.longitude);
        setCheckInData({
            time: new Date().toISOString(),
            localTime: new Date().toLocaleString(),
            location: position.coords,
            address: address
        });
        setShowLoading(false);
    };

    const handleCheckOut = async () => {
        if (!checkInData) {
            alert("Please check in before checking out.");
            return;
        }

        const currentTime = new Date();
        const checkInTime = new Date(checkInData.time);
        const diffHours = (currentTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

        if (diffHours < 8) {
            const remainingHours = 8 - diffHours;
            setAlertMessage(`You need at least 8 hours to pass before checking out. Only ${remainingHours.toFixed(2)} more hours to go. Do you want to continue?`);
            setShowAlert(true);
            return;
        }

        proceedWithCheckOut();
    };

    const proceedWithCheckOut = async () => {
        setShowLoading(true);
        const position = await Geolocation.getCurrentPosition();
        const address = await fetchAddress(position.coords.latitude, position.coords.longitude);
        setCheckOutData({
            time: new Date().toISOString(),
            localTime: new Date().toLocaleString(),
            location: position.coords,
            address: address
        });
        setShowLoading(false);
        setTrackingComplete(true);  // Set tracking complete to true after check-out
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Date Time: {currentTime}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {trackingComplete ? (
                    <IonText style={{ textAlign: 'center', fontSize: '18px', padding: '20px', color: 'green' }}>
                        Hours tracking complete
                    </IonText>
                    
                ) : (
                    <>
                    <br></br>
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
                    header={'Check Out Warning'}
                    message={alertMessage}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                console.log('Check out canceled');
                            }
                        },
                        {
                            text: 'Continue',
                            handler: () => {
                                proceedWithCheckOut();
                            }
                        }
                    ]}
                />
                {checkInData && (
                    <IonCard>
                        <IonCardHeader>
                            Checked in at: {checkInData.localTime}
                        </IonCardHeader>
                        <IonCardContent>
                            Location: {checkInData.location.latitude.toFixed(6)}, {checkInData.location.longitude.toFixed(6)}
                            <br />
                            Address: {checkInData.address}
                        </IonCardContent>
                    </IonCard>
                )}
                {checkOutData && (
                    <IonCard>
                        <IonCardHeader>
                            Checked out at: {checkOutData.localTime}
                        </IonCardHeader>
                        <IonCardContent>
                            Location: {checkOutData.location.latitude.toFixed(6)}, {checkOutData.location.longitude.toFixed(6)}
                            <br />
                            Address: {checkOutData.address}
                        </IonCardContent>
                    </IonCard>
                )}
                <IonLoading
                    isOpen={showLoading}
                    message={'Please wait...'}
                />
            </IonContent>
        </IonPage>
    );
    
};

export default Check;
