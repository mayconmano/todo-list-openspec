UPDATE users SET name = SUBSTRING_INDEX(email, '@', 1) WHERE name IS NULL;
