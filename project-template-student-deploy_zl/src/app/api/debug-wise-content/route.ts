import { NextResponse } from 'next/server';
import { wiseContent } from '@/data/wise-content';

export async function GET() {
  const slugs = Object.keys(wiseContent);
  const karl = wiseContent['karl-marx'];

  return NextResponse.json({
    slugs,
    karlMarxKeys: karl ? Object.keys(karl) : 'NOT FOUND',
    karlMarxIntroLength: karl?.introduction?.length ?? 'null',
    karlMarxBasicLength: karl?.basicInfo?.length ?? 'null',
    karlMarxCogLength: karl?.cognitiveStyle?.length ?? 'null',
  });
}
