// app/api/delete-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client, Users } from "node-appwrite";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Create Appwrite Client just like the SDK example
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // e.g. https://cloud.appwrite.io/v1
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!) // your project ID
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_USER_MGMT!);

  client.config.selfSigned = true;

  const users = new Users(client);

  try {
    const result = await users.delete(userId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("From POST()", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
