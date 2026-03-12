# HomeGround - Local Development Setup Guide

This guide will help you run the HomeGround multi-sport turf booking platform on your local machine.

## Prerequisites

Before you start, ensure you have the following installed on your system:

### Required Software
1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **pnpm** (Package Manager)
   - Install globally: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **MySQL Database** (Local or Cloud)
   - Option A: Install MySQL locally from https://dev.mysql.com/downloads/mysql/
   - Option B: Use a cloud database service (TiDB, PlanetScale, etc.)
   - You'll need the connection string: `mysql://username:password@host:port/database_name`

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd homeground
```

### 2. Install Dependencies
```bash
pnpm install
```
This will install all required packages listed in `package.json`.

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database Connection (Required)
DATABASE_URL=mysql://username:password@localhost:3306/homeground

# OAuth & Authentication (Required for login features)
VITE_APP_ID=your_app_id
JWT_SECRET=your_jwt_secret_key
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner Information
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id

# Manus Built-in APIs (For advanced features)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# App Branding (Optional)
VITE_APP_TITLE=HomeGround
VITE_APP_LOGO=https://your-logo-url.png

# Payment Integration (Optional - Leave blank if not configured)
VITE_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# WhatsApp Integration (Optional - Leave blank if not configured)
VITE_WHATSAPP_NUMBER=your_whatsapp_number
```

**Note:** 
- For local development, you can use placeholder values for OAuth and Manus APIs
- Database URL is the most critical - ensure your MySQL instance is running
- Payment and WhatsApp integrations can be left blank initially

### 4. Set Up the Database

#### Option A: Local MySQL
```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE homeground;"

# Update DATABASE_URL in .env.local with your credentials
DATABASE_URL=mysql://root:your_password@localhost:3306/homeground
```

#### Option B: Cloud Database (TiDB, PlanetScale, etc.)
- Create a database instance on your chosen provider
- Get the connection string
- Add it to `.env.local`

### 5. Run Database Migrations
```bash
pnpm db:push
```
This will:
- Generate migration files from the schema in `drizzle/schema.ts`
- Apply migrations to your database

### 6. Start the Development Server
```bash
pnpm dev
```

This will start:
- **Frontend (Vite):** http://localhost:5173
- **Backend (Express):** http://localhost:3000

The terminal will show output like:
```
> homeground@1.0.0 dev
> NODE_ENV=development tsx watch server/_core/index.ts

[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

### 7. Access the Application
- Open your browser and go to: **http://localhost:5173**
- You should see the HomeGround landing page with all features

## Project Structure

```
homeground/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Page components (Home, Booking, Academy, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities, data, tRPC client
│   │   ├── App.tsx        # Main app with routing
│   │   └── index.css      # Global styles (Tailwind)
│   └── index.html         # HTML entry point
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures (API endpoints)
│   ├── db.ts              # Database query helpers
│   ├── auth.logout.test.ts # Test examples
│   └── _core/             # Framework internals (don't modify)
├── drizzle/               # Database schema & migrations
│   └── schema.ts          # Table definitions
├── shared/                # Shared types & constants
├── storage/               # S3 file storage helpers
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite build config
└── drizzle.config.ts      # Database migration config
```

## Available Scripts

```bash
# Start development server (frontend + backend)
pnpm dev

# Build for production
pnpm build

# Start production server (after build)
pnpm start

# Run tests
pnpm test

# Type check
pnpm check

# Format code
pnpm format

# Generate & apply database migrations
pnpm db:push
```

## Key Features & How They Work

### 1. Real-Time Slot Booking
- Located in `client/src/pages/BookingPage.tsx`
- Fetches available slots from database
- Supports 4 sports: Cricket, Football, Badminton, Box Cricket
- Weekday/weekend pricing logic

### 2. User Authentication
- Uses Manus OAuth (can be configured locally)
- Session management via JWT cookies
- User profiles and booking history tracking

### 3. Academy Showcase
- Paul Valthaty Cricket Academy
- Home Shuttlers Badminton Academy
- Coach profiles and fee structures

### 4. Admin Dashboard
- Manage bookings and court availability
- View revenue statistics
- Pricing management

### 5. Payment Integration
- Razorpay placeholder (add your keys to activate)
- WhatsApp Business integration (add your number to activate)

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Run `pnpm install` again
```bash
pnpm install
```

### Issue: Database connection fails
**Solution:** Check your DATABASE_URL
```bash
# Verify MySQL is running
mysql -u root -p -e "SELECT 1;"

# Check .env.local has correct credentials
cat .env.local | grep DATABASE_URL
```

### Issue: Port 3000 or 5173 already in use
**Solution:** Kill the process using the port or change the port
```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: OAuth login not working locally
**Solution:** This is expected in local development. The OAuth flow requires:
- Valid VITE_APP_ID
- Registered redirect URI with Manus
- For testing, you can skip login and test other features

### Issue: Hot reload not working
**Solution:** Restart the dev server
```bash
# Press Ctrl+C to stop
# Then run again
pnpm dev
```

## Development Workflow

### Adding a New Feature

1. **Update Database Schema** (if needed)
   ```bash
   # Edit drizzle/schema.ts
   # Then run:
   pnpm db:push
   ```

2. **Create Backend Procedure** (in `server/routers.ts`)
   ```typescript
   export const appRouter = router({
     myFeature: publicProcedure
       .input(z.object({ /* input schema */ }))
       .query(async ({ input }) => {
         // Your logic here
       }),
   });
   ```

3. **Create Frontend Component** (in `client/src/pages/`)
   ```tsx
   import { trpc } from "@/lib/trpc";
   
   export default function MyFeature() {
     const { data, isLoading } = trpc.myFeature.useQuery();
     return <div>{/* Your UI */}</div>;
   }
   ```

4. **Add Route** (in `client/src/App.tsx`)
   ```tsx
   <Route path="/my-feature" component={MyFeature} />
   ```

5. **Test**
   ```bash
   pnpm test
   ```

## Testing

Run the test suite:
```bash
pnpm test
```

Currently passing: **27 tests**

Tests are located in:
- `server/routers.test.ts` - API endpoint tests
- `server/auth.logout.test.ts` - Authentication tests

## Performance Tips

1. **Use pnpm** instead of npm for faster installs
2. **Enable TypeScript checking** in your IDE
3. **Use the Vite dev server** for fast HMR (Hot Module Replacement)
4. **Optimize images** before uploading to CDN
5. **Use database indexes** for frequently queried fields

## Deployment

When ready to deploy:

1. Build the project:
   ```bash
   pnpm build
   ```

2. Set production environment variables on your hosting platform

3. Start the production server:
   ```bash
   pnpm start
   ```

## Support & Resources

- **Manus Documentation:** https://manus.im/docs
- **React Documentation:** https://react.dev
- **tRPC Documentation:** https://trpc.io
- **Tailwind CSS:** https://tailwindcss.com
- **Drizzle ORM:** https://orm.drizzle.team

## Next Steps

1. ✅ Set up local environment
2. ✅ Start the dev server
3. ✅ Explore the codebase
4. 📝 Add your Razorpay keys for payment testing
5. 📝 Add your WhatsApp number for chat integration
6. 🚀 Deploy to production

---

**Happy coding! 🎉**

For questions or issues, refer to the project's GitHub repository or contact the development team.
