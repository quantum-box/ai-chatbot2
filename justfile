up:
    docker compose up -d
    until mysql -h 127.0.0.1 -P 3306 -u root -proot -e "status" > /dev/null 2>&1; do echo "Waiting for MySQL to be available..."; sleep 2; done
    yarn migrate
    yarn dev

down:
    docker compose down

down-all:
    docker compose down -v
