# Azure App Service Deployment Guide

## Azure Resources Created
- **App Name:** carbuddy-web-api
- **Runtime:** .NET 9.0
- **Publishing Model:** Code

## Deployment Options

### Option 1: GitHub Actions (Recommended)

This is automated CI/CD - every push to `main` branch will automatically deploy to Azure.

#### Setup Steps:

1. **Get Azure Publish Profile**
   - Go to Azure Portal: https://portal.azure.com
   - Navigate to your App Service: `carbuddy-web-api`
   - Click **"Get publish profile"** button (top menu)
   - Download the `.PublishSettings` file
   - Open it in a text editor and copy ALL the XML content

2. **Add Publish Profile to GitHub Secrets**
   - Go to your GitHub repository: https://github.com/aicarbuddy-max/Web-API
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste the entire XML content from the publish profile
   - Click **"Add secret"**

3. **Configure Azure App Service Settings**
   - In Azure Portal, go to your App Service
   - Click **Configuration** → **Application settings**
   - Add the following settings:

   ```
   ConnectionStrings__DefaultConnection = Host=aws-1-ap-south-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.hdblpmjkpspvyodsbrug;Password=password@carbuddy123;SSL Mode=Require;Trust Server Certificate=true

   Jwt__SecretKey = DevSecretKeyThatIsAtLeast32CharactersLongForHS256Algorithm
   Jwt__Issuer = CarBuddyAPI
   Jwt__Audience = CarBuddyAPIUsers
   Jwt__ExpiryMinutes = 60
   ```

   - Click **Save**

4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Azure deployment workflow"
   git push
   ```

5. **Monitor Deployment**
   - Go to GitHub repository → **Actions** tab
   - Watch the deployment workflow run
   - Once completed, your API will be live at: `https://carbuddy-web-api.azurewebsites.net`

---

### Option 2: Deploy Directly via Azure CLI (Quick Deploy)

Use this for immediate one-time deployment.

```bash
# 1. Login to Azure
az login

# 2. Build and publish the project
dotnet publish src/CarBuddy.API/CarBuddy.API.csproj -c Release -o ./publish

# 3. Create a zip file
cd publish
tar -czf ../deploy.zip *
cd ..

# 4. Deploy to Azure
az webapp deployment source config-zip \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
  --name carbuddy-web-api \
  --src deploy.zip

# 5. Configure app settings
az webapp config appsettings set \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
  --name carbuddy-web-api \
  --settings \
    "ConnectionStrings__DefaultConnection=Host=aws-1-ap-south-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.hdblpmjkpspvyodsbrug;Password=password@carbuddy123;SSL Mode=Require;Trust Server Certificate=true" \
    "Jwt__SecretKey=DevSecretKeyThatIsAtLeast32CharactersLongForHS256Algorithm" \
    "Jwt__Issuer=CarBuddyAPI" \
    "Jwt__Audience=CarBuddyAPIUsers" \
    "Jwt__ExpiryMinutes=60"
```

**Note:** Replace `<YOUR_RESOURCE_GROUP_NAME>` with your actual Azure resource group name.

---

### Option 3: Deploy via Visual Studio Code

1. Install Azure App Service extension in VS Code
2. Right-click on `src/CarBuddy.API` folder
3. Select **"Deploy to Web App..."**
4. Select your Azure subscription
5. Select `carbuddy-web-api`
6. Confirm deployment

---

## After Deployment

### Test Your API

1. **Health Check**
   ```bash
   curl https://carbuddy-web-api.azurewebsites.net/health
   ```

2. **Swagger Documentation**
   - Open browser: `https://carbuddy-web-api.azurewebsites.net/swagger`

3. **Test Register Endpoint**
   ```bash
   curl -X POST https://carbuddy-web-api.azurewebsites.net/api/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "Test@1234",
       "role": "User"
     }'
   ```

4. **Test Login Endpoint**
   ```bash
   curl -X POST https://carbuddy-web-api.azurewebsites.net/api/users/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "password": "Test@1234"
     }'
   ```

---

## Important Security Notes

### For Production:

1. **Update JWT Secret**
   - Generate a new secure secret key (32+ characters)
   - Update in Azure App Settings

2. **Database Connection**
   - Currently using Supabase Session Pooler (correct for IPv4)
   - Connection string is already configured

3. **HTTPS Only**
   - Azure App Service enforces HTTPS by default
   - API is secured with SSL/TLS

4. **CORS Configuration**
   - Update `Program.cs` to allow only your frontend domain
   - Current config allows all origins (only for development)

---

## Troubleshooting

### Deployment Failed
- Check GitHub Actions logs
- Verify publish profile is correct
- Ensure .NET 9.0 is selected in Azure App Service

### API Returns 500 Error
- Check Azure App Service → **Log stream** for errors
- Verify database connection string
- Check if database is accessible from Azure

### Database Connection Issues
- Ensure Supabase allows connections from Azure IPs
- Verify connection string in Application Settings
- Check if using Session Pooler (required for IPv4)

### Environment Variables Not Working
- Use double underscore `__` for nested settings (e.g., `ConnectionStrings__DefaultConnection`)
- Azure converts `__` to `:` automatically
- Click **Save** after adding settings

---

## Monitoring

### View Logs
```bash
az webapp log tail \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
  --name carbuddy-web-api
```

### Check Metrics
- Go to Azure Portal → App Service → **Monitoring** → **Metrics**
- View requests, response times, errors

---

## Next Steps

1. Set up Application Insights for monitoring
2. Configure custom domain
3. Set up staging slots for testing
4. Enable auto-scaling based on traffic
5. Configure backup and disaster recovery

---

## API Endpoints

Once deployed, your API will be available at:
- **Base URL:** `https://carbuddy-web-api.azurewebsites.net`
- **Swagger:** `https://carbuddy-web-api.azurewebsites.net/swagger`
- **Health:** `https://carbuddy-web-api.azurewebsites.net/health`

### Available Endpoints:
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/garages` - Get all garages
- `POST /api/garages/search` - Search nearby garages
- `GET /api/garages/top-rated` - Get top-rated garages
- `GET /api/garages/{id}/statistics` - Get garage statistics
- `GET /api/services` - Get all services
- `GET /api/autopartsshops` - Get all auto parts shops

All endpoints (except register/login) require JWT authentication.
