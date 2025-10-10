import { pgTable, serial, integer, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

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

export const artworks = pgTable(
	'artworks',
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
		description: text('description')
	},
	(table) => [primaryKey({ columns: [table.collectionId, table.artworkId] })]
);

export const apiRefreshLog = pgTable('api_refresh_log', {
	id: integer('id').primaryKey().notNull(),
	lastRefresh: timestamp('last_refresh', { withTimezone: true }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Artwork = typeof artworks.$inferSelect;

export type ApiRefreshLog = typeof apiRefreshLog.$inferSelect;
