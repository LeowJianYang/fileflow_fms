# FileFlow - File Management System

<div align="center">

![FileFlow Logo](https://img.shields.io/badge/FileFlow-1.1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)

**A simple, full-stack file management system built with React, Vite, and Tailwind CSS**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack) • [License](#license)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [License](#license)
- [Author](#author)
- [Development Process](#development-process)
---

> <span style="color:red;font-weight:bold;">ATTENTION</span><br/>
> Due to the current issues, our services cannot maintain persistent storage. This project is considered for academic and demonstration purposes only.<br/>
> **Please take note**: all data or files may be deleted or unavailable when the server or service is inactive.

## About

**FileFlow** is a modern file management system that allows users to upload, organize, and manage their files with an intuitive interface. Built with cutting-edge web technologies, it provides a seamless experience for file operations with support for multiple file viewers, folder management, and user authentication.

> **Storage Limitation:** Each user gets **100 MB of free storage** on a first-come, first-served basis due to database and server storage limitations.

---

## Features

### Authentication
- User registration and login
- Secure session management with cookies
- Protected routes and authorization

### File Management
- **Upload multiple files** simultaneously
- **Create and manage folders** with nested directory support
- **Download files** with a single click
- **Delete files and folders** with confirmation
- **Rename files and folders**
- **File search** functionality
- **Breadcrumb navigation** for easy folder traversal

### Multiple File Viewers
- **Text Editor** - Edit `.txt`, `.js`, `.html`, `.css`, `.json`, `.md`, etc.
- **Markdown Viewer** - Render markdown files beautifully
- **PDF Viewer** - View PDF documents in-browser
- **Image Viewer** - Support for `.jpg`, `.png`, `.gif`, `.svg`, etc.
- **Video Player** - Play video files (`.mp4`, `.webm`, etc.)
- **Audio Player** - Play audio files (`.mp3`, `.wav`, etc.)
- **Code Syntax Highlighting** - Monaco Editor integration

### UI/UX
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Grid/List View** - Switch between view modes
- **Context Menu** - Right-click for quick actions
- **Dropdown Menu** - Three-dot menu for mobile-friendly access
- **Sticky Navbar** - Always accessible navigation with glass effect


### Additional Features
- **File Sharing** - Share files with other users (Coming Soon)
- **Storage Usage Indicator** - Track your storage consumption
- **Toast Notifications** - Real-time feedback for actions
- **Drag and Drop** - Upload files by dragging them

---

## Project Structure

```
root/
│
├── client/                          # Frontend React Application
│   ├── public/                      # Public static files
│   │   └── vite.svg                 # Vite logo (useless)
│   │
│   ├── src/
│   │   ├── assets/                  # Static assets (images, icons)
│   │   │   └── react.svg
│   │   │
│   │   ├── components/              # Reusable React components
│   │   │   ├── fileProcess.jsx      # File upload/delete/edit handler
│   │   │   ├── landing.jsx          # Landing page component
│   │   │   ├── navbar.jsx           # Navigation bar & footer
│   │   │   ├── page-control.jsx     # Page routing controller
│   │   │   ├── SearchBar.jsx        # Search functionality
│   │   │   ├── sidebar.jsx          # Dashboard sidebar
│   │   │   └── toast.jsx            # Toast notification system
│   │   │
│   │   ├── config/
│   │   │   └── axios.js             # Axios global configuration
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── converter.jsx        # File converter page
│   │   │   ├── dashboard.jsx        # Main dashboard
│   │   │   ├── Editor.jsx           # Code/text editor
│   │   │   ├── Files.jsx            # File browser
│   │   │   ├── login.jsx            # Login/signup page
│   │   │   ├── not-found.jsx        # 404 error page
│   │   │   ├── privacy.jsx          # Privacy policy
│   │   │   ├── terms.jsx            # Terms of service
│   │   │   └── Viewer.jsx           # Multi-format file viewer
│   │   │
│   │   ├── stores/                  # State management (Zustand)
│   │   │   ├── tab-data.js          # Tab state management
│   │   │   ├── ThemeManager.js      # Theme state (dark/light mode)
│   │   │   └── userstore.js         # User authentication state
│   │   │
│   │   ├── style/                   # Additional stylesheets
│   │   │   └── modal.css            # Modal styling
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   ├── dateModi.js          # Date formatting
│   │   │   ├── edit-view-routes.jsx # File routing logic
│   │   │   ├── file-icon.jsx        # File type icon mapper
│   │   │   ├── slug.js              # URL slug generator
│   │   │   └── use-toast.jsx        # Toast hook
│   │   │
│   │   ├── App.css                  # Global app styles
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css                # Root CSS with Tailwind
│   │   └── main.jsx                 # React entry point
│   │
│   ├── .env.local                   # Environment variables (USER MUST CREATE)
│   ├── .gitignore                   # Git ignore rules
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML template
│   ├── package.json                 # Dependencies & scripts
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── vite.config.js               # Vite configuration
│
├── server/                          # Backend Express Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MySQL database connection
│   │   │
│   │   ├── middleware/
│   │   │   └── cookie-auth.js       # Authentication middleware
│   │   │
│   │   └── routes/
│   │       ├── auth.js              # Authentication routes
│   │       └── files.js             # File management routes
│   │
│   ├── uploads/                     # User uploaded files storage (Create Automatically By System)
│   │   └── {userId}/                # User-specific folders
│   │
│   ├── utils/                       # Server utilities
│   │
│   ├── .env.local                   # Environment variables (USER MUST CREATE)
│   ├── .gitignore                   # Git ignore rules
│   ├── index.js                     # Server entry point
│   └── package.json                 # Dependencies & scripts
│
├── LICENSE.md                       # MIT License
└── README.md                        # This file
```

---

## Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Radix UI** - Headless UI components
- **Monaco Editor** - Code editor
- **React Markdown** - Markdown renderer
- **PDF.js** - PDF viewer
- **Vidstack** - Video player

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Multer** - File upload middleware
- **Cookie-based Authentication** - Secure session management

---

## Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

### Step 1: Clone the Repository
```bash
git clone https://github.com/LeowJianYang/fileflow_fms.git
cd proj_react
```

### Step 2: Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

### Step 3: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE fileflow_db;
```

2. Create required tables:

**Users Table:**
```sql
CREATE TABLE users (
  UserId INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(255) NOT NULL UNIQUE,
  Email VARCHAR(255) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Files Table:**
```sql
CREATE TABLE fileData (
  FileId INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filetype VARCHAR(100),
  filepath VARCHAR(500) NOT NULL,
  filesize BIGINT,
  UserId INT NOT NULL,
  dirId INT DEFAULT NULL,
  lastModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES users(UserId) ON DELETE CASCADE
);
```

**Directories Table:**
```sql
CREATE TABLE fdirectory (
  dirId INT AUTO_INCREMENT PRIMARY KEY,
  dirName VARCHAR(255) NOT NULL,
  dirPath VARCHAR(500) NOT NULL,
  UserId INT NOT NULL,
  parentDirId INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES users(UserId) ON DELETE CASCADE,
  FOREIGN KEY (parentDirId) REFERENCES fdirectory(dirId) ON DELETE CASCADE
);
```
**Share Files Table**
```sql
create table sharedfile (
	UserId int not null,
    FileId int not null,
    permission ENUM('r', 'w', 'x') not null,
    primary key (UserId, FileId),
    
    constraint fk_uid_sf
     foreign key (UserId) references userdata(UserId)
    on delete cascade on update cascade,
    
    constraint fk_fid_sf
     foreign key (FileId) references fileData(FileId)
    on delete cascade on update cascade
	)

```

---

## Configuration

### Client Environment Variables

Create `.env.local` in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Server Environment Variables

Create `.env.local` in the `server/` directory:

```env
# Database Configuration
DB_INFF_HN=localhost            # Host Name
DB_INFF_UN=your_mysql_username  # Username
DB_INFF_PW=your_mysql_password  # Password
DB_INFF_DBN=fileflow_db         # Schema Name
DB_INFF_PR=3306                 # Port Num
SERVICE_URI=your_DB_URI         # Database URI (Optional if local) 

# Session/Cookie Secret (generate a random string)
JWT_SECRET=your_super_secret_key_here

# KEY ENCRYPTION (OPTIONAL)
AES_KEY=HEX_KEY
IV=AES_IV

# CORS Configuration
WEB_URL=http://localhost:5173
```

---

## Usage

### Development Mode

#### Run Client (Frontend)
```bash
cd client
npm run dev
```
- Client will run on **http://localhost:5173**

#### Run Server (Backend)
```bash
cd server
npm run dev
```
- Server will run on **http://localhost:5000**

### Concurrent Development
You can run both client and server simultaneously from the client directory:
```bash
cd client
npm run dev  # This runs both frontend and backend concurrently
```

### Production Build

#### Build Client
```bash
cd client
npm run build
```

#### Preview Production Build
```bash
cd client
npm run preview
```

---

## Scripts

### Client Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

### Server Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon (auto-restart) |
| `npm start` | Start server in production mode |

---

## Security Features

- **HttpOnly Cookies** - Secure session management
- **Password Hashing** - Bcrypt encryption
- **CORS Protection** - Cross-origin request handling
- **SQL Injection Prevention** - Parameterized queries
- **Authentication Middleware** - Protected routes
- **File Upload Validation** - Type and size checks

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### File Management
- `GET /api/files/list` - Get user's files and folders
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - View/download file
- `DELETE /api/files/:id` - Delete file or folder
- `POST /api/files/save-editor` - Save edited file
- `POST /api/files/up` - Rename file or folder

### Folders
- `POST /api/files/dir` - Create new folder

### Share Management
- `GET /api/sf/shared-by-me` - Get files shared by user (I'm Owner)
- `POST /api/sf/share` - Share the files based on selection
- `DELETE /api/sf/share` - Remove Share link and Permission
- `GET /api/sf/validate` - Validate the share link
- `GET /api/sf/validate-share/:fileId/:permission` - Validate Share link based on the Permission and Id


> **ATTENTION** </br>
    Please Note that ```sameSite``` change to none and ```secure``` change for true while production.
    **OR** use ```process.env.NODE_ENV``` for dynamic changes.
---

## Known Issues

- Storage limit enforcement is basic (upgrade planned)
- Large file uploads may timeout (chunked upload planned)
- Limited file conversion features

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/LeowJianYang/fileflow_fms/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** - see the [LICENSE.md](LICENSE.md) file for details.


## Author

**leowjy (NICE)**

- GitHub: [@LeowJianYang](https://github.com/LeowJianYang)
- Project Link: [https://github.com/LeowJianYang/fileflow_fms](https://github.com/LeowJianYang/fileflow_fms)

---

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Vidstack](https://vidstack.io/)

---

## Support

If you like this project, please give it a ⭐ on GitHub!

For support, please open an issue on the [GitHub repository](https://github.com/LeowJianYang/fileflow_fms/issues).

---

## Development Process

### Calude
- Show some ```grid``` in TaiwindCSS in Cards and Responsive
- change certain colors and text color and change the inner flex container
- To fit with the dark mode and light theme, and display the icon in flex view

### Stich Io
- Create an Simple File Management UI for me
- Modify some UI design for more responsive and ease of use
- Aligns with the ease of use


