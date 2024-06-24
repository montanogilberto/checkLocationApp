import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonGrid, IonRow, IonCol, IonLabel, IonToast, IonRouterLink, IonButton, IonItem, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './../../master.css';
import './Login.css';
import { eye, eyeOff } from 'ionicons/icons';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  console.log('Props:', { onLoginSuccess });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in...');
    setLoading(true);

    try {
      const response = await fetch('https://smartloansbackend.azurewebsites.net/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logins: [
            {
              username,
              password,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { result } = await response.json();

      if (!result || !result.length) {
        throw new Error('Invalid response structure');
      }

      const message = result[0]?.msg;

      if (message === 'User Invalid') {
        setMessage(message);
        console.error('Login failed: User Invalid');
      } else {
        console.log('Login successful:', message);
        onLoginSuccess();
        history.push('/Checks');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage('Login failed: ' + error.message);
      } else {
        setMessage('Login failed: An unknown error occurred');
      }
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeSm="8" sizeMd="6" sizeLg="4">
              <h1 className="ion-text-center">Login</h1>
              <IonToast
                isOpen={!!message}
                message={message || ''}
                duration={3000}
                onDidDismiss={() => setMessage(null)}
                color="danger"
                position="top"
              />
              <form onSubmit={handleLogin}>
                <IonLabel position="floating">Username</IonLabel>
                <IonInput
                  type="text"
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                ></IonInput>

                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <IonIcon
                    slot="end"
                    icon={showPassword ? eye : eyeOff}
                    onClick={togglePasswordVisibility}
                    style={{ position: 'absolute', top: '46%', transform: 'translateY(-50%)', right: '10px', cursor: 'pointer', zIndex: 2 }}
                  />
                </IonInput>

                <IonButton
                  type="submit"
                  expand="full"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </IonButton>
              </form>

              <div className="ion-text-center">
                <p>
                  <IonRouterLink href="/forgot-password">Forgot Password?</IonRouterLink>
                </p>
                <p>
                  <IonRouterLink href="/create-account">Create Account</IonRouterLink>
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
