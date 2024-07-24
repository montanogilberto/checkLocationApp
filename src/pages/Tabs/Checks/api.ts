import axios from 'axios';
import { CheckData } from './types';

// Function to fetch address using Geolocation coordinates
export const fetchAddress = async (latitude: number, longitude: number): Promise<string> => {
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
};

// Function to send data to the backend
export const sendDataToServer = async (data: any, url: string) => {
  try {
    const response = await axios.post(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};
