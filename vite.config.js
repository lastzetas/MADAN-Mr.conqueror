import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import registrationsHandler from './api/registrations.js';
import inquiriesHandler from './api/inquiries.js';

function mongoApiPlugin() {
  return {
    name: 'mongo-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (url.pathname === '/api/registrations') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch (e) {
              req.body = body;
            }
            req.query = Object.fromEntries(url.searchParams.entries());
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            try {
              await registrationsHandler(req, res);
            } catch (err) {
              console.error('Dev API error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (url.pathname === '/api/inquiries') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch (e) {
              req.body = body;
            }
            req.query = Object.fromEntries(url.searchParams.entries());
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            try {
              await inquiriesHandler(req, res);
            } catch (err) {
              console.error('Dev API error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    mongoApiPlugin()
  ],
});
