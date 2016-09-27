install:
	npm install

develop:
	DEBUG="hexlet-servers" SERVER=${SERVER} npm run develop

lock:
	npm shrinkwrap

build:
	rm -rf dist
	npm run build

test:
	DEBUG="hexlet-servers" npm run test

lint:
	npm run eslint -- src test

publish:
	npm publish

.PHONY: test
