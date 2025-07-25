import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketService } from '../../services/ticketService';
import { TicketStatus } from '../../screens/Tickets/Tickets';
import { formatDateToParis } from '../../utils/dateUtils';

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  currentTicket: null,
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
    
    return response;
  }
);

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async ({ dnsPrefix, ticketStatus }: { dnsPrefix: string; ticketStatus?: string }) => {
    const response = await ticketService.getTickets(dnsPrefix === "warehouse" ? "sedis" : dnsPrefix, ticketStatus);
    return response?.tickets || [];
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateStatus',
  async ({ dnsPrefix, ticketId, status }: { dnsPrefix: string; ticketId: string; status: string }) => {
    const response = await ticketService.updateTicketStatus(dnsPrefix, ticketId, status);
    if (!response.ticket_id && !response.id) {
      throw new Error('Invalid response: Missing ticket ID');
    }
    return {
      id: response.ticket_id || response.id,
      title: response.ticket_title || response.title || '',
      description: response.ticket_description || response.description,
      status: response.ticket_status || response.status || TicketStatus.OPEN,
      createdAt: formatDateToParis(response?.created_at || response?.createdAt),
      updatedAt: formatDateToParis(response?.updated_at || response?.updatedAt)
    } as Ticket;
  }
);

export const getTicketById = createAsyncThunk(
  'tickets/getTicketById',
  async ({ dnsPrefix, ticketId }: { dnsPrefix: string; ticketId: string }) => {
    const response = await ticketService.getTicketById(dnsPrefix, ticketId);
    return response;
  }
);

export const replyToTicket = createAsyncThunk(
  'tickets/replyToTicket',
  async ({ dnsPrefix, ticketId, data }: { dnsPrefix: string; ticketId: string; data: { message: string; image?: File } }) => {
    const response = await ticketService.replyToTicket(dnsPrefix, ticketId, data);
    return response;
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    resetCurrentTicket: (state) => {
      state.currentTicket = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
      })
      // Update Ticket Status
      .addCase(updateTicketStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const ticketIndex = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex] = {
            ...state.tickets[ticketIndex],
            status: action.payload.status,
            updatedAt: action.payload.updatedAt
          };
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = {
            ...state.currentTicket,
            status: action.payload.status,
            updatedAt: action.payload.updatedAt
          };
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update ticket status';
      })
      // Get Ticket by ID
      .addCase(getTicketById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTicket = action.payload;
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch ticket';
      })
      // Reply to Ticket
      .addCase(replyToTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(replyToTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(replyToTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to reply to ticket';
      });
  },
});

export const { resetCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
