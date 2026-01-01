import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Config } from "../payload-types";

export type CollectionSlug = keyof Config["collections"] | (string & {});

type FindOptions = {
  collection: CollectionSlug;
  limit?: number;
  depth?: number;
  sort?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function findFromPayload<T = any>({
  collection,
  limit = 10,
  depth = 1,
  sort,
  where,
}: FindOptions): Promise<T[]> {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: collection as any,
    limit,
    depth,
    sort,
    where,
  });

  return docs as T[];
}


// pages data fetch page wise 

interface FindGlobalOptions {
  slug: any;
  depth?: number;
}

export const fetchGlobal = async <T = any>({
  slug,
  depth = 1,
}: FindGlobalOptions): Promise<T> => {
  const payload = await getPayload({ config: configPromise });

  const global = await payload.findGlobal({
    slug,
    depth,
  });

  return global as T;
};


export const fetchUsers = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "users", ...options });

export const fetchMedia = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "media", ...options });

export const fetchBanners = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "banners", ...options });

export const fetchEvents = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "events", ...options });

export const fetchNotices = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "notices", ...options });

export const fetchServices = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "services", ...options });

export const fetchImams = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "imams", ...options });

export const fetchAyatOfTheMonth = (
  options: Omit<FindOptions, "collection"> = {}
) => findFromPayload({ collection: "ayat-of-the-month", ...options });

export const fetchSermons = (options: Omit<FindOptions, "collection"> = {}) =>
  findFromPayload({ collection: "sermons", ...options });

export const fetchDonationAppeals = (
  options: Omit<FindOptions, "collection"> = {}
) => findFromPayload({ collection: "donation-appeals", ...options });

export const fetchCoreValues = (
  options: Omit<FindOptions, "collection"> = {}
) => findFromPayload({ collection: "core-values", ...options });

export const fetchCommittees = (
  options: Omit<FindOptions, "collection"> = {}
) => findFromPayload({ collection: "committees", ...options });


// fetch single document


