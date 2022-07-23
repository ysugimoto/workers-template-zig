const std = @import("std");

const str = "Hello Zig on Cloudflare Worker!";

export fn hello() callconv(.C) *const [64]u8 {
    var buf: [64]u8 = undefined;
    std.mem.copy(u8, buf[0..str.len], str);
    return &buf;
}

export fn greet(name: *const [64]u8) callconv(.C) *const [512]u8 {
    var ret: [512]u8 = undefined;
    if (std.fmt.bufPrint(ret[0..], "Hello, {s}!", .{name.*})) {
        return &ret;
    } else |err| switch (err) {
        std.fmt.BufPrintError.NoSpaceLeft => {},
    }
    return &ret;
}

export fn add(a: i32, b: i32) callconv(.C) i32 {
    return a + b;
}
