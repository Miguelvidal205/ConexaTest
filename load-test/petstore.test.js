// load - test / allEndpointsStatusCheck.test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
    vus: 10,
    duration: '20s',
};

// Contadores personalizados por status code
const statusCounts = {};

function trackStatus(status) {
    const key = `status_${status}_count`;
    if (!statusCounts[key]) {
        statusCounts[key] = new Counter(key);
    }
    statusCounts[key].add(1);
}

const BASE_URL = 'https://petstore.swagger.io/v2';

export default function () {
    // GET by ID (válido o inválido)
    const petId = Math.floor(Math.random() * 100) + 1000000000;
    const getRes = http.get(`${BASE_URL}/pet/${petId}`);
    trackStatus(getRes.status);

    // POST crear mascota
    const newPet = {
        id: Date.now(),
        name: `dog-${Date.now()}`,
        photoUrls: ['https://img.pet/sample.jpg'],
        status: 'available'
    };
    const postRes = http.post(`${BASE_URL}/pet`, JSON.stringify(newPet), {
        headers: { 'Content-Type': 'application/json', 'api_key': 'special-key' },
    });
    trackStatus(postRes.status);

    // PUT actualizar mascota
    const updatedPet = { ...newPet, name: newPet.name + '-updated' };
    const putRes = http.put(`${BASE_URL}/pet`, JSON.stringify(updatedPet), {
        headers: { 'Content-Type': 'application/json', 'api_key': 'special-key' },
    });
    trackStatus(putRes.status);

    // DELETE mascota
    const delRes = http.del(`${BASE_URL}/pet/${newPet.id}`, null, {
        headers: { 'api_key': 'special-key' },
    });
    trackStatus(delRes.status);

    sleep(1);
}
