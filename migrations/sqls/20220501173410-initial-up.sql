CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
	username TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
);

CREATE TABLE access_tokens (
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	last_used TIMESTAMP NOT NULL DEFAULT NOW(),
	token TEXT NOT NULL UNIQUE
);

CREATE TABLE votings (
	id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
	owner UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	title TEXT NOT NULL
);

CREATE TABLE voting_options (
	voting_id UUID NOT NULL REFERENCES votings(id) ON DELETE CASCADE,
	name TEXT NOT NULL,
	votes INT NOT NULL DEFAULT 0,
	UNIQUE(voting_id, name)
);

CREATE TABLE voting_tokens (
	voting_id UUID NOT NULL REFERENCES votings(id) ON DELETE CASCADE,
	token UUID UNIQUE DEFAULT uuid_generate_v4()
);
