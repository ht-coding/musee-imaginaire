import { HARVARD_API_KEY } from '$env/static/private';
import { fetchHarvardData, parseHarvardData } from '$lib/server/utils';
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
			console.log(record);
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

describe('parseHarvardData()', () => {});
