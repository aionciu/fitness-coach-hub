-- Fix users policy to allow user creation during onboarding
-- The current policy creates infinite recursion because it requires users to exist
-- but we need to create users during onboarding

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can see tenant users" ON users;

-- Create separate policies for different operations
-- INSERT: Allow authenticated users to create their own user record (for onboarding)
CREATE POLICY "Users can insert their own user record" ON users
    FOR INSERT WITH CHECK (
        id = auth.uid()
    );

-- SELECT: Users can only access their own user record
CREATE POLICY "Users can select their own user record" ON users
    FOR SELECT USING (
        id = auth.uid()
    );

-- UPDATE: Users can only update their own user record
CREATE POLICY "Users can update their own user record" ON users
    FOR UPDATE USING (
        id = auth.uid()
    );

-- DELETE: Users can only delete their own user record
CREATE POLICY "Users can delete their own user record" ON users
    FOR DELETE USING (
        id = auth.uid()
    );
