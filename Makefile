devpod:
	devpod up .
	devpod ssh lmst
dev:
	npx vite
type:
	npx tsc --noEmit
size:
	npx vite build
	npx size-limit
test:
	npx tap
