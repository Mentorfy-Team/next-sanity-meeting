import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdmin } from "@/server/api/utils/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { meetingID: string } }
) {
  const { meetingID } = params;

  const supabase = SupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from("meeting")
      .select("*")
      .eq("friendly_id", meetingID)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
