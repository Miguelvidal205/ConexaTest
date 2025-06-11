import apiClient from '../helpers/apiClient';
import { Pet } from '../types/pet';
import { petDataGenerator } from '../helpers/petDataGenerator';
import { waitCreatePet } from '../helpers/waitCreatePet';

describe.only('DELETE /pet/{petId} - Eliminar mascota por ID', () => {
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
    }, 15000);

    it('Debe eliminar una mascota existente', async () => {
        const response = await apiClient.delete(`/pet/${petId}`).catch(err => err.response);
        console.log(response)
        expect(response.status).toBe(200);
    }, 15000);

    it('debería devolver 404 al intentar eliminar una mascota inexistente', async () => {
        const nonexistentId = 999999999999;

        const response = await apiClient.delete(`/pet/${nonexistentId}`).catch(err => err.response);
        expect(response.status).toBe(404);
    });

    it('debería devolver error al intentar eliminar con ID inválido', async () => {
        const response = await apiClient.delete('/pet/invalid-id').catch(err => err.response);
        expect(response.status).toBeGreaterThanOrEqual(400);
    });
});
