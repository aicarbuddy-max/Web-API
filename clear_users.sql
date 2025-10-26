-- Clear all user-related data to allow fresh registration with new schema
-- Run this script if you're getting login errors after schema changes

-- Delete all community post likes (depends on users)
DELETE FROM PostLikes;

-- Delete all community post comments (depends on users)
DELETE FROM PostComments;

-- Delete all community posts (depends on users)
DELETE FROM CommunityPosts;

-- Delete all users
DELETE FROM Users;

PRINT 'All user data cleared successfully. You can now register with the new schema.';
