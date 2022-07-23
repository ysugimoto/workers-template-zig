// index.mjs
import module from "./build/main.wasm";
var RET_POINTER_SIZE = 64;
var decodeString = (mem) => {
  let out = "";
  for (let i = 0; i < mem.byteLength; i++) {
    if (mem[i] === 0) {
      break;
    }
    out += String.fromCharCode(mem[i] & 255);
    if (mem[i] >> 8 === 0) {
      break;
    } else if (mem[i] >> 16 === 0) {
      out += String.fromCharCode(mem[i] >> 8 & 255);
      break;
    } else if (mem[i] >> 24 === 0) {
      out += String.fromCharCode(mem[i] >> 8 & 255);
      out += String.fromCharCode(mem[i] >> 16 & 255);
      break;
    } else {
      out += String.fromCharCode(mem[i] >> 8 & 255);
      out += String.fromCharCode(mem[i] >> 16 & 255);
      out += String.fromCharCode(mem[i] >> 24 & 255);
    }
  }
  return out;
};
var workers_template_zig_default = {
  async fetch(request, env) {
    const {
      exports: {
        memory,
        hello_world
      }
    } = new WebAssembly.Instance(module, {});
    const pointer = hello_world();
    const mem = new Uint32Array(memory.buffer, pointer - pointer % 4, RET_POINTER_SIZE);
    const result = decodeString(mem);
    return new Response(result);
  }
};
export {
  workers_template_zig_default as default
};
