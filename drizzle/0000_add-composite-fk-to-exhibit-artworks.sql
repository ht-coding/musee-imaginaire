-- Custom SQL migration file, put your code below! --
ALTER TABLE exhibit_artworks ADD CONSTRAINT fk_artwork FOREIGN KEY (artwork_collection_id, artwork_id) REFERENCES artwork (collection_id, artwork_id) ON DELETE CASCADE;

ALTER TABLE artists_artwork ADD CONSTRAINT fk_artwork FOREIGN KEY (artwork_collection_id, artwork_id) REFERENCES artworks (collection_id, id) ON DELETE CASCADE;