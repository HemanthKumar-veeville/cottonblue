export const isAdminHostname = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.startsWith('admin.');
}; 