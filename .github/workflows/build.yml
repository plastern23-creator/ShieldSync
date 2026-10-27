name: Build Android APK from Web App

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  build-apk:
    name: Package Web App into Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup Java 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Bundle Web App with Yarn and Capacitor
        run: |
          JSX_FILE=$(find "$GITHUB_WORKSPACE" -maxdepth 2 \( -name "*.jsx" -o -name "*.tsx" \) | head -n 1)

          mkdir -p /tmp/shieldsync-build/src
          cd /tmp/shieldsync-build

          if [ -n "$JSX_FILE" ]; then
            cp "$JSX_FILE" src/App.jsx
          else
            echo "export default function App() { return <div style={{color:'white',padding:20}}>ShieldSync Ready</div> }" > src/App.jsx
          fi

          cat << 'EOF' > package.json
          {
            "name": "shieldsync-app",
            "version": "1.0.0",
            "private": true,
            "dependencies": {
              "react": "18.3.1",
              "react-dom": "18.3.1",
              "lucide-react": "0.454.0",
              "@capacitor/core": "6.1.2",
              "@capacitor/cli": "6.1.2",
              "@capacitor/android": "6.1.2"
            },
            "devDependencies": {
              "vite": "5.4.10",
              "@vitejs/plugin-react": "4.3.3"
            }
          }
          EOF

          cat << 'EOF' > index.html
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              <title>ShieldSync</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-[#070A12] text-white">
              <div id="root"></div>
              <script type="module" src="/src/main.jsx"></script>
            </body>
          </html>
          EOF

          cat << 'EOF' > src/main.jsx
          import React from 'react'
          import ReactDOM from 'react-dom/client'
          import App from './App.jsx'
          ReactDOM.createRoot(document.getElementById('root')).render(<App />)
          EOF

          cat << 'EOF' > vite.config.js
          import { defineConfig } from 'vite'
          import react from '@vitejs/plugin-react'
          export default defineConfig({ plugins: [react()], build: { outDir: 'dist' } })
          EOF

          yarn install
          yarn vite build
          yarn cap init "ShieldSync" "com.shieldsync.app" --web-dir dist
          yarn cap add android
          yarn cap sync android

      - name: Build Debug APK
        run: |
          cd /tmp/shieldsync-build/android
          chmod +x gradlew
          ./gradlew assembleDebug --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ShieldSync-Debug-APK
          path: /tmp/shieldsync-build/android/app/build/outputs/apk/debug/*.apk
          retention-days: 14
