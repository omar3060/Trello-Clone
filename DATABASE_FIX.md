# Database Schema Fix for Trello Clone

## Problem Summary

You're experiencing errors because your Supabase database has `user_id` columns defined as `uuid` type, but you're storing Clerk user IDs which are strings (e.g., `"user_35UjHqZ8HOBZ8whNw1oXThM1pxo"`).

The error occurs when:

1. Moving tasks between columns
2. Creating tasks
3. Any operation that validates or returns the `user_id` field

## Solution

You need to change the `user_id` column type from `uuid` to `text` in your Supabase database for the following tables:

- `boards`
- `columns`
- `tasks`

## SQL Commands to Execute in Supabase

Run these commands in your Supabase SQL Editor:

```sql
-- 1. Change user_id column type in boards table
ALTER TABLE boards
ALTER COLUMN user_id TYPE text USING user_id::text;

-- 2. Change user_id column type in columns table
ALTER TABLE columns
ALTER COLUMN user_id TYPE text USING user_id::text;

-- 3. Change user_id column type in tasks table
ALTER TABLE tasks
ALTER COLUMN user_id TYPE text USING user_id::text;
```

## Important Notes

1. **Backup your data** before running these commands
2. These commands will convert any existing UUID values to text
3. After running these commands, all Clerk user IDs will work properly
4. Make sure to update any RLS (Row Level Security) policies if they reference the user_id column

## How to Execute

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the SQL commands above
5. Run the query
6. Test your application - the errors should be gone

## Additional Check

If you're still getting errors after this, check your RLS policies:

```sql
-- View all RLS policies for tasks table
SELECT * FROM pg_policies WHERE tablename = 'tasks';

-- View all RLS policies for boards table
SELECT * FROM pg_policies WHERE tablename = 'boards';

-- View all RLS policies for columns table
SELECT * FROM pg_policies WHERE tablename = 'columns';
```

You may need to update RLS policies to work with text instead of uuid for the user_id comparison.
