-- Add onboarding status to users table
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

-- Update existing users to have onboarding completed (for development)
UPDATE users SET onboarding_completed = true WHERE onboarding_completed IS NULL;
