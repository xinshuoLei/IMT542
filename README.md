## JavaScript Package Health & Usability System 

A comprehensive system for analyzing JavaScript package health and usability metrics through npm, GitHub, and download statistics.

### Table of Contents

- [Overview](#overview)
- [Local Setup Guide](#local-setup-guide)
  - [Prerequisites](#prerequisites)
  - [Initial Setup](#initial-setup)
  - [Backend Setup (FastAPI)](#backend-setup-fastapi)
  - [Chrome Extension Setup](#chrome-extension-setup)
  - [Configuration](#configuration)
  - [Running the System](#running-the-system)

### Overview

This system consists of two main components:
- **FastAPI Backend**: Aggregates data from npm registry and GitHub API
- **Chrome Extension**: Provides browser-based interface for package analysis

## Local Setup Guide

### Prerequisites

- **Python 3.8+** (for the backend API)
- **Node.js 16+** and **npm** (for building the Chrome extension)
  - Official installation guide: [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- **Google Chrome** or **Chromium-based browser**
- **GitHub Personal Access Token** (required for GitHub API access)

### Initial Setup

#### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### Backend Setup (FastAPI)

#### 1. Navigate to Backend Directory

```bash
cd fast_api
```

#### 2. Create and Activate Python Virtual Environment

**Create virtual environment:**
```bash
python -m venv venv
```

**Activate virtual environment:**

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

> **Verify activation:**
the virtual environment is active when you see `(venv)` at the beginning of your command prompt.

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Configure Environment Variables

Create a `.env` file in the `fast_api` directory for GitHub API access:

```bash
# .env file
# Replace <your_github_personal_access_token_here> with your actual token
GITHUB_TOKEN=<your_github_personal_access_token_here>
```

See [GitHub's official guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) for understanding what personal access tokens are and how to create them.

> **Note:** For this project, we recommend using a fine-grained personal access token as it provides better security with more granular permissions.

#### 5. Start the API Server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

> **Note:** Running on port 8000 is optional. If you use a different port or host, remember to update the API URL in the [extension's options page](#configure-api-url-if-needed).

The API will be available at: `http://localhost:8000`

**Verify the API is running:**
- Open `http://localhost:8000` in your browser
- You should see the API welcome message and available endpoints

### Chrome Extension Setup

#### 1. Navigate to Extension Directory

```bash
# From the repository root directory
cd chrome_extension
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Build the Extension

```bash
npm run build
```

This creates a `dist` folder with the compiled extension files.

#### 4. Load Extension in Chrome

1. **Open Chrome Extensions page:**
   - Type `chrome://extensions/` in address bar, or
   - Chrome menu → More tools → Extensions

2. **Enable Developer mode:**
   - Toggle "Developer mode" switch in top-right corner

3. **Load the extension:**
   - Click "Load unpacked"
   - Select the `chrome_extension/dist` folder
   - The extension should appear in your extensions list

4. **Verify installation:**
   - Look for the "JavaScript Package Health" extension
   - Pin it to toolbar for easy access (optional)

### Configuration

#### Configure API URL (if needed)

If your API runs on a different port or host:

1. **Right-click the extension icon** → **Options**
2. **Set API Base URL** (default: `http://localhost:8000`)
3. **Test Connection** to verify it's working
4. **Save Settings**

Common alternative URLs:
- `http://127.0.0.1:8000`
- `http://localhost:3001`
- Custom domain: `https://your-api-domain.com`

### Running the System

#### 1. Start the Backend API

```bash
# Navigate to fast_api directory
cd fast_api

# Activate virtual environment (if not already active)
```

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

**Start the API server:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

> **Note:** Running on port 8000 is the default but optional. If you use a different port or host, remember to update the API URL in the [extension's options page](#configure-api-url-if-needed).

#### 2. Use the Chrome Extension

The extension is now ready to use! You can:

- **Highlight package names** on any webpage and press `Ctrl+H` (`Cmd+H` on Mac)
- **Click the extension icon** to search manually
- **View comprehensive health metrics** for any npm package

---

Your JavaScript Package Health & Usability System is now ready to analyze npm packages and provide comprehensive health insights!