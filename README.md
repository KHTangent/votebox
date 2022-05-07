# VoteBox - A Strawpoll-like website with ballots

## Setup

### Postgres

Before starting VoteBox, you need to set up a PostgreSQL database. Install PostgreSQL, for example on Debian/Ubuntu and derivatives:

```bash
sudo apt install postgresql
```

You'll probably want to create a new Postgres user and a new database for this application. One way to do this, is to use the following command to access the database as superuser:

```bash
sudo -u postgres psql
```

Once inside the `psql`, use the following commands to create a new user `vbuser` and a new database `vbdatabase` with password `123`:

```SQL
CREATE USER vbuser WITH PASSWORD '123';
CREATE DATABASE vbdatabase WITH OWNER vbuser;
```

Afterwards, you need to either install the `uuid-ossp` extension now, or grant superuser to the `vbuser` account. I'd recommend just adding the extension now:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Exit `psql` with `\q`. The database is now set up and ready

### Clone the project and install dependencies

If you haven't already, install Node.js. I recommend using [`nvm`](https://github.com/nvm-sh/nvm).

Clone this project somewhere with git:

```bash
git clone https://github.com/KHTangent/votebox
cd votebox
```

Install required project dependencies, and `db-migrate` (used to set up database schema):

```bash
npm i
npm i -g db-migrate db-migrate-pg
```

Now, create a new file called `.env` in the project root, with a database connection URL. For example, if Postgres is set up locally according to this README, the file should contain the following:

```bash
DB_URL="postgres://vbuser:123@localhost/vbdatabase"
```

Now that all dependencies have been installed, you have to run database migrations to set up the database schema. Execute the following command:

```bash
db-migrate up
```

### Run the project

Now that everything has been set up correctly, you can run a dev server by executing

```bash
npm run dev
```

To build a production version of VoteBox, use `npm run build` instead.

### Create a user

User registration is currently disabled for the beta, so you'll have to insert a user account into the database manually. A user requires a username, and a hashed password. You can generate a hash quickly using the following command (replace `MyPassword!` with whatever you want):

```bash
node -p '(require("argon2")).hash("MyPassword!").then(h => console.log("Hash: " + h))'
```

The hash value should look something like `$argon2i$v=19$m=4096,t=3,p=1$i6ylj9pvnWdj55Zs7tYP3Q$pOLYrJJdt+nxB4GE4Mrf7N8ZgS4lweC4eehVgT2wGFw`. To insert a new user into the database, sign into your database as your new user, and insert it using the following commands (substitute your values for `username` and `passwordhash`):

```
psql -U vbuser -d vbdatabase
INSERT INTO users(username, password) VALUES ('username', 'passwordhash');
```

VoteBox should now accept these credentials.

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```
