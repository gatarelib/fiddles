let x = '../out/main.wasm';

let memoryStates = new WeakMap();

function syscall(instance, n, args) {
  switch (n) {
    default:
      // console.log("Syscall " + n + " NYI.");
      break;
    case /* brk */ 45: return 0;
    case /* writev */ 146:
      return instance.exports.writev_c(args[0], args[1], args[2]);
    case /* mmap2 */ 192:
      debugger;
      const memory = instance.exports.memory;
      let memoryState = memoryStates.get(instance);
      const requested = args[1];
      if (!memoryState) {
        memoryState = {
          object: memory,
          currentPosition: memory.buffer.byteLength,
        };
        memoryStates.set(instance, memoryState);
      }
      let cur = memoryState.currentPosition;
      if (cur + requested > memory.buffer.byteLength) {
        const need = Math.ceil((cur + requested - memory.buffer.byteLength) / 65536);
        memory.grow(need);
      }
      memoryState.currentPosition += requested;
      return cur;
  }
}

async function test(path) {
  let s = "";
  const wait = fetch(path);
  const response = await wait;
  const bytes = await response.arrayBuffer();
  let imports = {
    env: {
      mem: memory,
      __syscall0: function __syscall0(n) { return syscall(instance, n, []); },
      __syscall1: function __syscall1(n, a) { return syscall(instance, n, [a]); },
      __syscall2: function __syscall2(n, a, b) { return syscall(instance, n, [a, b]); },
      __syscall3: function __syscall3(n, a, b, c) { return syscall(instance, n, [a, b, c]); },
      __syscall4: function __syscall4(n, a, b, c, d) { return syscall(instance, n, [a, b, c, d]); },
      __syscall5: function __syscall5(n, a, b, c, d, e) { return syscall(instance, n, [a, b, c, d, e]); },
      __syscall6: function __syscall6(n, a, b, c, d, e, f) { return syscall(instance, n, [a, b, c, d, e, f]); },
      putc_js: function (c) {
        c = String.fromCharCode(c);
        if (c == "\n") {
          console.log(s);
          s = "";
        } else {
          s += c;
        }
      }
    }
  }
  const results = await WebAssembly.instantiate(bytes, imports);
  const instance = results.instance;
  const acc = results.instance.exports.accumulate(0,3);
  console.log(acc);
  document.getElementById("container").innerText = results.instance.exports.main();

}

let memory = new WebAssembly.Memory({initial:2, maximum:100});
// new Uint32Array(memory.buffer).set([1, 2, 3]);

/*
let i32 = new Uint32Array(memory.buffer);
for (let i = 0; i < 10; i++) {
  i32[i] = i;
}
*/

test(x);