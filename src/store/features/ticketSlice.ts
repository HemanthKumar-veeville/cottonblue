import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ticketService } from '../../services/ticketService';
import { TicketStatus } from '../../screens/Tickets/Tickets';

// Types
export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: TicketStatus | 'all';
  searchQuery: string;
}

// Initial state
const initialState: TicketState = {
  tickets: [],
  selectedTicket: null,
  isLoading: false,
  error: null,
  statusFilter: 'all',
  searchQuery: '',
};

// Async thunks
export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: { ticket_title: string; ticket_description: string } }) => {
    const response = await ticketService.createTicket(dnsPrefix, data);
    return response;
  }
);

// Slice
const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<TicketStatus | 'all'>) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateTicketStatus: (state, action: PayloadAction<{ ticketId: string; status: TicketStatus }>) => {
      const ticket = state.tickets.find(t => t.id === action.payload.ticketId);
      if (ticket) {
        ticket.status = action.payload.status;
        ticket.updatedAt = new Date();
      }
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.unshift(action.payload);
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const newTicket: Ticket = {
          id: `#${Math.floor(Math.random() * 1000000)}`, // You might want to use the ID from the API response instead
          title: action.payload.ticket_title,
          description: action.payload.ticket_description,
          status: TicketStatus.OPEN,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        state.tickets.unshift(newTicket);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create ticket';
      });
  },
});

// Selectors
export const selectAllTickets = (state: { tickets: TicketState }) => state.tickets.tickets;
export const selectFilteredTickets = (state: { tickets: TicketState }) => {
  const { tickets, statusFilter, searchQuery } = state.tickets;
  return tickets.filter((ticket) => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};
export const selectTicketsInProgress = (state: { tickets: TicketState }) => {
  return state.tickets.tickets.filter(
    (ticket) => ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS
  );
};
export const selectCompletedTickets = (state: { tickets: TicketState }) => {
  return state.tickets.tickets.filter(
    (ticket) => ticket.status === TicketStatus.COMPLETED || ticket.status === TicketStatus.CLOSED
  );
};
export const selectSelectedTicket = (state: { tickets: TicketState }) => state.tickets.selectedTicket;
export const selectTicketLoading = (state: { tickets: TicketState }) => state.tickets.isLoading;
export const selectTicketError = (state: { tickets: TicketState }) => state.tickets.error;

// Actions
export const {
  setSelectedTicket,
  setStatusFilter,
  setSearchQuery,
  updateTicketStatus,
  addTicket,
  updateTicket,
} = ticketSlice.actions;

// Reducer
export default ticketSlice.reducer;
