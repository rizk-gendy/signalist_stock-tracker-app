import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';

export async function GET() {
  const startedAt = new Date().toISOString();
  try {
    const conn = await connectToDatabase();
    // Run a ping command against the admin database
    const admin = conn.connection.db.admin();
    const ping = await admin.command({ ping: 1 });

    // Derive some safe diagnostics
    const uri = process.env.MONGODB_URI || '';
    const uriPreview = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://<user>:<password>@');
    const dbName = conn.connection.db.databaseName;
    const readyState = conn.connection.readyState; // 1 = connected
    const mongooseVersion = conn.version; // string
    // host may be undefined in some drivers; try to infer
    const host = (conn.connection as any).host || (conn.connection as any).client?.topology?.s?.description?.type || 'unknown';

    const info = {
      ok: true,
      startedAt,
      finishedAt: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      uriPreview,
      dbName,
      host,
      readyState, // 1 = connected
      mongooseVersion,
      ping,
    } as const;

    return NextResponse.json(info, { status: 200 });
  } catch (error: any) {
    const err = {
      ok: false,
      startedAt,
      finishedAt: new Date().toISOString(),
      error: error?.message || 'Unknown error',
    };
    return NextResponse.json(err, { status: 500 });
  }
}
