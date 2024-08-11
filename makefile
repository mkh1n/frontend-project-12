install-server:
	npm install

install-frontend:
	cd frontend && npm install

install: install-server install-frontend

lint:
	npm run lint

lint-fix:
	npm run lint:fix

build: 
	npm run build

start: 
	npm run start