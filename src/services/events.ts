import { supabase } from '@/lib/supabase';

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startsAt: string; // ISO
  endsAt?: string;  // ISO
  capacity?: number;
  visibility?: 'public' | 'private';
}

export async function createEvent(userId: string, input: CreateEventInput) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      creator_id: userId,
      title: input.title,
      description: input.description,
      location: input.location,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      capacity: input.capacity,
      visibility: input.visibility ?? 'public'
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function listUpcomingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function registerEvent(eventId: string, userId: string, ticketId?: string) {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert({ event_id: eventId, user_id: userId, ticket_id: ticketId ?? null })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export interface CreateTicketInput {
  name: string;
  priceCents?: number;
  currency?: string;
  quota?: number;
}

export async function createTicket(eventId: string, input: CreateTicketInput) {
  const { data, error } = await supabase
    .from('event_tickets')
    .insert({
      event_id: eventId,
      name: input.name,
      price_cents: input.priceCents ?? 0,
      currency: input.currency ?? 'CNY',
      quota: input.quota
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function listTickets(eventId: string) {
  const { data, error } = await supabase
    .from('event_tickets')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function listRegistrations(eventId: string) {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*, user:auth.users(email)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}


