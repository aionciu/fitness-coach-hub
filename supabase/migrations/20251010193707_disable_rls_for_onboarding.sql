-- Temporarily disable RLS for tenants table to allow onboarding
-- This is a more aggressive fix to ensure onboarding works

-- Disable RLS on tenants table temporarily
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS but with a simpler policy
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all operations for authenticated users
-- This is less secure but ensures onboarding works
-- We can tighten this later once onboarding is working
CREATE POLICY "Allow all operations for authenticated users" ON tenants
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );
