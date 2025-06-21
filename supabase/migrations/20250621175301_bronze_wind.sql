/*
  # Create Tools Tables

  1. New Tables
    - `tools`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `description` (text)
      - `type` (text)
      - `category` (text)
      - `status` (text)
      - `config` (jsonb)
      - `is_built_in` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tool_executions`
      - `id` (uuid, primary key)
      - `tool_id` (uuid, foreign key to tools)
      - `user_id` (uuid, foreign key to users)
      - `status` (text)
      - `input_data` (jsonb)
      - `output_data` (jsonb)
      - `error_message` (text)
      - `execution_time_ms` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for user data isolation
    - Allow users to access built-in tools
    - Restrict custom tools to their creators

  3. Indexes
    - Add performance indexes for common queries
*/

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'custom',
    category VARCHAR(50) NOT NULL DEFAULT 'utility',
    status VARCHAR(50) NOT NULL DEFAULT 'inactive',
    config JSONB NOT NULL DEFAULT '{"parameters": []}',
    is_built_in BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tool executions table
CREATE TABLE IF NOT EXISTS tool_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON tools(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_type ON tools(type);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_is_built_in ON tools(is_built_in);
CREATE INDEX IF NOT EXISTS idx_tool_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_executions_user_id ON tool_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_executions_status ON tool_executions(status);

-- Update trigger for tools
CREATE TRIGGER update_tools_updated_at 
    BEFORE UPDATE ON tools 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_executions ENABLE ROW LEVEL SECURITY;

-- Tools table policies
CREATE POLICY "Users can read own tools and built-in tools"
    ON tools
    FOR SELECT
    TO authenticated
    USING (is_built_in = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own tools"
    ON tools
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id AND is_built_in = false);

CREATE POLICY "Users can update own tools"
    ON tools
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND is_built_in = false)
    WITH CHECK (auth.uid() = user_id AND is_built_in = false);

CREATE POLICY "Users can delete own tools"
    ON tools
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id AND is_built_in = false);

-- Tool executions table policies
CREATE POLICY "Users can read own tool executions"
    ON tool_executions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tool executions"
    ON tool_executions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tool executions"
    ON tool_executions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Insert built-in tools
INSERT INTO tools (id, name, description, type, category, status, config, is_built_in, user_id) VALUES
(
    'web-search',
    'Web Search',
    'Search the web for up-to-date information',
    'ai',
    'data',
    'active',
    '{"parameters": [{"id": "query", "name": "query", "type": "string", "required": true, "description": "The search query"}]}',
    true,
    NULL
),
(
    'email-sender',
    'Email Sender',
    'Send emails via SMTP or email service',
    'email',
    'communication',
    'active',
    '{"parameters": [{"id": "to", "name": "to", "type": "string", "required": true, "description": "Recipient email address"}, {"id": "subject", "name": "subject", "type": "string", "required": true, "description": "Email subject"}, {"id": "body", "name": "body", "type": "string", "required": true, "description": "Email body content"}]}',
    true,
    NULL
),
(
    'http-request',
    'HTTP Request',
    'Make HTTP requests to any API endpoint',
    'api',
    'integration',
    'active',
    '{"method": "GET", "parameters": [{"id": "url", "name": "url", "type": "string", "required": true, "description": "The URL to make the request to"}, {"id": "headers", "name": "headers", "type": "object", "required": false, "description": "Request headers"}, {"id": "body", "name": "body", "type": "object", "required": false, "description": "Request body for POST/PUT requests"}]}',
    true,
    NULL
)
ON CONFLICT (id) DO NOTHING;