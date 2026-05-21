import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function serveAssetsPlugin() {
  const root = process.cwd()

  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entry.name)
      const d = path.join(dest, entry.name)
      entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d)
    }
  }

  return {
    name: 'serve-assets-icons',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (url.startsWith('/assets/')) {
          const filePath = path.join(root, url)
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            const mime = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }
            res.setHeader('Content-Type', mime[ext] || 'application/octet-stream')
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }
        next()
      })
    },
    closeBundle() {
      copyDir(path.join(root, 'assets', 'icons'),  path.join(root, 'dist', 'assets', 'icons'))
      copyDir(path.join(root, 'assets', 'images'), path.join(root, 'dist', 'assets', 'images'))
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), serveAssetsPlugin()],
  publicDir: 'public',
})
