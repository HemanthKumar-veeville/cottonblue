import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketService } from '../../services/ticketService';
import { TicketStatus } from '../../screens/Tickets/Tickets';

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketState {
  tickets: Ticket[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  status: 'idle',
  error: null
};

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: { title: string; description: string } }) => {
    const response = await ticketService.createTicket(dnsPrefix, {
      ticket_title: data.title,
      ticket_description: data.description
    });
    // Transform the API response to match our Ticket interface
    return {
      id: response.ticket_id || response.id,
      title: response.ticket_title || response.title,
      status: response.ticket_status || response.status || TicketStatus.OPEN,
      description: response.ticket_description || response.description,
      createdAt: new Date(response.created_at || response.createdAt),
      updatedAt: new Date(response.updated_at || response.updatedAt)
    };
  }
);

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async ({ dnsPrefix, ticketStatus }: { dnsPrefix: string; ticketStatus?: string }) => {
    const response = await ticketService.getTickets(dnsPrefix, ticketStatus);
    return response?.tickets || [];
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create ticket';
      })
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tickets';
      });
  },
});

export default ticketSlice.reducer;
