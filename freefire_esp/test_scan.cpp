// test_scan.cpp | C++17 | standalone harness to validate guest_scan.hpp against the live LDPlayer9 process
#include <windows.h>
#include <iostream>
#include "memory.hpp"
#include "guest_scan.hpp"

int main() {
    process_memory mem;
    bool attached = mem.attach(L"Ld9BoxHeadless.exe") || mem.attach(L"dnplayer.exe");
    if (!attached) {
        std::cout << "FAIL: could not attach. Run this as Administrator.\n";
        return 1;
    }
    std::cout << "attached, pid=" << mem.pid() << "\n";

    guest_scanner scanner(mem, mem.handle());
    auto t0 = GetTickCount64();
    auto base = scanner.find_module("libil2cpp.so");
    auto t1 = GetTickCount64();

    if (base) {
        std::cout << "FOUND libil2cpp.so at 0x" << std::hex << *base << std::dec
                  << " in " << (t1 - t0) << " ms\n";
    } else {
        std::cout << "NOT FOUND (took " << (t1 - t0) << " ms). "
                     "Likely Free Fire's Unity runtime isn't loaded yet (still on Garena launcher/loading screen).\n";
    }
    return 0;
}
