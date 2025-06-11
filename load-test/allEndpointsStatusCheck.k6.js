import http from 'k6/http';
import { sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
    vus: 10,
    duration: '10s',
};

// Contadores por endpoint + status (con nombres válidos para K6)
export const get_pet_id_status_404 = new Counter('get_pet_id_status_404');
export const delete_pet_id_status_200 = new Counter('delete_pet_id_status_200');
export const delete_pet_id_status_404 = new Counter('delete_pet_id_status_404');
export const put_pet_status_200 = new Counter('put_pet_status_200');
export const post_pet_status_200 = new Counter('post_pet_status_200');

function track(name, status) {
    const label = `${name}_status_${status}`;
    switch (label) {
        case 'get_pet_id_status_404': get_pet_id_status_404.add(1); break;
        case 'delete_pet_id_status_200': delete_pet_id_status_200.add(1); break;
        case 'delete_pet_id_status_404': delete_pet_id_status_404.add(1); break;
        case 'put_pet_status_200': put_pet_status_200.add(1); break;
        case 'post_pet_status_200': post_pet_status_200.add(1); break;
    }
}

const BASE_URL = 'https://petstore.swagger.io/v2';

export default function () {
    const petId = Math.floor(Math.random() * 100) + 1000000000;

    const getRes = http.get(`${BASE_URL}/pet/${petId}`);
    track('get_pet_id', getRes.status);

    const newPet = {
        id: Date.now(),
        name: `dog-${Date.now()}`,
        photoUrls: ['https://img.pet/sample.jpg'],
        status: 'available'
    };

    const postRes = http.post(`${BASE_URL}/pet`, JSON.stringify(newPet), {
        headers: { 'Content-Type': 'application/json', 'api_key': 'special-key' },
    });
    track('post_pet', postRes.status);

    const updatedPet = { ...newPet, name: newPet.name + '-updated' };
    const putRes = http.put(`${BASE_URL}/pet`, JSON.stringify(updatedPet), {
        headers: { 'Content-Type': 'application/json', 'api_key': 'special-key' },
    });
    track('put_pet', putRes.status);

    const delRes = http.del(`${BASE_URL}/pet/${newPet.id}`, null, {
        headers: { 'api_key': 'special-key' },
    });
    track('delete_pet_id', delRes.status);

    sleep(1);
}
