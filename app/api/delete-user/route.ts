// app/api/delete-user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Client, Users } from "node-appwrite";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_USER_MGMT!);

  // Allow self-signed TLS only in local development (e.g. appwrite.localhost).
  // Never set in production — a valid certificate must be present.
  if (process.env.NODE_ENV !== "production") {
    client.config.selfSigned = true;
  }

  const users = new Users(client);

  try {
    const result = await users.delete(userId);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("From POST()", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
