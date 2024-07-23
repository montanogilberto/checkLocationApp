// apiUtils.ts
import axios from 'axios';

export const fetchAddress = async (latitude: number, longitude: number): Promise<string> => {
  const subscriptionKey = 'Your_Subscription_Key';
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

export const formatDateForSQL = (date: any): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};
