# workers-template-zig

Run your Zig code in Cloudflare Workers!

## Requirements

- `zig` - To compile wasm from Zig, see [installtion](https://ziglang.org/learn/getting-started/#installing-zig)

Note that this project is just example, only checked in darwin arm64.

## Usage

```
Note:
This project uses wrangler v2 so install and build locally.
If you use @cloudflare/wrangler, please take care of conflict of global installation.
```

```sh
# Checkout project
$ git clone https://github.com/ysugimoto/workers-template-zig.git
$ cd workers-template-zig

# Install dependencies
$ yarn install

# Run local worker
# Note this project uses local installed wrangler(v2) command
$ yarn wranger dev
```

Then you can see the worker works on http://localhost:8787 . Example contains three exported functions which can access via path:

| URL    | WASM function definition   | example implementation                                            |
|:=======|:===========================|:==================================================================|
| /      | string hello()             | Return string from WASM                                           |
| /add   | number add(number, number) | Receive a couple of number arguments and return integer from WASM |
| /greet | string greet(string)       | Receive string argument and return formatted string from WASM     |

## License

MIT

## Author

ysugimoto

