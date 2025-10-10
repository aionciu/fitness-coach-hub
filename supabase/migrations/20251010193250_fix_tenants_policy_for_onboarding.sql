-- Fix tenants policy to allow tenant creation during onboarding
-- The current policy creates infinite recursion because it requires users to exist
-- but we need to create tenants before users during onboarding

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can access their own tenant" ON tenants;

-- Create separate policies for different operations
-- INSERT: Allow authenticated users to create tenants (for onboarding)
CREATE POLICY "Authenticated users can create tenants" ON tenants
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
    );

-- SELECT: Users can only access their own tenant
CREATE POLICY "Users can select their own tenant" ON tenants
    FOR SELECT USING (
        id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- UPDATE: Users can only update their own tenant
CREATE POLICY "Users can update their own tenant" ON tenants
    FOR UPDATE USING (
        id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- DELETE: Users can only delete their own tenant
CREATE POLICY "Users can delete their own tenant" ON tenants
    FOR DELETE USING (
        id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );
