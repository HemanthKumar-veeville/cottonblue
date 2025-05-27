export const isAdminHostname = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.startsWith('admin.')
  // return hostname.startsWith('admin.') || hostname === 'localhost';
}; 

export const isWarehouseHostname = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.startsWith('sedis.') || hostname === 'localhost';
};

export const getHost = (): string => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' ? 'sedis' : hostname.split('.')[0];
};