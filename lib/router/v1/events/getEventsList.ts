import { Request, Response } from 'express';
import { Event } from '@masochistme/sdk/dist/v1/types';
import { EventsListParams } from '@masochistme/sdk/dist/v1/api/events';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

/**
 * Returns a list of all events.
 */
export const getEventsList = async (
  req: Request<any, any, EventsListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { client, db } = await connectToDb();
    const collection = db.collection<Event>('events');
    const events: Event[] = [];

    const cursor = collection
      .find(filter)
      .sort({ ...(sort.date && { date: sortCollection(sort.date) }) })
      .limit(limit);

    await cursor.forEach((el: Event) => {
      events.push(el);
    });

    client.close();

    res.status(200).send(events);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};