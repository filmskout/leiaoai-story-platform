import { supabase } from '@/lib/supabase';

export interface ProgramApplicationInput {
  slug: string;
  selectedDate?: string; // YYYY-MM-DD
  timeSlot?: string;
  documents: Array<{ name: string; type: string; url?: string }>;
  personalIntro?: string;
}

export async function submitProgramApplication(userId: string, input: ProgramApplicationInput) {
  const { data, error } = await supabase
    .from('program_applications')
    .insert({
      user_id: userId,
      slug: input.slug,
      selected_date: input.selectedDate ?? null,
      time_slot: input.timeSlot ?? null,
      documents: input.documents ?? [],
      personal_intro: input.personalIntro ?? null,
      status: 'submitted'
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}


