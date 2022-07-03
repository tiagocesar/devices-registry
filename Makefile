all: test run

test:
	npm test

run:
	docker compose up -d
	npm run build
	npm run start

clean:
	docker compose down
