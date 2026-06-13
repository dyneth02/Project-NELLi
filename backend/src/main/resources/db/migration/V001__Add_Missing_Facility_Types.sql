-- Migration to fix CHECK constraint on facility type column
-- This removes the old constraint and adds a new one with all facility types

-- Drop the old CHECK constraint if it exists
ALTER TABLE facilities 
DROP CONSTRAINT IF EXISTS facilities_type_check CASCADE;

-- Add a new CHECK constraint with all facility types (or remove constraint entirely to rely on enum validation)
-- Option 1: Add comprehensive CHECK constraint
ALTER TABLE facilities
ADD CONSTRAINT facilities_type_check CHECK (
    type IN (
        'LECTURE_HALL',
        'LAB',
        'COMPUTER_LAB',
        'MEETING_ROOM',
        'EQUIPMENT',
        'AUDITORIUM',
        'SPORTS_FACILITY',
        'GYMNASIUM',
        'PLAY_GROUND'
    )
);
