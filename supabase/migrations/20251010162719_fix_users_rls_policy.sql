-- Fix infinite recursion in users RLS policy
DROP POLICY IF EXISTS "Users can access tenant users" ON users;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Users can access their own data" ON users
    FOR ALL USING (id = auth.uid());
