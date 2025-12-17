'use server';

import { connectToDatabase } from '@/database/mongoose';
import Watchlist from '@/database/models/watchList.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  try {
    if (!email) return [];

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return [];

    // Find user by email in Better Auth user collection
    const user = await db.collection('user').findOne(
      { email },
      { projection: { _id: 1, id: 1 } }
    );

    if (!user) return [];

    const userId = (user.id as string) || (user._id?.toString() as string) || '';
    if (!userId) return [];

    const docs = await Watchlist.find({ userId }).select('symbol -_id').lean();
    return (docs || []).map((d) => d.symbol as string);
  } catch (err) {
    console.error('Error fetching watchlist symbols by email:', err);
    return [];
  }
}

export default getWatchlistSymbolsByEmail;
