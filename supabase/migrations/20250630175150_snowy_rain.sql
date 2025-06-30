/*
  # API Keys and Usage Tracking Tables

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text, user-defined name for the key)
      - `provider` (text, AI provider: openai, anthropic, etc.)
      - `key_hash` (text, encrypted/hashed API key)
      - `key_preview` (text, preview of the key for UI)
      - `is_active` (boolean, whether the key is active)
      - `last_used` (timestamp, when the key was last used)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `openai_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `model` (text, OpenAI model used)
      - `prompt_tokens` (integer, tokens in prompt)
      - `completion_tokens` (integer, tokens in completion)
      - `total_tokens` (integer, total tokens used)
      - `cost` (decimal, cost in USD)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own API keys and usage data
    - Proper indexes for performance

  3. Triggers
    - Update trigger for api_keys table
*/

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    key_hash VARCHAR(500) NOT NULL,
    key_preview VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OpenAI Usage tracking table
CREATE TABLE IF NOT EXISTS openai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model VARCHAR(100) NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_openai_usage_user_id ON openai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_openai_usage_created_at ON openai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_openai_usage_model ON openai_usage(model);

-- Update trigger for api_keys
CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE openai_usage ENABLE ROW LEVEL SECURITY;

-- API Keys table policies
CREATE POLICY "Users can read own API keys"
    ON api_keys
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys"
    ON api_keys
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
    ON api_keys
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
    ON api_keys
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- OpenAI Usage table policies
CREATE POLICY "Users can read own usage data"
    ON openai_usage
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own usage data"
    ON openai_usage
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);