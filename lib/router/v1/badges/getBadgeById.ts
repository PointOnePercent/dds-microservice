import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a badge by the given ID (if it exists).
 * @param req Request
 * @param res Response
 * @returns void
 */
export const getBadgeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Badge>('badges');
    const _id = new ObjectId(req.params.badgeId);

    const badge: Badge | null = await collection.findOne({ _id });

    client.close();

    if (!badge) {
      res.status(404).send({ error: 'Could not find a badge with this id.' });
    } else {
      res.status(200).send(badge);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
