# Alternative: Apply Migrations via Supabase SQL Editor

If you're having connectivity issues with Entity Framework migrations, you can apply the schema directly in Supabase:

## Steps:

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL below
5. Click **Run**

## SQL Schema:

```sql
-- Create Users table
CREATE TABLE "Users" (
    "Id" uuid PRIMARY KEY,
    "Username" varchar(50) NOT NULL UNIQUE,
    "Email" varchar(100) NOT NULL UNIQUE,
    "PasswordHash" text NOT NULL,
    "Role" integer NOT NULL,
    "CreatedAt" timestamp NOT NULL,
    "UpdatedAt" timestamp NULL
);

CREATE INDEX "IX_Users_Email" ON "Users" ("Email");
CREATE INDEX "IX_Users_Username" ON "Users" ("Username");

-- Create Garages table
CREATE TABLE "Garages" (
    "Id" uuid PRIMARY KEY,
    "Name" varchar(200) NOT NULL,
    "Address" varchar(500) NOT NULL,
    "Latitude" double precision NOT NULL,
    "Longitude" double precision NOT NULL,
    "Rating" numeric(3,2) NOT NULL,
    "CreatedAt" timestamp NOT NULL,
    "UpdatedAt" timestamp NULL
);

-- Create Services table
CREATE TABLE "Services" (
    "Id" uuid PRIMARY KEY,
    "GarageId" uuid NOT NULL,
    "Name" varchar(200) NOT NULL,
    "Description" varchar(1000) NULL,
    "Price" numeric(18,2) NOT NULL,
    "CreatedAt" timestamp NOT NULL,
    "UpdatedAt" timestamp NULL,
    CONSTRAINT "FK_Services_Garages_GarageId" FOREIGN KEY ("GarageId")
        REFERENCES "Garages" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Services_GarageId" ON "Services" ("GarageId");

-- Create AutoPartsShops table
CREATE TABLE "AutoPartsShops" (
    "Id" uuid PRIMARY KEY,
    "Name" varchar(200) NOT NULL,
    "Address" varchar(500) NOT NULL,
    "Latitude" double precision NOT NULL,
    "Longitude" double precision NOT NULL,
    "Rating" numeric(3,2) NOT NULL,
    "CreatedAt" timestamp NOT NULL,
    "UpdatedAt" timestamp NULL
);

-- Create EF Core migrations history table (optional, for EF compatibility)
CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" varchar(150) PRIMARY KEY,
    "ProductVersion" varchar(32) NOT NULL
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('InitialCreate', '9.0.10');
```

## After running the SQL:

Your database is ready! You can now run the API:

```bash
cd src/CarBuddy.API
dotnet run
```

Then test it at https://localhost:7001
