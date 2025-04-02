-- Add updatedAt column to conversion table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'conversion' 
        AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE "conversion" 
        ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$; 