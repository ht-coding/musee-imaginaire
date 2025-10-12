import {
	unique,
	pgTable,
	serial,
	integer,
	text,
	timestamp,
	primaryKey,
	doublePrecision
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const artwork = pgTable(
	'artwork',
	{
		collectionId: text('collection_id').notNull(),
		artworkId: integer('artwork_id').notNull(),
		collection: text('collection'),
		thumbnailURL: text('thumbnail_url'),
		imageURL: text('image_url'),
		artworkURL: text('artwork_url'),
		accessionYear: integer('accession_year'),
		creditLine: text('credit_line'),
		department: text('department'),
		title: text('title'),
		medium: text('medium'),
		description: text('description'),
		alt: text('alt'),
		height: doublePrecision('height'),
		width: doublePrecision('width')
	},
	(table) => [primaryKey({ columns: [table.collectionId, table.artworkId] })]
);

export const artist = pgTable(
	'artist',
	{
		id: serial('id').primaryKey(),
		name: text('name'),
		culture: text('culture'),
		years: text('years'),
		gender: text('gender')
	},
	(table) => [unique().on(table.name, table.culture)]
);

export const artistsToArtworks = pgTable(
	'artists_artwork',
	{
		artistId: integer('artist_id')
			.notNull()
			.references(() => artist.id, { onDelete: 'cascade' }),

		artworkCollectionId: text('artwork_collection_id').notNull(),
		artworkId: integer('artwork_id').notNull()
	},
	(table) => [primaryKey({ columns: [table.artistId, table.artworkCollectionId, table.artworkId] })]
);

export const exhibit = pgTable('exhibit', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow()
});

export const exhibitToArtworks = pgTable(
	'exhibit_artworks',
	{
		exhibitId: integer('exhibit_id')
			.notNull()
			.references(() => exhibit.id, { onDelete: 'cascade' }),

		artworkCollectionId: text('artwork_collection_id').notNull(),
		artworkId: integer('artwork_id').notNull(),

		addedAt: timestamp('added_at', { mode: 'date' }).defaultNow()
	},
	(table) => [
		primaryKey({ columns: [table.exhibitId, table.artworkCollectionId, table.artworkId] })
	]
);

export const apiRefreshLog = pgTable('api_refresh_log', {
	id: integer('id').primaryKey().notNull(),
	lastRefresh: timestamp('last_refresh', { withTimezone: true }).notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Artwork = typeof artwork.$inferSelect;
export type Artist = typeof artist.$inferSelect;
export type Exhibit = typeof exhibit.$inferSelect;
export type ApiRefreshLog = typeof apiRefreshLog.$inferSelect;
export type ExhibitToArtwork = typeof exhibitToArtworks.$inferInsert;
export type ArtistsToArtworks = typeof artistsToArtworks.$inferInsert;
