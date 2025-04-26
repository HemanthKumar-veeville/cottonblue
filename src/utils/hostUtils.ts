export const isAdminHostname = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.startsWith('admin.')
  // return hostname.startsWith('admin.') || hostname === 'localhost';
}; 

export const getHost = (): string => {
  const hostname = window.location.hostname;
  console.log({ hostname: hostname.split('.')[0] });
  return hostname === 'localhost' ? 'chronodrive' : hostname;
};



