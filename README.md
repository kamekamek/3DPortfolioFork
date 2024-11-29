# 3D Portfolio Showcase

A 3D space portfolio showcase website built with React, Three.js, and TypeScript. Display your projects in an interactive 3D environment with authentication and real-time updates.

## Features

- 🎨 Interactive 3D space for project showcasing
- 🔐 User authentication with Supabase
- 📱 Responsive design with Tailwind CSS
- 🎯 TypeScript for type safety
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔄 Real-time updates
- ⭐ Project rating and review system

## Tech Stack

- **Frontend:**
  - React
  - Three.js / React Three Fiber
  - Tailwind CSS
  - TypeScript
  - Vite

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - Drizzle ORM
  - Supabase Auth

## Prerequisites

Before you begin, ensure you have:
- Node.js (version 18+ or 20+ recommended)
- PostgreSQL database (automatically configured in Replit)
- Supabase account for authentication
- Git (optional for local development)
- npm or yarn package manager

Note: When using Replit, all prerequisites are automatically handled for you.

## Development Environment

### Using Replit (Recommended)

1. Fork the project on Replit
2. The development environment will be automatically set up with:
   - PostgreSQL database configuration
   - Node.js and required dependencies
   - Development server configuration
3. Add required environment variables in Replit's Secrets tab:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Click the "Run" button to start the development server
5. Your application will be immediately available with hot-reload enabled

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-3d
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```env
# Database Configuration
DATABASE_URL=<your-database-url>
PGHOST=<database-host>
PGPORT=<database-port>
PGUSER=<database-user>
PGPASSWORD=<database-password>
PGDATABASE=<database-name>

# Supabase Configuration (Required for Authentication)
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Server Configuration (Optional)
NODE_ENV=development # or production
PORT=3000 # API server port
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- API Server: http://localhost:3000

## Available Scripts

- `npm run dev` - Start the development environment (both client and server)
- `npm run dev:server` - Start only the API server with auto-reload
- `npm run dev:client` - Start only the client development server
- `npm run build` - Build the application for production (both client and server)
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes to PostgreSQL

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── scenes/     # Three.js scene components
│   │   └── types/      # TypeScript type definitions
├── server/              # Backend Express application
│   ├── routes/         # API routes
│   ├── auth/           # Authentication logic
│   └── index.ts        # Server entry point
├── db/                  # Database configuration
│   ├── schema.ts       # Drizzle schema definitions
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## Database Schema

The application uses the following main tables:
- `users` - User profiles and authentication
- `projects` - Portfolio projects with 3D positioning
- `reviews` - Project reviews and ratings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Reviews
- `GET /api/projects/:id/reviews` - Get project reviews
- `POST /api/projects/:id/reviews` - Add a review

## Common Issues & Debugging

### Database Connection
- Ensure PostgreSQL is running locally
- Check DATABASE_URL format
- Verify database user permissions

### 3D Scene Performance
- Enable hardware acceleration in browser
- Check WebGL compatibility
- Reduce polygon count for better performance

### Authentication Issues
- Verify Supabase credentials
- Check browser console for CORS errors
- Ensure environment variables are set correctly

## License

MIT License - see LICENSE file for details

## Deployment

The recommended deployment platform for this project is Replit:

1. Fork the project on Replit
2. Set up the required environment variables in Replit Secrets
3. Use the "Run" button to deploy
4. Replit will automatically:
   - Set up the database
   - Install dependencies
   - Build and serve the application
   - Provide a public URL for your portfolio

For the best performance, consider upgrading to a paid Replit plan for additional resources and always-on deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description of changes

## Support

For support, please open an issue on the repository or contact the maintainers.
