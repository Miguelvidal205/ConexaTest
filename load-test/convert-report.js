const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('report.json', 'utf8'));
const metrics = raw.metrics;

// Totales por código
let total200 = 0;
let total404 = 0;
let total500 = 0;
const per_endpoint = {};

for (const name in metrics) {
    if (name.includes('_status_')) {
        const count = metrics[name].count || 0;
        if (name.endsWith('_status_200')) total200 += count;
        if (name.endsWith('_status_404')) total404 += count;
        if (name.endsWith('_status_500')) total500 += count;
        per_endpoint[name] = count;
    }
}

const result = {
    status_200_count: total200,
    status_404_count: total404,
    status_500_count: total500,
    inconsistent_response_count: metrics.checks?.fails || 0,
    checks_total: (metrics.checks?.passes || 0) + (metrics.checks?.fails || 0),
    per_endpoint
};

fs.writeFileSync('clean-report.json', JSON.stringify(result, null, 2));
console.log('✅ clean-report.json generado');
