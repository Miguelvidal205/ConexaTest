Health Check que se puede ejecutar periodicamente y validar el estado de las API
![image](https://github.com/user-attachments/assets/e8107910-e386-44a2-b183-15e087794569)

Detalles del run de Jest en la terminal. Algunos estan fallando porque esperan 200 y por lo inestable de la API a veces devuelve 404. En otros casos se espera un 404 y la API devuelve 500 lo que indica que no estan bien manejadas las excepciones
![image](https://github.com/user-attachments/assets/394bcdb2-17e1-498e-a44f-be93fa27643d)

Load test con K6 y JS. Es un pequeno dashboard que muestra la cantidad de respuestas segun cada endpoint. Esta muy sencillo aun, con algo de tiempo, se podrian agregar muchisimos mas detalles o integrarlo directamente con Grafana.
![image](https://github.com/user-attachments/assets/6687d71d-365e-42a3-8903-ba0984027bc5)
