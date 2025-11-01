#!/usr/bin/env node
/**
 * Generate AI stories for each project category
 * Each category gets at least 10 stories with:
 * - Project rating
 * - User experience simulation
 * - Cover image
 * - Tags matching category
 * - Project and company linkage
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PPLX_API_KEY = process.env.PPLX_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CATEGORIES = [
  'LLM & Language Models',
  'Image Processing & Generation',
  'Video Processing & Generation',
  'Professional Domain Analysis',
  'Virtual Companions',
  'Virtual Employees & Assistants',
  'Voice & Audio AI',
  'Search & Information Retrieval'
];

const STORIES_PER_CATEGORY = 10;

async function callLLM(prompt, maxTokens = 1500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const apiKey = PPLX_API_KEY || OPENAI_API_KEY;
    const apiUrl = PPLX_API_KEY 
      ? 'https://api.perplexity.ai/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    const model = PPLX_API_KEY ? 'sonar-pro' : 'gpt-4o-mini';

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: 'You are an expert technical writer creating authentic user experience stories for AI products. Write engaging, realistic stories that feel genuine and helpful.' },
          { role: 'user', content: prompt }
        ]
      }),
      signal: controller.signal
    });

    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    return json?.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timeout);
  }
}

async function generateStoryForProject(project, company, category) {
  const prompt = `Create a realistic user experience story for ${project.name} by ${company.name} in the category "${category}".

Requirements:
1. Title: Engaging title (50-80 chars)
2. Content: Detailed user experience narrative (400-800 words) covering:
   - First impressions
   - Key features tested
   - Real-world use case
   - Pros and cons
   - Overall rating (1-5 stars, include specific number)
   - Recommendation
3. Excerpt: 2-3 sentence summary (100-150 chars)
4. Tags: 3-5 relevant tags including the category name
5. Cover Image: Suggest a relevant Unsplash image search query (one keyword/phrase)

Output JSON format:
{
  "title": "...",
  "content": "...",
  "excerpt": "...",
  "tags": ["tag1", "tag2", ...],
  "cover_image_query": "...",
  "rating": 4.5
}`;

  const raw = await callLLM(prompt);
  let story;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    story = JSON.parse(match ? match[0] : raw);
  } catch {
    console.error('Failed to parse LLM response:', raw);
    return null;
  }

  // Generate cover image URL (using Unsplash)
  const imageQuery = story.cover_image_query || `${project.name} ${category}`;
  const coverImageUrl = `https://source.unsplash.com/1200x630/?${encodeURIComponent(imageQuery)}`;

  return {
    title: story.title || `Using ${project.name}: A Real User Experience`,
    content: story.content || '',
    excerpt: story.excerpt || story.content?.substring(0, 150) || '',
    tags: [...(story.tags || []), category],
    cover_image_url: coverImageUrl,
    category,
    project_id: project.id,
    company_id: company.id,
    rating: story.rating || 4.0,
    ai_generated: true,
    status: 'published'
  };
}

async function generateStoriesForCategory(category) {
  console.log(`\n📝 Generating stories for category: ${category}`);

  // Fetch projects in this category
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      project_category,
      company_id,
      company:companies(id, name, logo_url)
    `)
    .eq('project_category', category)
    .limit(20); // Get multiple projects to choose from

  if (error) {
    console.error(`Error fetching projects for ${category}:`, error);
    return [];
  }

  if (!projects || projects.length === 0) {
    console.warn(`No projects found for category: ${category}`);
    return [];
  }

  const stories = [];
  const processedProjects = new Set();

  // Generate stories, ensuring we don't repeat projects too much
  for (let i = 0; i < STORIES_PER_CATEGORY; i++) {
    const project = projects[i % projects.length];
    if (!project || !project.company) continue;

    const story = await generateStoryForProject(project, project.company, category);
    if (story) {
      stories.push(story);
      processedProjects.add(project.id);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  return stories;
}

async function insertStoriesToDB(stories) {
  const results = [];
  
  for (const story of stories) {
    try {
      // Insert story
      const { data: insertedStory, error: storyError } = await supabase
        .from('stories')
        .insert({
          title: story.title,
          content: story.content,
          excerpt: story.excerpt,
          cover_image_url: story.cover_image_url,
          category: story.category,
          tags: story.tags,
          author_id: '00000000-0000-0000-0000-000000000000', // System user
          status: story.status,
          ai_generated: story.ai_generated,
          likes_count: 0,
          views_count: 0,
          comments_count: 0,
          saves_count: 0
        })
        .select()
        .single();

      if (storyError) throw storyError;

      // Link to project if exists
      if (story.project_id) {
        await supabase
          .from('project_stories')
          .insert({
            story_id: insertedStory.id,
            project_id: story.project_id
          });
      }

      // Link to company if exists
      if (story.company_id) {
        await supabase
          .from('company_stories')
          .insert({
            story_id: insertedStory.id,
            company_id: story.company_id
          });
      }

      results.push({ success: true, story: insertedStory.id });
      console.log(`✅ Created story: ${story.title}`);
    } catch (error) {
      console.error(`❌ Failed to insert story "${story.title}":`, error.message);
      results.push({ success: false, error: error.message });
    }
  }

  return results;
}

async function main() {
  console.log('🚀 Starting story generation...\n');

  const allStories = [];
  
  for (const category of CATEGORIES) {
    const stories = await generateStoriesForCategory(category);
    allStories.push(...stories);
    
    // Insert stories for this category
    const results = await insertStoriesToDB(stories);
    const successCount = results.filter(r => r.success).length;
    console.log(`📊 Category ${category}: ${successCount}/${stories.length} stories inserted`);
  }

  console.log(`\n✅ Total: ${allStories.length} stories generated`);
  console.log('📝 Stories have been inserted into the database');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

