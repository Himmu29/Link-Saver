-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  favicon TEXT,
  tags TEXT[] DEFAULT '{}',
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Create index for faster queries by created_at
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_bookmarks_search ON bookmarks USING GIN (to_tsvector('english', title || ' ' || summary));

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own bookmarks
CREATE POLICY "Users can update own bookmarks" ON bookmarks
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookmarks_updated_at 
  BEFORE UPDATE ON bookmarks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 