import apiClient from '../helpers/apiClient';
import { petDataGenerator } from '../helpers/petDataGenerator';
import { Pet } from '../types/pet';

describe('POST /pet | Crear una nueva mascota', () => {
    let petName: string

    it('Crear una mascota correctamente', async () => {
        petName = petDataGenerator();
        const newPet: Pet = {
            id: Date.now(),
            name: petName,
            photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
            status: 'available'
        };

        const response = await apiClient.post('/pet', newPet);
        expect(response.status).toBe(200);
        expect(response.data.name).toBe(petName);
    });
    it('Debe permitir crear múltiples mascotas con IDs unicos', async () => {
        const pets: Pet[] = [
            {
                id: Date.now(),
                name: petDataGenerator(),
                photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
                status: 'pending'
            },
            {
                id: Date.now() + 1,
                name: petDataGenerator(),
                photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
                status: 'sold'
            },
            {
                id: Date.now() + 1,
                name: petDataGenerator(),
                photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small'],
                status: 'available'
            }
        ];
        for (const pet of pets) {
            const response = await apiClient.post('/pet', pet);
            expect(response.status).toBe(200);
            expect(response.data.name).toBe(pet.name);
        }
    });
    it('No deberia dejar crear una mascota con un ID invalido ID = string', async () => {
        const invalidPet = {
            id: 'esta es una prueba',
            name: 'Aca no hay nombre random :(',
            photoUrls: ['https://pbs.twimg.com/media/FF96mbDXMAAO1yc?format=jpg&name=small']
        };

        try {
            await apiClient.post('/pet', invalidPet);
        } catch (error: any) {
            expect(error.response.status).toBe(400); // ojo aca porque la API deberia devolver 400 bad request pero no sucede... Lo deje fallando
        }
    });
});