import { NextRequest, NextResponse } from 'next/server';
import { BigBlueButtonAPI } from "@/server/api/utils/BBB-API";
import xml2js from "xml2js";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const meetingID = searchParams.get('meetingID');

  if (!meetingID) {
    return NextResponse.json({ error: 'meetingID parameter is required' }, { status: 400 });
  }

  const bbb = new BigBlueButtonAPI();

  try {
    const { data } = await bbb.getMeetingInfo(meetingID);

    if (data?.response?.returncode === 'FAILED') {
      return NextResponse.json({ error: data.response.message + ` (${meetingID})` }, { status: 400 });
    }

    const { response } = await convertXmlToObject(data) as { response: any };

    // Fix attendees
    let attendees = [];
    if (response?.attendees?.attendee?.length > 0) {
      attendees = response?.attendees?.attendee;
    } else if (response?.attendees?.attendee) {
      attendees = [response?.attendees?.attendee];
    }
    response.attendees = attendees;

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

function convertXmlToObject(xmlString: string) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, { explicitArray: false }, (err: any, result: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
