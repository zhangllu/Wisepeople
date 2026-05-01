import { NextRequest, NextResponse } from 'next/server';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import wiseContent from '@/data/wise-content.json';

type WiseContent = Record<
  string,
  {
    introduction: string | null;
    basicInfo: string | null;
    cognitiveStyle: string | null;
  }
>;

const contentMap = wiseContent as WiseContent;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const entry = contentMap[slug];

  if (!entry) {
    return NextResponse.json(
      { introduction: null, basicInfo: null, cognitiveStyle: null },
      { status: 404 }
    );
  }

  // Render markdown to HTML in parallel
  const [introduction, basicInfo, cognitiveStyle] = await Promise.all([
    entry.introduction ? renderMarkdown(entry.introduction) : Promise.resolve(null),
    entry.basicInfo ? renderMarkdown(entry.basicInfo) : Promise.resolve(null),
    entry.cognitiveStyle ? renderMarkdown(entry.cognitiveStyle) : Promise.resolve(null),
  ]);

  return NextResponse.json({ introduction, basicInfo, cognitiveStyle });
}

async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}
