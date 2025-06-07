
## Local Setup Guide

Instructions for running the JavaScript Package Health & Usability System on your local machine.

### Table of Contents

- [Prerequisites](#prerequisites)  
- [Initial Setup](#initial-setup)  
- [Backend Setup (FastAPI)](#backend-setup-fastapi)  
- [Chrome Extension Setup](#chrome-extension-setup)  
- [Configuration](#configuration)  
- [Running the System](#running-the-system)  

### Prerequisites

- **Python 3.8+** (for the backend API)  
- **Node.js 16+** and **npm** (for building the Chrome extension)  
  - Installation guide: [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
- **Google Chrome** or another **Chromium-based browser**  
- **GitHub Personal Access Token** (required for GitHub API access)  

### Initial Setup

#### 1. Clone the repository

Clone the `Final-Project` branch, which contains the complete system:

```bash
git clone -b Final-Project https://github.com/xinshuoLei/IMT542.git
```

#### 2. Navigate to the project directory

```bash
cd IMT542
```

### Backend Setup (FastAPI)

#### 1. Navigate to the backend directory

```bash
cd fast_api
```

#### 2. Create a Python virtual environment

```bash
python -m venv venv
```

#### 3. Activate the Python virtual environment

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

> **Verify activation:** The virtual environment is active when you see `(venv)` at the beginning of your command prompt.

#### 4. Install dependencies

```bash
pip install -r requirements.txt
```

#### 5. Configure environment variables

Create a `.env` file in the `fast_api` directory to enable GitHub API access:

```bash
# .env file
# Replace <your_github_personal_access_token_here> with your actual token
GITHUB_TOKEN=<your_github_personal_access_token_here>
```

See [GitHub’s official guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) for instructions on creating a personal access token.

> **Note:** We recommend using a fine-grained token for improved security and more granular permissions.

#### 6. Start the API server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

> **Note:** Running on port 8000 is optional. If you use a different port or host, remember to update the API URL in the [extension's options page](#configure-api-url-if-needed).

The API will be available at: `http://localhost:8000`

**Verify the API is running:**

- Open `http://localhost:8000` in your browser  
- You should see a welcome message and a list of available endpoints  

### Chrome Extension Setup

#### 1. Navigate to the extension directory

```bash
# From the repository root directory
cd chrome_extension
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Build the extension

```bash
npm run build
```

This creates a `dist` folder with the compiled extension files.

#### 4. Load the extension in Chrome

1. **Open Chrome and navigate to the Extensions page:**
   - Type `chrome://extensions/` in the address bar, or  
   - Go to Chrome menu → More tools → Extensions  

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner  

3. **Load the extension:**
   - Click “Load unpacked”  
   - Select the `chrome_extension/dist` folder  
   - The extension should now appear in your extensions list  

4. **Verify installation:**
   - Look for the “JavaScript Package Health” extension  
   - (Optional) Pin it to the toolbar for quick access  

### Configuration

#### Configure API URL (if needed)

If your API runs on a different port or host:

1. **Right-click the extension icon** → **Options**  
2. **Set the API Base URL** (default: `http://localhost:8000`)  
3. **Test the Connection** to verify it works  
4. **Save Settings**  

Common alternative URLs:
- `http://127.0.0.1:8000`  
- `http://localhost:3001`  
- Custom domain: `https://your-api-domain.com`  

### Running the System

#### 1. Start the backend API

First, navigate to the backend directory and activate your virtual environment:

```bash
cd fast_api

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

Then start the API server:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

> **Note:** If you change the port or host, remember to update the API URL in the [extension’s options page](#configure-api-url-if-needed).

#### 2. Use the Chrome extension

The extension is now ready! You can:

- **Highlight package names** on any webpage and press `Ctrl+H` (`Cmd+H` on Mac)  
- **Click the extension icon** to search manually  
- **View detailed health metrics** for any npm package  

---

**Next Steps:** Return to the [main README](README.md) for an overview of the system and additional documentation.
