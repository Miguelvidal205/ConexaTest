import apiClient from '../helpers/apiClient';
import { Pet } from '../types/pet';
import { petDataGenerator } from '../helpers/petDataGenerator';
import { waitCreatePet } from '../helpers/waitCreatePet';

describe.only('GET /pet/{petId} | Obtener mascotas', () => {
    let petId: number;
    let petName: string;

    beforeAll(async () => {
        petId = Date.now();
        petName = petDataGenerator();

        const newPet: Pet = {
            id: petId,
            name: petName,
            photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
            status: 'available'
        };
        const response = await waitCreatePet(newPet, { retries: 5, interval: 1000, log: true });

        expect(response.status).toBe(200);
    });

    it('Debe retornar la mascota por su ID', async () => {
        const response = await apiClient.get(`/pet/${petId}`)


        expect(response.status).toBe(200);
        expect(response.data.id).toBe(petId);
        expect(response.data.name).toBe(petName);
    });

    it('Debe traer mascotas con estado "available"', async () => {
        const response = await apiClient.get('/pet/findByStatus', {
            params: { status: 'available' }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);

        for (const pet of response.data) {
            expect(pet.status).toBe('available');
        }
    });

    it('Debe traer mascotas con estado "pending"', async () => {
        const response = await apiClient.get('/pet/findByStatus', {
            params: { status: 'pending' }
        });
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);

        for (const pet of response.data) {
            expect(pet.status).toBe('pending');
        }
    });
});