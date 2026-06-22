# Healthcare Management Web Application

A modern web application for managing healthcare appointments and user profiles built with Next.js, React, TypeScript, and Supabase.

## Project Overview

This application provides a comprehensive platform for managing healthcare appointments and user interactions. It supports two types of users:
- **Patients**: Can schedule appointments with doctors and view their appointment history
- **Doctors**: Can manage their appointments and view patient information

The application features a modern, responsive UI built with Radix UI components and Tailwind CSS.

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 with React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: shadcn/ui (Radix UI based)
- **Form Handling**: React Hook Form
- **Theming**: next-themes
- **Icons**: lucide-react
- **Date Handling**: date-fns

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Runtime**: Node.js (via Next.js)

### Package Manager
- pnpm (or npm as fallback)

## Database Schema

The application uses the following main tables:

### `profiles`
Stores user profile information for both patients and doctors.

**Columns:**
- `id` (UUID): Primary key, references auth.users
- `user_type` (text): Either 'patient' or 'doctor'
- `first_name` (text): User's first name
- `last_name` (text): User's last name
- `email` (text): User's email address
- `phone` (text): User's phone number (optional)
- `specialization` (text): Doctor's specialization (optional)
- `bio` (text): User biography (optional)
- `created_at` (timestamp): Account creation timestamp
- `updated_at` (timestamp): Last profile update timestamp

**Security**: Row Level Security (RLS) enabled - users can only view and update their own profile

### `appointments`
Stores appointment information between patients and doctors.

**Columns:**
- `id` (UUID): Primary key
- `patient_id` (UUID): References profiles.id (patient)
- `doctor_id` (UUID): References profiles.id (doctor)
- `title` (text): Appointment title
- `description` (text): Detailed description (optional)
- `scheduled_at` (timestamp): Appointment date and time
- `duration_minutes` (integer): Appointment duration in minutes (default: 30)
- `status` (text): Appointment status ('scheduled', 'completed', or 'cancelled')
- `notes` (text): Additional notes (optional)
- `created_at` (timestamp): Creation timestamp
- `updated_at` (timestamp): Last update timestamp

**Indexes:**
- `appointments_patient_id_idx`: For quick patient lookup
- `appointments_doctor_id_idx`: For quick doctor lookup
- `appointments_scheduled_at_idx`: For date-based queries

**Security**: Row Level Security (RLS) enabled

## Project Structure

```
HCFHackathon/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main page component
│   ├── layout.tsx                # Root layout with theme provider
│   └── globals.css               # Global styles
├── components/
│   ├── theme-provider.tsx        # Theme provider setup
│   └── ui/                       # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── calendar.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── [40+ more UI components]
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   └── utils.ts                  # Utility functions
├── scripts/                      # Database migration scripts
│   ├── 001_create_users_table.sql
│   ├── 002_create_appointments_table.sql
│   ├── 003_create_transcriptions_table.sql
│   ├── 004_create_entities_table.sql
│   └── 005_profile_trigger.sql
├── styles/
│   └── globals.css               # Global CSS
├── package.json                  # Project dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
└── components.json               # shadcn/ui configuration

```

## Prerequisites

Before you can run this application, you need:

1. **Node.js**: Version 18 or higher
2. **npm or pnpm**: Package manager for installing dependencies
3. **Supabase Account**: Required for database and authentication
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Get your Project URL and Anon Key
4. **Environment Variables**: Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Installation & Setup

### 1. Install Dependencies

Using npm:
```bash
npm install
```

Or using pnpm:
```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Open the SQL editor
3. Run the migration scripts in order:
   - `001_create_users_table.sql`
   - `002_create_appointments_table.sql`
   - `003_create_transcriptions_table.sql`
   - `004_create_entities_table.sql`
   - `005_profile_trigger.sql`

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

Or with pnpm:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Start Production Server

Run the built application:

```bash
npm start
```

### Lint Code

Check code for linting errors:

```bash
npm run lint
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbo |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Key Features

### User Management
- User registration and authentication via Supabase Auth
- Profile creation for both patients and doctors
- User type differentiation (patient/doctor)
- Secure profile data with Row Level Security

### Appointments
- Schedule appointments between patients and doctors
- Set appointment duration
- Track appointment status (scheduled/completed/cancelled)
- Add notes and descriptions to appointments
- Efficient querying with database indexes

### UI/UX
- Modern, responsive design
- Dark mode support with next-themes
- Comprehensive component library with 40+ UI components
- Mobile-responsive layout detection
- Toast notifications for user feedback
- Form validation with React Hook Form

## Component Library

This project includes a comprehensive set of pre-built UI components from shadcn/ui:

**Layout Components:**
- Card, Dialog, Drawer, Sidebar, Tabs, Pagination

**Input Components:**
- Input, Textarea, Select, Checkbox, Radio Group, Toggle, Switch, Slider

**Display Components:**
- Avatar, Badge, Alert, Progress, Skeleton, Table

**Navigation Components:**
- Breadcrumb, Navigation Menu, Menubar, Dropdown Menu, Context Menu

**And many more:** Accordion, Alert Dialog, Calendar, Carousel, Command, Hover Card, Popover, Scroll Area, Tooltip, etc.

## Environment Configuration

### Tailwind CSS
Configured for responsive design and dark mode support with custom theme settings.

### TypeScript
Strict TypeScript mode is enabled with build errors ignored for faster development iteration.

### PostCSS
Configured with Autoprefixer for cross-browser compatibility.

## Deployment

### Vercel (Recommended)

The application is optimized for Vercel deployment:

1. Push your repository to GitHub
2. Connect to Vercel at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

This is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Docker containers
- Self-hosted Node.js servers

## Development Guidelines

### Adding New Components

To add a new shadcn/ui component:

```bash
npx shadcn-ui@latest add [component-name]
```

### Project Structure

- Keep page components in `app/` directory
- Store reusable components in `components/`
- Put utility functions in `lib/`
- Custom hooks go in `hooks/`
- Database queries can be created as API routes

### Database Queries

Create API routes in `app/api/` to handle database operations with Supabase:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## Troubleshooting

### SWC Binary Error on Windows
If you encounter: `Failed to load SWC binary for win32/x64`

**Solutions:**
1. **Use Docker**: Build and run using Docker instead
   ```bash
   docker build -t hcf-app .
   docker run -p 3000:3000 hcf-app
   ```

2. **Use WSL2 (Windows Subsystem for Linux)**:
   ```bash
   wsl
   cd /mnt/c/Users/anish/HCFHackathon
   npm install --legacy-peer-deps
   npm run dev
   ```

3. **Use a Linux/Mac system**: The application is fully compatible with Linux and macOS systems

4. **Try older Node.js version**: Sometimes using Node.js 18.x instead of 20.x resolves SWC issues

5. **Rebuild native modules**:
   ```bash
   npm install --build-from-source
   npm run dev
   ```

### Dependencies Not Installing
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules` (or `Remove-Item -Force -Recurse node_modules` on PowerShell)
- Reinstall: `npm install --legacy-peer-deps`

### Build Errors
- Check that all environment variables are set in `.env.local`
- Ensure Supabase project is properly configured
- Clear Next.js cache: `rm -rf .next` (or `Remove-Item -Force -Recurse .next` on PowerShell)

### Database Connection Issues
- Verify Supabase URL and API key
- Check network connectivity
- Ensure RLS policies allow necessary operations
- Review Supabase logs for errors

### Port 3000 Already in Use
Find and kill the process using port 3000:

**Windows (PowerShell):**
```bash
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

## Contributing

1. Create a new branch for features: `git checkout -b feature/feature-name`
2. Make your changes
3. Run linting: `npm run lint`
4. Commit your changes: `git commit -m "Add feature"`
5. Push to GitHub: `git push origin feature/feature-name`

## License

This project is private and created for the HCF Hackathon.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Supabase documentation](https://supabase.com/docs)
3. Check project issues on GitHub
4. Contact the development team

---

**Created for HCF Hackathon**
