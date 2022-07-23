import module from "./build/main.wasm";

// Same as return char size of hello_world()
const RET_POINTER_SIZE = 64;

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

export default {
  async fetch(request, env) {
    const {
      exports: {
        memory,
        hello_world,
      },
    } = new WebAssembly.Instance(module, {});
    const pointer = hello_world();
    const mem = new Uint32Array(memory.buffer, pointer - (pointer % 4), RET_POINTER_SIZE);
    const result = decodeString(mem);

    return new Response(result);
  }
}
