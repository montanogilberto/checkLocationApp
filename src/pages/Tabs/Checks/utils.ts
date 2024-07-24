// Utility functions related to date formatting and address parsing
export const parseAddress = (address: string) => {
  const parts = address.split(',').map((part: string) => part.trim());
  if (parts.length < 4) {
    return { street: parts[0], postalCode: '', city: parts[1], state: parts[2] };
  }
  return { street: parts[0], postalCode: parts[1], city: parts[2], state: parts[3] };
};

export const formatDateForSQL = (date: any) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};
