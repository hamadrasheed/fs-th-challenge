

### Pre-requisities:
* Docker
* Docker Compose


## Getting Started with Docker

1. Install composer 
    ```sh
    docker-compose run --rm composer install
    ```
2. Install npm (you can use yarn)
    ```sh
    docker-compose run --rm npm install
    ```
3. Migrate database
    ```sh
    docker-compose run --rm laravel-migrate-seed
    ```
4. Regenerate key apps
    ```sh
    docker-compose run --rm artisan key:generate
    ```
5. Optimized apps (config & routes cache)
    ```sh
    docker-compose run --rm artisan optimize
    ```
6. Build the frontend assets
    ```sh
    docker-compose run --rm --service-ports npm run build
    ```
7. Last but not least, run the server in backround
    ```sh
    docker-compose up --build nginx -d
    ```
8. Open it on your browser 
    - [x] http://localhost:8000 (Main Apps)
    - [x] http://localhost:8888 (phpMyAdmin)

## Getting Started without Docker
Follow this step guide to prepare the requirement system before using the apps
1. Download and install [Composer](https://getcomposer.org/)
2. Download and install [NodeJS](https://nodejs.org/en/download)
3. Clone this repo
    ```sh
   git clone https://github.com/hamadrasheed/fs-th-challenge
   ```
3. Install the composer required packages
    ```sh
   composer install
   ```
4. Install the node required packages
    ```sh
   npm i
   ```
   or if using yarn
    ```sh
   yarn install
   ```
5. Copy ``.env.example`` file and rename it to ``.env`` 
6. Adjust ``.env`` file based on your device environment and don't forget to put your Mailtrap credentials and the NewsAPI key as well
7. Make sure your mysql is run properly and run this command
    ```sh
   php artisan migrate:fresh --seed
   ```
8. Run the backend
    ```sh
   php artisan serve
   ```
9. Open new terminal session without closing the previous one and run this command
    ```sh
   npm run dev
   ```
   or if using yarn
    ```sh
   yarn run dev
   ```
10. Open it on your browser (http://localhost:8000)

