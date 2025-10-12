import { HARVARD_API_KEY } from '$env/static/private';
import {
	fetchHarvardData,
	fetchMetData,
	harvardRecordToArtwork,
	metRecordToArtwork
} from '$lib/server/utils';
import { describe, test, expect } from 'vitest';

describe('fetchHarvardData()', () => {
	test('It returns an array', async () => {
		const response = await fetchHarvardData(HARVARD_API_KEY, 1);
		expect(Array.isArray(response)).toBe(true);
	});
	test('The array should be of the expected length', async () => {
		const response = await fetchHarvardData(HARVARD_API_KEY, 5);
		expect(response.length).toBe(5);
	});
	test('The array should only contain objects', async () => {
		const response = await fetchHarvardData(HARVARD_API_KEY, 5);
		response.forEach((record) => {
			expect(typeof record).toBe('object');
			expect(record).not.toBe(null);
			expect(Array.isArray(record)).toBe(false);
		});
	});
	test('The objects should contain the necessary keys', async () => {
		const response = await fetchHarvardData(HARVARD_API_KEY, 5);
		response.forEach((record) => {
			expect(record).toMatchObject({
				id: expect.any(Number),
				primaryimageurl: expect.any(String),
				title: expect.any(String),
				url: expect.any(String),
				accessionyear: expect.any(Number),
				creditline: expect.any(String),
				division: expect.any(String),
				medium: expect.any(String)
			});
			expect(typeof record.description === 'string' || record.description === null).toBe(true);
		});
	});
});

describe('harvardRecordToArtwork()', () => {
	test('It should return an object containing only the necessary keys', async () => {
		const response = await fetchHarvardData(HARVARD_API_KEY, 1);
		const artwork = harvardRecordToArtwork(response[0]);
		expect(artwork).toMatchObject({
			artworkId: expect.any(Number),
			collection: 'Harvard Art Museums',
			collectionId: 'Harvard',
			imageURL: expect.any(String),
			artworkURL: expect.any(String),
			accessionYear: expect.any(Number),
			creditLine: expect.any(String),
			department: expect.any(String),
			title: expect.any(String),
			medium: expect.any(String),
			description: expect.any(String),
			alt: expect.any(String),
			height: expect.any(Number),
			width: expect.any(Number)
		});
	});
});

describe('fetchMetData()', () => {
	test('It returns an array', async () => {
		const response = await fetchMetData(1);
		expect(Array.isArray(response)).toBe(true);
	});
	test('The array should be of the expected length', async () => {
		const response = await fetchMetData(5);
		expect(response.length).toBe(5);
	});
	test('The array should only contain objects', async () => {
		const response = await fetchMetData(5);
		response.forEach((record) => {
			expect(typeof record).toBe('object');
			expect(record).not.toBe(null);
			expect(Array.isArray(record)).toBe(false);
		});
	});
	test('The objects should contain the necessary keys', async () => {
		const response = await fetchMetData(5);
		response.forEach((record) => {
			expect(record).toMatchObject({
				id: expect.any(Number),
				primaryImage: expect.any(String),
				title: expect.any(String),
				objectURL: expect.any(String),
				accessionYear: expect.any(String),
				creditLine: expect.any(String),
				department: expect.any(String),
				medium: expect.any(String)
			});
		});
	});
});

describe('metRecordToArtwork()', () => {
	test('It should return an object containing only the necessary keys', async () => {
		const response = await fetchMetData(1);
		const artwork = metRecordToArtwork(response[0]);
		expect(artwork).toMatchObject({
			artworkId: expect.any(Number),
			collection: 'The Metropolitan Museum of Art',
			collectionId: 'Met',
			imageURL: expect.any(String),
			artworkURL: expect.any(String),
			accessionYear: expect.any(Number),
			creditLine: expect.any(String),
			department: expect.any(String),
			title: expect.any(String),
			medium: expect.any(String),
			description: expect.any(String),
			alt: expect.any(String),
			height: expect.any(Number),
			width: expect.any(Number)
		});
	});
});
