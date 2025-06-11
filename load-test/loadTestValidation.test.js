const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, 'clean-report.json');
const htmlPath = path.resolve(__dirname, 'k6-status-report.html');

describe('Validación del Load Test', () => {
  const result = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  // aca estaria bueno hacer algunas validaciones extras de tiempos de esperas minimos, cantidad de fallas, etc...

  it('Genera el HTML', () => {
    const rows = Object.entries(result.per_endpoint || {})
      .map(([key, count]) => {
        const [endpoint, status] = key.split('_status_');
        return `<tr><td>${endpoint}</td><td>${status}</td><td>${count}</td></tr>`;
      })
      .join('\n');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Reporte Load Test</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 80%; border-collapse: collapse; margin: 20px auto; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
          h2, h3 { text-align: center; }
        </style>
      </head>
      <body>
        <h2>Resumen General</h2>
        <table>
          <tr><th>Métrica</th><th>Valor</th></tr>
          <tr><td>Status 200</td><td>${result.status_200_count}</td></tr>
          <tr><td>Status 404</td><td>${result.status_404_count}</td></tr>
          <tr><td>Status 500</td><td>${result.status_500_count}</td></tr>
          <tr><td>Inconsistencias</td><td>${result.inconsistent_response_count}</td></tr>
          <tr><td>Total Checks</td><td>${result.checks_total}</td></tr>
        </table>

        <h3>Detalle por Endpoint</h3>
        <table>
          <tr><th>Endpoint</th><th>Status</th><th>Cantidad</th></tr>
          ${rows}
        </table>
      </body>
      </html>
    `.trim();

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('✅ HTML generado');
  });
});
