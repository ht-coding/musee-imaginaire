ALTER TABLE exhibit_artworks ADD CONSTRAINT fk_exhibit_artworks_artwork FOREIGN KEY (artwork_collection_id, artwork_id) REFERENCES artwork (collection_id, artwork_id) ON DELETE CASCADE;

ALTER TABLE artists_artwork ADD CONSTRAINT fk_artists_artwork_artwork FOREIGN KEY (artwork_collection_id, artwork_id) REFERENCES artwork (collection_id, artwork_id) ON DELETE CASCADE;