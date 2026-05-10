#!/usr/bin/env node
/**
 * Pushes docs/notion-week1-v1-post.md into Notion as a child of your "Medium" page.
 *
 * One-time setup:
 * 1. https://www.notion.so/my-integrations → New integration → copy "Internal Integration Secret".
 * 2. In Notion, open your "Medium" page → Share → Invite the integration (must have edit access).
 * 3. Copy the Medium page URL; the ID is the 32-char hex after the last / and before ?v=.
 *    Example: ...notion.so/My-Workspace-1a2b3c4d5e6f... → use 1a2b3c4d5e6f... (with or without dashes).
 *
 * Run from repo root:
 *   NOTION_API_KEY=secret_xxx NOTION_MEDIUM_PAGE_ID=xxxxxxxx node scripts/notion-publish-week1.mjs
 *
 * Optional: NOTION_API_VERSION=2022-06-28 (default)
 *
 * Dry run (no API calls):
 *   node scripts/notion-publish-week1.mjs --dry-run
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MD_FILE = path.join(__dirname, '..', 'docs', 'notion-week1-v1-post.md')
const NOTION_VERSION = process.env.NOTION_API_VERSION ?? '2022-06-28'
const API = 'https://api.notion.com/v1'

function formatPageId(raw) {
  if (!raw) return ''
  const s = String(raw).replace(/-/g, '').trim()
  if (s.length !== 32 || !/^[a-f0-9]+$/i.test(s)) return String(raw).trim()
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`
}

function chunkRichText(text, max = 1900) {
  if (text.length <= max) return [text]
  const out = []
  for (let i = 0; i < text.length; i += max) out.push(text.slice(i, i + max))
  return out
}

/** @param {string} line */
function lineToRichText(line) {
  const segments = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  const rich = []
  for (const seg of segments) {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      const inner = seg.slice(2, -2)
      for (const c of chunkRichText(inner)) {
        rich.push({ type: 'text', text: { content: c }, annotations: { bold: true } })
      }
    } else {
      for (const c of chunkRichText(seg)) {
        rich.push({ type: 'text', text: { content: c } })
      }
    }
  }
  return rich.length ? rich : [{ type: 'text', text: { content: ' ' } }]
}

/**
 * @param {string} md
 * @returns {{ title: string, blocks: object[] }}
 */
function mdToNotionBlocks(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  let title = 'Week 1 post'
  const blocks = []
  let i = 0

  if (lines[0]?.startsWith('# ')) {
    title = lines[0].slice(2).trim()
    i = 1
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    if (trimmed === '---') {
      blocks.push({ object: 'block', type: 'divider', divider: {} })
      i++
      continue
    }

    if (trimmed.startsWith('## ')) {
      const t = trimmed.slice(3).trim()
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: lineToRichText(t) },
      })
      i++
      continue
    }

    if (trimmed.startsWith('# ')) {
      const t = trimmed.slice(2).trim()
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: lineToRichText(t) },
      })
      i++
      continue
    }

    if (trimmed.startsWith('> ')) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: lineToRichText(trimmed.slice(2)) },
      })
      i++
      continue
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const t = trimmed.replace(/^\d+\.\s*/, '')
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: lineToRichText(t) },
      })
      i++
      continue
    }

    if (trimmed.startsWith('- ')) {
      const t = trimmed.slice(2)
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: lineToRichText(t) },
      })
      i++
      continue
    }

    const paraLines = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('#') && lines[i].trim() !== '---' && !lines[i].trim().startsWith('> ') && !/^\d+\.\s/.test(lines[i].trim()) && !lines[i].trim().startsWith('- ')) {
      paraLines.push(lines[i])
      i++
    }
    const text = paraLines.join('\n').trim()
    if (text) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: lineToRichText(text) },
      })
    }
  }

  return { title, blocks }
}

async function notionFetch(token, method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.message ?? res.statusText
    throw new Error(`${res.status} ${msg}${data.code ? ` (${data.code})` : ''}`)
  }
  return data
}

function chunkBlocks(blocks, size = 100) {
  const chunks = []
  for (let j = 0; j < blocks.length; j += size) chunks.push(blocks.slice(j, j + size))
  return chunks
}

const dry = process.argv.includes('--dry-run')
const md = fs.readFileSync(MD_FILE, 'utf8')
const { title, blocks } = mdToNotionBlocks(md)

if (dry) {
  console.log('Title:', title)
  console.log('Blocks:', blocks.length)
  process.exit(0)
}

const token = process.env.NOTION_API_KEY
const parentRaw = process.env.NOTION_MEDIUM_PAGE_ID
if (!token || !parentRaw) {
  console.error('Set NOTION_API_KEY and NOTION_MEDIUM_PAGE_ID. See header comment in this script.')
  process.exit(1)
}

const parent_id = formatPageId(parentRaw)

const page = await notionFetch(token, 'POST', '/pages', {
  parent: { page_id: parent_id },
  properties: {
    title: {
      title: [{ type: 'text', text: { content: title.slice(0, 2000) } }],
    },
  },
})

const pageId = page.id
const batches = chunkBlocks(blocks)
for (const batch of batches) {
  await notionFetch(token, 'PATCH', `/blocks/${pageId}/children`, {
    children: batch,
  })
}

console.log('Created Notion page:', page.url ?? pageId)
