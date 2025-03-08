CREATE TABLE employees (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE,
    bio TEXT,
    skills TEXT,
    location TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);