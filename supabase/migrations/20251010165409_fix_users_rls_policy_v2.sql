-- Fix users RLS policy to prevent infinite recursion
-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can access their own data" ON users;
DROP POLICY IF EXISTS "Users can access tenant users" ON users;

-- Create a simple, non-recursive policy
CREATE POLICY "Users can access their own record" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can insert their own record" ON users
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own record" ON users
    FOR UPDATE USING (id = auth.uid());

