# Deploying CarBuddy API to Render

This guide will help you deploy your CarBuddy Web API from Azure to Render with PostgreSQL database.

## Prerequisites

- GitHub account (Render deploys from Git repositories)
- Render account (sign up at https://render.com)
- Your code pushed to a GitHub repository

## Step 1: Create PostgreSQL Database on Render

1. Log in to your Render Dashboard at https://dashboard.render.com
2. Click "New +" button and select "PostgreSQL"
3. Configure your database:
   - **Name**: `carbuddy-db` (or any name you prefer)
   - **Database**: `carbuddy` (this should match your connection string)
   - **User**: (auto-generated, you'll use this later)
   - **Region**: Choose the closest region to your users
   - **PostgreSQL Version**: 16 (or latest)
   - **Plan**: Free (or paid if you need more resources)
4. Click "Create Database"
5. Wait for the database to be provisioned (usually takes 1-2 minutes)
6. Once created, you'll see the database dashboard with connection details

### Save Your Database Connection Information

On the database info page, you'll find:
- **Internal Database URL**: Use this for applications running on Render
- **External Database URL**: Use this for external connections
- **PSQL Command**: For command-line access

The connection string format will be:
```
postgres://username:password@hostname:5432/carbuddy
```

For .NET, you need to convert this to:
```
Host=hostname;Database=carbuddy;Username=username;Password=password;Port=5432;SSL Mode=Require;Trust Server Certificate=true
```

## Step 2: Prepare Your Repository

1. Ensure all changes are committed:
   ```bash
   git add .
   git commit -m "Migrate from Azure SQL to PostgreSQL for Render deployment"
   git push origin main
   ```

2. Make sure your repository includes:
   - All project files
   - `src/CarBuddy.API/CarBuddy.API.csproj` (entry point)
   - Updated migrations for PostgreSQL

## Step 3: Create Web Service on Render

1. In Render Dashboard, click "New +" and select "Web Service"
2. Connect your GitHub account if you haven't already
3. Select your CarBuddy repository
4. Configure your web service:

   **Basic Settings:**
   - **Name**: `carbuddy-api` (or your preferred name)
   - **Region**: Same as your database for best performance
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: Leave empty if your code is at root, or set to `src/CarBuddy.API` if needed
   - **Runtime**: `Docker` OR `.NET`

   **Build Settings (if using .NET runtime):**
   - **Build Command**:
     ```bash
     dotnet restore && dotnet publish src/CarBuddy.API/CarBuddy.API.csproj -c Release -o out
     ```
   - **Start Command**:
     ```bash
     cd out && dotnet CarBuddy.API.dll
     ```

   **OR use Docker (recommended for .NET 9):**
   Create a `Dockerfile` in your project root (see Step 4 below)

5. **Environment Variables:**
   Click "Advanced" and add these environment variables:

   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:10000
   ConnectionStrings__DefaultConnection=Host=<your-db-host>;Database=carbuddy;Username=<user>;Password=<password>;Port=5432;SSL Mode=Require;Trust Server Certificate=true
   Jwt__SecretKey=YourSuperSecretKeyThatIsAtLeast32CharactersLongForHS256Algorithm
   Jwt__Issuer=CarBuddyAPI
   Jwt__Audience=CarBuddyUsers
   Jwt__ExpiryMinutes=60
   ```

   **Important:** Replace `<your-db-host>`, `<user>`, and `<password>` with values from your Render PostgreSQL database.

   **Note:** For connection string in environment variables, use double underscore `__` instead of colons for nested configuration (e.g., `ConnectionStrings__DefaultConnection`).

6. **Instance Type**: Select "Free" or a paid plan based on your needs

7. Click "Create Web Service"

## Step 4: Create Dockerfile (Recommended)

Create a file named `Dockerfile` in your project root:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj files and restore
COPY src/CarBuddy.Domain/*.csproj ./src/CarBuddy.Domain/
COPY src/CarBuddy.Application/*.csproj ./src/CarBuddy.Application/
COPY src/CarBuddy.Infrastructure/*.csproj ./src/CarBuddy.Infrastructure/
COPY src/CarBuddy.API/*.csproj ./src/CarBuddy.API/

RUN dotnet restore src/CarBuddy.API/CarBuddy.API.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish src/CarBuddy.API/CarBuddy.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Render uses port 10000 by default
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "CarBuddy.API.dll"]
```

If using Docker:
- **Runtime**: Select `Docker`
- **Dockerfile Path**: `Dockerfile`
- Leave build and start commands empty

## Step 5: Monitor Deployment

1. Render will automatically build and deploy your application
2. You can view logs in real-time from the Render dashboard
3. The deployment process typically takes 3-5 minutes
4. Once deployed, Render will provide you with a URL like: `https://carbuddy-api.onrender.com`

## Step 6: Verify Deployment

Test your API endpoints:

1. **Health Check**:
   ```
   https://your-app-name.onrender.com/health
   ```

2. **Root Endpoint**:
   ```
   https://your-app-name.onrender.com/
   ```

3. **Swagger UI** (if enabled in production):
   ```
   https://your-app-name.onrender.com/swagger
   ```

4. **Test Registration**:
   ```bash
   curl -X POST https://your-app-name.onrender.com/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!","username":"testuser"}'
   ```

## Important Notes

### Free Tier Limitations

- **Spin Down**: Free tier services spin down after 15 minutes of inactivity
- **Spin Up**: First request after spin down takes 30-60 seconds (cold start)
- **Database**: Free PostgreSQL has 1GB storage, expires after 90 days
- **Bandwidth**: 100GB/month on free tier

### Database Migrations

The application runs migrations automatically on startup (see Program.cs:119). On first deployment, this will create all tables in your PostgreSQL database.

### Environment Variables vs appsettings.json

Environment variables in Render override values in `appsettings.json`. Always set sensitive values (connection strings, JWT secrets) as environment variables in Render dashboard, not in code.

### Custom Domain (Optional)

To use your own domain:
1. Go to your web service settings
2. Click "Custom Domain"
3. Follow instructions to add CNAME record
4. Free tier supports custom domains!

### HTTPS

Render automatically provides free SSL certificates for all services. Your API will be accessible via HTTPS.

### Updating Your Application

To deploy updates:
1. Push changes to your GitHub repository
2. Render automatically detects changes and redeploys
3. You can also trigger manual deploys from the dashboard

### Troubleshooting

**Build Failures:**
- Check build logs in Render dashboard
- Verify all NuGet packages are restored
- Ensure .NET 9.0 SDK is available

**Database Connection Issues:**
- Verify connection string format is correct
- Ensure SSL Mode is set to `Require`
- Check that Trust Server Certificate is set to `true`
- Confirm database hostname, username, and password are correct

**Migration Errors:**
- Check that migrations were created for PostgreSQL (not SQL Server)
- Verify EF Core tools are installed
- Review database logs in Render dashboard

## Comparing Azure vs Render

| Feature | Azure (Previous) | Render (New) |
|---------|-----------------|--------------|
| Database | Azure SQL Server | PostgreSQL |
| App Service | Azure App Service | Render Web Service |
| Free Tier | Limited (paid after trial) | Persistent free tier |
| SSL | Included | Included |
| Auto Deploy | Via Azure DevOps/GitHub Actions | Built-in GitHub integration |
| Cold Starts | Minimal (on paid tier) | 30-60s (free tier) |

## Next Steps

1. Test all API endpoints thoroughly
2. Update your frontend application to use new Render API URL
3. Monitor application logs for any errors
4. Consider upgrading to paid tier if you need:
   - No cold starts (always-on service)
   - More database storage
   - Better performance

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- CarBuddy API Swagger: `https://your-app-name.onrender.com/swagger`
