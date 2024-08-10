install-server:
	npm install

install-frontend:
	cd frontend && npm install

install: install-server install-frontend

build: 
	npm run build
start: 
	npm run start