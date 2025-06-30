/*
  # API Keys and OpenAI Usage Tables

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (varchar, API key name)
      - `provider` (varchar, provider name like 'openai')
      - `key_hash` (varchar, encrypted API key)
      - `key_preview` (varchar, preview of key)
      - `is_active` (boolean, whether key is active)
      - `last_used` (timestamp, when key was last used)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `openai_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `model` (varchar, OpenAI model used)
      - `prompt_tokens` (integer, tokens in prompt)
      - `completion_tokens` (integer, tokens in completion)
      - `total_tokens` (integer, total tokens used)
      - `cost` (decimal, cost of the request)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data

  3. Performance
    - Add indexes for common query patterns
    - Add update trigger for api_keys table (with conflict handling)
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

-- Update trigger for api_keys (with conflict handling)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_api_keys_updated_at' 
        AND tgrelid = 'api_keys'::regclass
    ) THEN
        CREATE TRIGGER update_api_keys_updated_at 
            BEFORE UPDATE ON api_keys 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE openai_usage ENABLE ROW LEVEL SECURITY;

-- API Keys table policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'api_keys' 
        AND policyname = 'Users can read own API keys'
    ) THEN
        CREATE POLICY "Users can read own API keys"
            ON api_keys
            FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'api_keys' 
        AND policyname = 'Users can create own API keys'
    ) THEN
        CREATE POLICY "Users can create own API keys"
            ON api_keys
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'api_keys' 
        AND policyname = 'Users can update own API keys'
    ) THEN
        CREATE POLICY "Users can update own API keys"
            ON api_keys
            FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'api_keys' 
        AND policyname = 'Users can delete own API keys'
    ) THEN
        CREATE POLICY "Users can delete own API keys"
            ON api_keys
            FOR DELETE
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- OpenAI Usage table policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'openai_usage' 
        AND policyname = 'Users can read own usage data'
    ) THEN
        CREATE POLICY "Users can read own usage data"
            ON openai_usage
            FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'openai_usage' 
        AND policyname = 'Users can create own usage data'
    ) THEN
        CREATE POLICY "Users can create own usage data"
            ON openai_usage
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;