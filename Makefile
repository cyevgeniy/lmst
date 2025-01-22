devpod:
	devpod up .
	devpod ssh lmst
dev:
	npx vite
size:
	npx vite build
	npx size-limit
test:
	npx tap
