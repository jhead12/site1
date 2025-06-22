// This script ensures that required directories exist before the build
const fs = require('fs');
const path = require('path');

// Get project root directory
const projectRoot = path.resolve(__dirname, '..');

// Directories to ensure exist
const requiredDirs = [
  path.join(projectRoot, 'static/audio'),
  path.join(projectRoot, 'static/images'),
  // Add any other required directories here
];

// Required files structure
const requiredFiles = [
  {
    path: path.join(projectRoot, 'static/audio/placeholder.js'),
    content: '// This is a placeholder file to ensure the directory exists\n// and to provide a minimum file for gatsby-source-filesystem\nconsole.log("Audio player is loading...");'
  },
  {
    path: path.join(projectRoot, 'static/audio/.gitkeep'),
    content: ''
  },
  {
    path: path.join(projectRoot, 'static/audio/demo-track-1.mp3'),
    content: 'PLACEHOLDER_MP3_FILE'
  },
  {
    path: path.join(projectRoot, 'static/audio/demo-track-2.mp3'),
    content: 'PLACEHOLDER_MP3_FILE'
  },
  {
    path: path.join(projectRoot, 'static/images/demo-cover-1.jpg'),
    content: 'PLACEHOLDER_IMAGE'
  }, 
  {
    path: path.join(projectRoot, 'static/images/demo-cover-2.jpg'),
    content: 'PLACEHOLDER_IMAGE'
  }
];

console.log('Ensuring required directories exist...');
console.log('Project root:', projectRoot);

// Create directories
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

// Create files
requiredFiles.forEach(file => {
  if (!fs.existsSync(file.path)) {
    console.log(`Creating file: ${file.path}`);
    fs.writeFileSync(file.path, file.content);
  } else {
    console.log(`File already exists: ${file.path}`);
  }
});

console.log('Directory and file check completed.');
