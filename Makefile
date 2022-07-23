.PHONY: build clean

build:
	mkdir build || true
	rm -rf ./src/*.wasm ./src/zig-cache
	cd src && zig build-lib \
		main.zig \
		-target wasm32-wasi-musl \
		-OReleaseSmall \
		-dynamic
	mv src/main.wasm  ./build/

clean:
	rm -rf worker build
