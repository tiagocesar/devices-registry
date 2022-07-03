all: test run

test:
	npm test

run:
	docker compose down
	docker compose up -d
	npm start