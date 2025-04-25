import { axiosInstance } from '../lib/axios';

export const ticketService = {
  createTicket: async (dnsPrefix: string, data: { ticket_title: string; ticket_description: string }) => {
    const formData = new FormData();
    console.log({ dnsPrefix, data });
    formData.append('ticket_title', data.ticket_title);
    formData.append('ticket_description', data.ticket_description);
    
    const response = await axiosInstance.post(`/${dnsPrefix}/ticket`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getTickets: async (dnsPrefix: string, ticketStatus?: string) => {
    const url = ticketStatus 
      ? `/${dnsPrefix}/tickets?ticket_status=${ticketStatus}`
      : `/${dnsPrefix}/tickets`;
      
    const response = await axiosInstance.get(url);
    return response.data;
  },

  updateTicketStatus: async (dnsPrefix: string, ticketId: string, status: string) => {
    const response = await axiosInstance.put(`/${dnsPrefix}/ticket/${ticketId}/${status}`);
    return response.data;
  },

  getTicketById: async (dnsPrefix: string, ticketId: string) => {
    const response = await axiosInstance.get(`/${dnsPrefix}/ticket/${ticketId}/messages`);
    return response.data;
  }
};
