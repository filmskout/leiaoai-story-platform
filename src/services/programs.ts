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

export async function uploadProgramDocument(
  slug: string,
  userId: string,
  file: File
) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${slug}/${userId}/${Date.now()}_${sanitizedName}`;
  const { data, error } = await supabase.storage.from('program-docs').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('program-docs').getPublicUrl(data.path);
  return { path: data.path, publicUrl: urlData.publicUrl };
}

export async function listMyProgramApplications(userId: string) {
  const { data, error } = await supabase
    .from('program_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export type ProgramStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

export async function updateProgramStatus(applicationId: string, status: ProgramStatus) {
  const { data, error } = await supabase
    .from('program_applications')
    .update({ status })
    .eq('id', applicationId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function addProgramReviewLog(applicationId: string, adminId: string, action: string, note?: string) {
  const { data, error } = await supabase
    .from('program_review_logs')
    .insert({ application_id: applicationId, admin_id: adminId, action, note: note ?? null })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function listProgramReviewLogs(applicationId: string) {
  const { data, error } = await supabase
    .from('program_review_logs')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}


