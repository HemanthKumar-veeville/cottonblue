export const getFormattedTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
}; 

function toIsoUtc(s: string) {
  if (!s) return "";
  if (s.includes("T")) {
    //add Z to make it ISO 8601; add 'Z' for UTC
    return s + "Z";
  }
  // If the string lacks 'T', make it ISO 8601; add 'Z' for UTC
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(s)) {
    return s.replace(" ", "T") + "Z";
  }
  return s;
}



export const formatDateToParis = (dateString?: string): string => {
  if (!dateString) return "Invalid Date";

  try {
    const utcIsoString = toIsoUtc(dateString);
    const date = new Date(utcIsoString);
    
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Create a formatter for Paris timezone
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Get parts array from the formatter
    const parts = formatter.formatToParts(date);
    
    // Extract each part
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    const hour = parts.find(p => p.type === 'hour')?.value || '';
    const minute = parts.find(p => p.type === 'minute')?.value || '';

    // Format exactly as DD/MM/YY at HHhMM
    return `${day}/${month}/${year} at ${hour}h${minute}`;
  } catch (error) {
    return "Invalid Date";
  }
}