// types.ts
export interface CheckData {
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

