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
  const options = {
    timeZone: "Europe/Paris",
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: true as const,
  };


  const utcIsoString = toIsoUtc(dateString ?? "");
  const parisDateTime = new Date(utcIsoString).toLocaleString("fr-FR", options);
  return parisDateTime;
}