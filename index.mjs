import module from "./build/main.wasm";

// Enough buffer size of shared memory region;
const RET_POINTER_SIZE = 512;

// Normally TextDecoder would be nice to decode,
// But We decode manually because memories may not aligned and includes null byte in u32.
const decodeString = mem => {
  let out = "";
  for (let i = 0; i < mem.byteLength; i++) {
    // If nullbyte found, string terminated
    if (mem[i] === 0) {
      break;
    }

    // wasm32 is little endian so decode strings from lower order bits.
    out += String.fromCharCode(mem[i] & 0xFF);
    if ((mem[i] >> 8) === 0) {
      break; // string terminated
    } else if ((mem[i] >> 16) === 0) {
      out += String.fromCharCode((mem[i]  >> 8) & 0xFF);
      break; // string terminated
    } else if ((mem[i] >> 24) === 0) {
      out += String.fromCharCode((mem[i]  >> 8) & 0xFF);
      out += String.fromCharCode((mem[i]  >> 16) & 0xFF);
      break; // string terminated
    } else {
      out += String.fromCharCode((mem[i]  >> 8) & 0xFF);
      out += String.fromCharCode((mem[i]  >> 16) & 0xFF);
      out += String.fromCharCode((mem[i]  >> 24) & 0xFF);
    }
  }
  return out;
};

const encodeString = (mem, str) => {
  const u32Arr = [];
  for (let i = 0; i < str.length; i += 4) {
    let u32 = 0;
    u32 |= (str[i]) ? str[i].codePointAt(0) : 0;
    u32 |= (str[i+1]) ? (str[i+1] .codePointAt(0) << 8) : 0;
    u32 |= (str[i+2]) ? (str[i+2] .codePointAt(0) << 16) : 0;
    u32 |= (str[i+3]) ? (str[i+3] .codePointAt(0) << 24) : 0;
    u32Arr.push(u32);
  }
  mem.subarray(0, u32Arr.length).set(u32Arr);
  return 0;
}


export default {
  async fetch(request, env) {
    const {
      exports: {
        memory,
        hello,
        greet,
        add,
      },
    } = new WebAssembly.Instance(module, {});
    const mem = new Uint32Array(memory.buffer);
    const url = new URL(request.url);
    let pointer, offset, body;

    switch (url.pathname) {

      // Call greet(), /greet?name=[name]
      case "/greet":
        const name = url.searchParams.get("name") || "Zig";
        const arg = encodeString(mem, name);
        pointer = greet(arg);
        offset = pointer - (pointer%4);
        body = decodeString(new Uint32Array(memory.buffer, offset, RET_POINTER_SIZE));
        break;

      // Call add()
      case "/add":
        const result = add(1 + 2);
        body = `add() example, 1 + 2 = ${result}`;
        break;

      // Call hello()
      case "/":
        pointer = hello();
        offset = pointer - (pointer%4);
        body = decodeString(new Uint32Array(memory.buffer, offset, RET_POINTER_SIZE));
        break;

      // Not Found :-P
      default:
        return new Response("Not Found", {
          status: 404,
        });
    }

    return new Response(body);
  }
}
