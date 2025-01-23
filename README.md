# Chatbot Ists

Chatbot del Instituto Superior Tecnológico Sudamericano.

## Requisitos

- [Node.js](https://nodejs.org/en/download/)(+20)
- [Docker](https://www.docker.com/get-started)

## Instalación

1. Clona este repositorio:

        git clone https://github.com/ccxnu/app-denver.git
        cd app-denver

2. Instala las dependencias:

        npm install

3. Configura las variables de entorno. Crea un archivo `.env` basado en `.env.example` y ajusta los valores según sea necesario.

4. Levanta el proyecto con:

        bash deploy.sh

## Uso

### Compilar con SWC

Este proyecto está configurado para utilizar [SWC](https://swc.rs/) para compilar TypeScript rápidamente. Para compilar el proyecto:

        npm run build

### Migraciones con Kysely

Las migraciones de base de datos se gestionan con Kysely. Para correr las migraciones:

        npm run migrate

## Licencia

Este proyecto está bajo la licencia MIT.
