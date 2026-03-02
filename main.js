const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config(); // Load .env at startup
const { MongoClient, ServerApiVersion } = require('mongodb');

// Construct the MongoDB connection string
const encodedUser = encodeURIComponent(process.env.Mongo_USER);
const encodedPassword = encodeURIComponent(process.env.Mongo_PASSWORD);
const encodedDbName = encodeURIComponent(process.env.Mongo_DATABASE);
const normalizedCluster = process.env.Mongo_CLUSTER.includes(".mongodb.net")
  ? process.env.Mongo_CLUSTER
  : `${process.env.Mongo_CLUSTER}.mongodb.net`;
const uri = `mongodb+srv://${encodedUser}:${encodedPassword}@${normalizedCluster}/${encodedDbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

function createWindow() {
  // Create browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load app
  const isDev = !app.isPackaged;
  
  if (isDev) {
    // Development: load from React dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from build folder
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
}

// Create window when ready
app.whenReady().then(createWindow);

// Handle API key request from renderer
ipcMain.handle('get-api-key', () => {
  return process.env.OPENAI_API_KEY || null;
});

// Recreate window on macOS when clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit when all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
