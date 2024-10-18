import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdmin } from "@/server/api/utils/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ref = searchParams.get('ref');

  if (!ref) {
    return NextResponse.json({ error: 'ref parameter is required' }, { status: 400 });
  }

  try {
    const { data: profile, error } = await SupabaseAdmin()
      .from('profile')
      .select('*')
      .eq('refeerer', ref)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: profile?.id || null,
      first_name: profile?.name || null,
      email: profile?.email || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
