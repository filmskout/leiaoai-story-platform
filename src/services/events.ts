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


