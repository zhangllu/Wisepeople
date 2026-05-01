/**
 * Build-time script: reads 智者资料库 markdown files and generates
 * src/data/wise-content.json so the content is bundled at build time
 * instead of being read from the filesystem at runtime.
 *
 * This avoids Vercel serverless function path resolution issues.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const WISE_PEOPLE_DIR = path.join(PROJECT_ROOT, '智者资料库')
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'wise-content.json')

const METADATA_PATH = path.join(WISE_PEOPLE_DIR, 'metadata.json')
if (!fs.existsSync(METADATA_PATH)) {
  console.error('metadata.json not found at', METADATA_PATH)
  process.exit(1)
}

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'))
const wisePeople = metadata.wise_people || []

const contentMap = {}

for (const person of wisePeople) {
  const { slug, status } = person
  const basePath = path.join(WISE_PEOPLE_DIR, slug)

  if (!fs.existsSync(basePath)) {
    console.warn(`[warn] Directory not found for ${slug}, skipping`)
    continue
  }

  const entry = { introduction: null, basicInfo: null, cognitiveStyle: null }

  for (const [key, filename] of [
    ['introduction', '01-智者介绍.md'],
    ['basicInfo', '02-基本信息.md'],
    ['cognitiveStyle', '03-认知方式.md'],
  ]) {
    const filePath = path.join(basePath, filename)
    if (fs.existsSync(filePath)) {
      entry[key] = fs.readFileSync(filePath, 'utf-8')
    }
  }

  contentMap[slug] = entry
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(contentMap, null, 2), 'utf-8')
console.log(`✓ Generated wise-content.json with ${Object.keys(contentMap).length} entries → ${OUTPUT_PATH}`)
