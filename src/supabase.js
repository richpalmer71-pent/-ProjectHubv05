import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gccunjinivvjljznpwvh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CCE9BMVSsKUWUhtLkkQqCg_IKQO76oS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================
// PROJECT FUNCTIONS
// =============================================

// Load all projects (for Dashboard)
export async function loadProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('loadProjects error:', error); return []; }
  return data || [];
}

// Load a single project by job number
export async function loadProject(jobNumber) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('job_number', jobNumber)
    .single();
  if (error) { console.error('loadProject error:', error); return null; }
  return data;
}

// Save or update a project (upsert = insert if new, update if exists)
export async function saveProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .upsert({
      job_number: project.job_number,
      brand: project.brand || '',
      title: project.title || '',
      objective: project.objective || '',
      locales: project.locales || [],
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      handover_date: project.handover_date || '',
      channels: project.channels || [],
      status: project.status || 'active',
    }, { onConflict: 'job_number' })
    .select()
    .single();
  if (error) { console.error('saveProject error:', error); return null; }
  return data;
}

// Delete a project and all related data (cascades)
export async function deleteProject(jobNumber) {
  // First get the project id
  const project = await loadProject(jobNumber);
  if (!project) return false;
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', project.id);
  if (error) { console.error('deleteProject error:', error); return false; }
  return true;
}

// =============================================
// TOOLKIT FUNCTIONS
// =============================================

export async function loadToolkit(projectId) {
  const { data, error } = await supabase
    .from('toolkit')
    .select('*')
    .eq('project_id', projectId)
    .single();
  if (error && error.code !== 'PGRST116') { console.error('loadToolkit error:', error); }
  return data || null;
}

export async function saveToolkit(projectId, toolkit) {
  const { data, error } = await supabase
    .from('toolkit')
    .upsert({
      project_id: projectId,
      toolkit_title: toolkit.toolkit_title || '',
      dam_link: toolkit.dam_link || '',
      asset_bank_link: toolkit.asset_bank_link || '',
      design_files: toolkit.design_files || '',
      copy_toolkit: toolkit.copy_toolkit || '',
      brand_guidelines: toolkit.brand_guidelines || '',
    }, { onConflict: 'project_id' })
    .select()
    .single();
  if (error) { console.error('saveToolkit error:', error); return null; }
  return data;
}

// =============================================
// WEB ASSETS FUNCTIONS
// =============================================

export async function loadWebAssets(projectId) {
  const { data, error } = await supabase
    .from('web_assets')
    .select('*')
    .eq('project_id', projectId)
    .order('num', { ascending: true });
  if (error) { console.error('loadWebAssets error:', error); return []; }
  return data || [];
}

export async function saveWebAssets(projectId, assets) {
  // Delete existing and re-insert (simplest approach for array data)
  await supabase.from('web_assets').delete().eq('project_id', projectId);
  if (!assets || assets.length === 0) return [];
  const rows = assets.map((a, i) => ({
    project_id: projectId,
    num: i + 1,
    name: a.name || '',
    collapsed: a.collapsed || false,
    parts: a.parts || [],
    active_tab: a.activeTab || 0,
    owner: a.owner || '',
  }));
  const { data, error } = await supabase.from('web_assets').insert(rows).select();
  if (error) { console.error('saveWebAssets error:', error); return []; }
  return data || [];
}

// =============================================
// EMAIL ASSETS FUNCTIONS
// =============================================

export async function loadEmailAssets(projectId) {
  const { data, error } = await supabase
    .from('email_assets')
    .select('*')
    .eq('project_id', projectId)
    .order('num', { ascending: true });
  if (error) { console.error('loadEmailAssets error:', error); return []; }
  return data || [];
}

export async function saveEmailAssets(projectId, assets) {
  await supabase.from('email_assets').delete().eq('project_id', projectId);
  if (!assets || assets.length === 0) return [];
  const rows = assets.map((a, i) => ({
    project_id: projectId,
    num: i + 1,
    name: a.name || '',
    send_date: a.sendDate || '',
    handover_date: a.handoverDate || '',
    collapsed: a.collapsed || false,
    parts: a.parts || [],
    active_tab: a.activeTab || 0,
    owner: a.owner || '',
  }));
  const { data, error } = await supabase.from('email_assets').insert(rows).select();
  if (error) { console.error('saveEmailAssets error:', error); return []; }
  return data || [];
}

// =============================================
// PAID MEDIA FUNCTIONS
// =============================================

export async function loadPaidMedia(projectId) {
  const { data, error } = await supabase
    .from('paid_media')
    .select('*')
    .eq('project_id', projectId)
    .single();
  if (error && error.code !== 'PGRST116') { console.error('loadPaidMedia error:', error); }
  return data || null;
}

export async function savePaidMedia(projectId, media) {
  const { data, error } = await supabase
    .from('paid_media')
    .upsert({
      project_id: projectId,
      sizes: media.sizes || {},
      other_sizes: media.other_sizes || '',
      hero_image: media.hero_image || '',
      copy_requirements: media.copy_requirements || '',
      video_content: media.video_content || '',
      owner: media.owner || '',
    }, { onConflict: 'project_id' })
    .select()
    .single();
  if (error) { console.error('savePaidMedia error:', error); return null; }
  return data;
}

// =============================================
// PROFILES FUNCTIONS
// =============================================

export async function loadProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('first_name', { ascending: true });
  if (error) { console.error('loadProfiles error:', error); return []; }
  return data || [];
}

export async function saveProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      email: profile.email,
      first_name: profile.firstName || profile.first_name || '',
      last_name: profile.lastName || profile.last_name || '',
      job_title: profile.jobTitle || profile.job_title || '',
      department: profile.department || '',
    }, { onConflict: 'email' })
    .select()
    .single();
  if (error) { console.error('saveProfile error:', error); return null; }
  return data;
}

// =============================================
// PURGE — Delete everything
// =============================================

export async function purgeDatabase() {
  // Delete in order to respect foreign key constraints
  await supabase.from('approvals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('paid_media').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('email_assets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('web_assets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('toolkit').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // Keep default profiles but clear any added ones
  await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // Re-insert defaults
  await supabase.from('profiles').upsert([
    { email: 'richard.palmer@pentland.com', first_name: 'Richard', last_name: 'Palmer', job_title: 'Digital Designer', department: 'Digital' },
    { email: 'farah.yousaf@pentland.com', first_name: 'Farah', last_name: 'Yousaf', job_title: 'Digital Marketing Manager', department: 'Digital' },
  ], { onConflict: 'email' });
  return true;
}

// =============================================
// DEMO DATA — Insert sample project
// =============================================

export async function loadDemoData() {
  // Create demo project
  const project = await saveProject({
    job_number: 'PEN-2025-0042',
    brand: 'Speedo',
    title: 'Summer 25 Launch',
    objective: 'Drive awareness and sales for the Summer 2025 Speedo collection across all digital channels.',
    locales: ['UK (ENG)', 'DE (GER)', 'FR (FR)'],
    start_date: '2025-03-01',
    end_date: '2025-06-15',
    handover_date: '2025-05-20',
    channels: ['web', 'email', 'paid'],
    status: 'active',
  });

  if (!project) return null;

  // Toolkit
  await saveToolkit(project.id, {
    toolkit_title: 'SS25 Digital Toolkit',
    dam_link: 'https://dam.pentland.com/speedo-ss25',
    asset_bank_link: 'https://assetbank.pentland.com/speedo',
    design_files: 'https://figma.com/speedo-ss25',
    copy_toolkit: 'On-brand tone of voice. Active, confident, inclusive.',
    brand_guidelines: 'Follow Speedo brand guidelines v4.2',
  });

  // Web assets
  await saveWebAssets(project.id, [
    { name: 'Homepage Hero Banner', collapsed: false, activeTab: 0, parts: [
      { id: 1, locale: 'UK (ENG)', briefStatus: 'with_design', name: 'Homepage Hero', heroImage: '', heading: 'Make Waves This Summer', subcopy: 'New collection now live', cta: 'Shop Now', secondaryCta: 'Explore Collection', notes: '', figmaLink: '' }
    ]},
    { name: 'PLP Category Banner', collapsed: true, activeTab: 0, parts: [
      { id: 2, locale: 'UK (ENG)', briefStatus: 'with_copy', name: 'PLP Banner', heroImage: '', heading: 'Swim Collection', subcopy: 'Performance meets style', cta: 'View All', secondaryCta: '', notes: '', figmaLink: '' }
    ]},
  ]);

  // Email assets
  await saveEmailAssets(project.id, [
    { name: 'Launch Email', sendDate: '2025-06-01', handoverDate: '2025-05-20', collapsed: false, activeTab: 0, parts: [
      { id: 3, locale: 'UK (ENG)', briefStatus: 'awaiting_approval', subjectLine: 'Make Waves This Summer', preHeader: 'New Speedo collection is here', heroImage: '', heading: 'Dive Into Summer 25', bodyCopy: 'Our latest collection combines cutting-edge technology with bold design.', cta: 'Shop Now', secondaryCta: 'Explore', notes: '', figmaLink: '' }
    ]},
    { name: 'Promo Follow-Up', sendDate: '2025-06-10', handoverDate: '2025-05-28', collapsed: true, activeTab: 0, parts: [
      { id: 4, locale: 'UK (ENG)', briefStatus: 'with_copy', subjectLine: "Don't Miss Out", preHeader: '', heroImage: '', heading: 'Summer Essentials', bodyCopy: 'Get ready for the season with our top picks.', cta: 'Shop Now', secondaryCta: '', notes: '', figmaLink: '' }
    ]},
  ]);

  // Paid media
  await savePaidMedia(project.id, {
    sizes: { 'PMAX / PPC': ['1200x628', '1200x1200'], 'PAID SOCIAL': ['1080x1080', '1080x1350'] },
    other_sizes: '',
    hero_image: 'https://dam.pentland.com/speedo-hero.jpg',
    copy_requirements: 'Bold headlines, active lifestyle messaging. CTAs: Shop Now, Explore.',
    video_content: '15s product showcase for social.',
  });

  return project;
}
