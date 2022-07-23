const std = @import("std");

const str = "Hello Zig on Cloudflare Worker!";

export fn hello_world() callconv(.C) *const [64]u8 {
    var ret: [64]u8 = undefined;
    std.mem.copy(u8, ret[0..str.len], str);
    return &ret;
}
