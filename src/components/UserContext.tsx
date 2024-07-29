import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  username: string;
  avatarUrl: string;
  setUsername: (username: string) => void;
  setAvatarUrl: (url: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const defaultAvatarUrl = 'ttps://www.w3schools.com/howto/img_avatar.png'; // Set your default avatar image path here
  const [username, setUsername] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatarUrl);

  return (
    <UserContext.Provider value={{ username, avatarUrl, setUsername, setAvatarUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
