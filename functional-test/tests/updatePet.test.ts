import apiClient from '../helpers/apiClient';
import { Pet } from '../types/pet';
import { petDataGenerator } from '../helpers/petDataGenerator';

describe('PUT /pet | Actualizar mascota existente', () => {
    let petId: number;
    let originalName: string;

    beforeAll(async () => {
        petId = Date.now();
        originalName = petDataGenerator();

        const newPet: Pet = {
            id: petId,
            name: originalName,
            photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
            status: 'available'
        };
        const response = await apiClient.post('/pet', newPet);
        expect(response.status).toBe(200);
    });

    it('Deberia actualizar el nombre de una mascota existente', async () => {
        const updatedPet: Pet = {
            id: petId,
            name: petDataGenerator(),
            photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
            status: 'pending'
        };
        const response = await apiClient.put('/pet', updatedPet);
        expect(response.status).toBe(200);
        expect(response.data.name).toBe(updatedPet.name);
        expect(response.data.status).toBe('pending');
    });
    it('Debe devolver error al actualizar sin ID', async () => {
        const invalidUpdate = {
            name: 'esto no tiene un id',
            photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
            status: 'sold'
        };
        const response = await apiClient.put('/pet', invalidUpdate).catch(err => err.response);
        expect(response.status).toBe(400); // este tambien esta muy raro... si no envio nada en el ID deja uno por default "id": 9223372036854775807 Hay que revisar en el codigo si dejaron una condicion por default
    });
});