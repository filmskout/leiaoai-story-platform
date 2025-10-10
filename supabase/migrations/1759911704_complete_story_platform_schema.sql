-- Migration: complete_story_platform_schema
-- Created at: 1759911704

-- Create stories table with all required fields
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  publisher TEXT,
  status TEXT DEFAULT 'published',
  is_public BOOLEAN DEFAULT true,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create story_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS story_tags (
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, tag_id)
);

-- Create story interactions tables
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, user_id, session_id)
);

CREATE TABLE IF NOT EXISTS story_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, user_id, session_id)
);

CREATE TABLE IF NOT EXISTS story_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS story_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_is_public ON stories(is_public);
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_story_id ON story_saves(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);

-- Insert sample tags
INSERT INTO tags (name) VALUES 
  ('Technology'), 
  ('Travel'), 
  ('Food'), 
  ('Lifestyle'), 
  ('Business'), 
  ('Health'),
  ('Adventure'),
  ('Culture'),
  ('Science'),
  ('Art')
ON CONFLICT (name) DO NOTHING;

-- Insert sample stories
INSERT INTO stories (title, content, author, excerpt, featured_image_url, publisher, location) VALUES 
  (
    'The Future of Sustainable Technology',
    'In an era where environmental consciousness meets technological innovation, we''re witnessing remarkable breakthroughs in sustainable technology. From solar panels that work in low light to wind turbines that operate silently, the future looks brighter than ever. Companies worldwide are investing billions in green technology, creating solutions that not only protect our planet but also drive economic growth. The integration of AI in energy management systems has led to 30% improvements in efficiency, while smart grids are revolutionizing how we distribute and consume power.',
    'Dr. Sarah Chen',
    'Exploring the latest breakthroughs in sustainable technology and their impact on our future.',
    '/images/tech-future.jpg',
    'Tech Innovations Weekly',
    'Silicon Valley, CA'
  ),
  (
    'Hidden Gems of Mediterranean Cuisine',
    'The Mediterranean diet isn''t just about olive oil and fresh vegetables—it''s a celebration of culture, tradition, and community. During my recent journey through coastal villages, I discovered recipes passed down through generations, each telling a story of resilience and creativity. From the aromatic za''atar blends of Lebanon to the unexpected seafood preparations of remote Greek islands, every meal became an adventure. Local fishermen shared their secrets for the perfect catch, while grandmothers revealed spice combinations that transform simple ingredients into extraordinary experiences.',
    'Marco Rodriguez',
    'A culinary journey through lesser-known Mediterranean recipes and traditions.',
    '/images/mediterranean-food.jpg',
    'Culinary Adventures',
    'Santorini, Greece'
  ),
  (
    'Building Resilient Communities in the Digital Age',
    'As our world becomes increasingly connected, the importance of building strong, resilient communities has never been more apparent. Digital platforms are creating new opportunities for neighbors to connect, share resources, and support each other in unprecedented ways. From neighborhood apps that facilitate tool sharing to community gardens organized through social media, technology is strengthening the very fabric of local communities. However, this digital transformation comes with challenges that require thoughtful navigation and inclusive design.',
    'Jennifer Thompson',
    'How digital tools are transforming community building and social connections.',
    '/images/community-digital.jpg',
    'Social Impact Review',
    'Portland, OR'
  ),
  (
    'The Art of Mindful Travel',
    'Travel has evolved beyond checking destinations off a bucket list. Today''s conscious travelers seek meaningful connections, cultural understanding, and personal transformation. Through slow travel practices and mindful exploration, we can create journeys that enrich both ourselves and the communities we visit. This approach emphasizes quality over quantity, depth over breadth, and leaves positive impacts wherever we go. From learning traditional crafts in remote villages to participating in conservation efforts, mindful travel opens doors to authentic experiences.',
    'Alex Kim',
    'Discovering the transformative power of slow, conscious travel experiences.',
    '/images/mindful-travel.jpg',
    'Wanderlust Magazine',
    'Kyoto, Japan'
  ),
  (
    'Innovation in Urban Agriculture',
    'Cities around the world are embracing vertical farming, rooftop gardens, and hydroponic systems to address food security and sustainability challenges. These innovative approaches are not only producing fresh, local food but also creating green jobs and strengthening urban communities. From Singapore''s sky-high farms to Detroit''s transformed vacant lots, urban agriculture is proving that cities can be part of the solution to global food challenges. The integration of IoT sensors and automated systems is making urban farming more efficient and accessible than ever before.',
    'David Park',
    'How cities are revolutionizing food production through innovative agricultural techniques.',
    '/images/urban-farming.jpg',
    'Urban Innovation Today',
    'Singapore'
  ),
  (
    'The Science of Human Connection',
    'Recent neuroscience research reveals fascinating insights about how human connections affect our brain chemistry and overall well-being. Studies show that meaningful relationships literally rewire our neural pathways, improving memory, reducing stress, and boosting immune function. In an age of digital communication, understanding the biological importance of face-to-face interaction becomes crucial. Scientists are discovering that the quality of our relationships may be the single most important factor in determining our happiness and longevity.',
    'Dr. Maria Santos',
    'Exploring the neurological basis of human relationships and social connections.',
    '/images/human-connection.jpg',
    'Science & Society',
    'Boston, MA'
  )
ON CONFLICT (id) DO NOTHING;;