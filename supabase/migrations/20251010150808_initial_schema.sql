-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE exercise_type AS ENUM ('strength', 'cardio', 'flexibility', 'balance', 'sport');
CREATE TYPE progress_metric AS ENUM ('weight', 'reps', 'sets', 'duration', 'distance', 'custom');

-- Tenants table (for multi-tenancy)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    color_theme TEXT DEFAULT '#0070f3',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (coaches)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'coach',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    goals TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises library
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type exercise_type NOT NULL,
    muscle_groups TEXT[], -- Array of muscle groups
    equipment TEXT[],
    instructions TEXT,
    is_template BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts (templates)
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    is_template BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout exercises (many-to-many relationship)
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight_kg DECIMAL(5,2),
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES workouts(id),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    status session_status DEFAULT 'scheduled',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session exercises (for tracking during sessions)
CREATE TABLE session_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight_kg DECIMAL(5,2),
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress logs
CREATE TABLE progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id),
    metric progress_metric NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX idx_clients_active ON clients(tenant_id, is_active);
CREATE INDEX idx_exercises_tenant_id ON exercises(tenant_id);
CREATE INDEX idx_workouts_tenant_id ON workouts(tenant_id);
CREATE INDEX idx_sessions_tenant_id ON sessions(tenant_id);
CREATE INDEX idx_sessions_client_id ON sessions(client_id);
CREATE INDEX idx_sessions_scheduled_at ON sessions(scheduled_at);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX idx_progress_logs_client_id ON progress_logs(client_id);
CREATE INDEX idx_progress_logs_logged_at ON progress_logs(logged_at);

-- Row Level Security (RLS) Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
-- Note: These policies assume you'll use Supabase Auth and link users to tenants
-- You may need to adjust these based on your auth implementation

-- Tenants: Users can only access their own tenant
CREATE POLICY "Users can access their own tenant" ON tenants
    FOR ALL USING (
        id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Users: Users can only see users in their tenant
CREATE POLICY "Users can see tenant users" ON users
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Clients: Users can only access clients in their tenant
CREATE POLICY "Users can access tenant clients" ON clients
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Exercises: Users can only access exercises in their tenant
CREATE POLICY "Users can access tenant exercises" ON exercises
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Workouts: Users can only access workouts in their tenant
CREATE POLICY "Users can access tenant workouts" ON workouts
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Workout exercises: Users can only access workout exercises for their tenant's workouts
CREATE POLICY "Users can access tenant workout exercises" ON workout_exercises
    FOR ALL USING (
        workout_id IN (
            SELECT id FROM workouts 
            WHERE tenant_id IN (
                SELECT tenant_id FROM users 
                WHERE id = auth.uid()
            )
        )
    );

-- Sessions: Users can only access sessions in their tenant
CREATE POLICY "Users can access tenant sessions" ON sessions
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Session exercises: Users can only access session exercises for their tenant's sessions
CREATE POLICY "Users can access tenant session exercises" ON session_exercises
    FOR ALL USING (
        session_id IN (
            SELECT id FROM sessions 
            WHERE tenant_id IN (
                SELECT tenant_id FROM users 
                WHERE id = auth.uid()
            )
        )
    );

-- Progress logs: Users can only access progress logs in their tenant
CREATE POLICY "Users can access tenant progress logs" ON progress_logs
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM users 
            WHERE id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_exercises_updated_at BEFORE UPDATE ON session_exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
