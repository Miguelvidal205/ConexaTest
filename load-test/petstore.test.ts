import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
    vus: 10,
    duration: '15s',
};

// 🧮 Métricas personalizadas
const successCount = new Counter('status_200_count');
const notFoundCount = new Counter('status_404_count');
const inconsistentCount = new Counter('inconsistent_response_count');

// 🔁 Lista de IDs que sabés que existen
const existingIds = [1234, 12345, 123456];

export default function () {
    const petId = existingIds[Math.floor(Math.random() * existingIds.length)];

    const res = http.get(`https://petstore.swagger.io/v2/pet/${petId}`);

    const is200 = res.status === 200;
    const is404 = res.status === 404;

    if (is200) {
        successCount.add(1);
    } else if (is404) {
        notFoundCount.add(1);
        inconsistentCount.add(1);
    }

    check(res, {
        'status is 200 or 404': () => is200 || is404,
    });

    sleep(1);
}
