export const isAdminHostname = (): boolean => {
  const hostname = window.location.hostname;
  // return hostname.startsWith('admin.')
  return hostname.startsWith('admin.') || hostname === 'localhost';
}; 