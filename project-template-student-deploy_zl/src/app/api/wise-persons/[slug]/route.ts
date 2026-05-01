import { NextRequest, NextResponse } from 'next/server';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import fs from 'fs';
import path from 'path';

const WISE_PEOPLE_BASE_PATH = '/Users/zhanglu/Desktop/Wisepeople/智者资料库';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const basePath = path.join(WISE_PEOPLE_BASE_PATH, slug);

  const content: {
    introduction: string | null;
    sources: string | null;
    cognitiveStyle: string | null;
  } = {
    introduction: null,
    sources: null,
    cognitiveStyle: null,
  };

  try {
    const introPath = path.join(basePath, '01-智者介绍.md');
    if (fs.existsSync(introPath)) {
      const markdown = fs.readFileSync(introPath, 'utf-8');
      content.introduction = await renderMarkdown(markdown);
    }
  } catch (error) {
    console.error(`Error reading introduction for ${slug}:`, error);
  }

  try {
    const sourcesPath = path.join(basePath, '02-原始资料.md');
    if (fs.existsSync(sourcesPath)) {
      const markdown = fs.readFileSync(sourcesPath, 'utf-8');
      content.sources = await renderMarkdown(markdown);
    }
  } catch (error) {
    console.error(`Error reading sources for ${slug}:`, error);
  }

  try {
    const cognitivePath = path.join(basePath, '03-认知方式.md');
    if (fs.existsSync(cognitivePath)) {
      const markdown = fs.readFileSync(cognitivePath, 'utf-8');
      content.cognitiveStyle = await renderMarkdown(markdown);
    }
  } catch (error) {
    console.error(`Error reading cognitive style for ${slug}:`, error);
  }

  return NextResponse.json(content);
}

async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
