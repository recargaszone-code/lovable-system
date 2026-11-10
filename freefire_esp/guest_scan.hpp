// guest_scan.hpp | C++17 | finds libil2cpp.so's load base inside a VirtualBox-backed emulator's guest RAM blob
//
// LDPlayer9's Android guest isn't exposed as Windows modules in Ld9BoxHeadless.exe (confirmed live:
// Module32First/Next never shows libil2cpp.so there). The guest's physical RAM is just a handful of
// large anonymous VirtualAlloc'd regions inside that process. Strategy:
//   1. VirtualQueryEx over the whole address space, keep MEM_COMMIT|readable regions above a size floor
//      (guest RAM is typically one or a few blocks in the hundreds-of-MB range).
//   2. Inside those regions, probe every page-aligned address for the ELF magic (cheap 4-byte read).
//   3. On a magic hit, parse the ELF64 header + program headers, locate PT_DYNAMIC, walk its DT_STRTAB/
//      DT_SONAME entries and read the actual soname string to confirm it's really "libil2cpp.so" (ELF
//      magic alone matches hundreds of unrelated libs in the guest, so this check is mandatory).
#pragma once
#include "memory.hpp"
#include <vector>
#include <string>
#include <optional>
#include <cstdint>

namespace elf {
    constexpr uint8_t magic[4] = { 0x7F, 'E', 'L', 'F' };
    constexpr int CLASS64 = 2;
    constexpr int ET_DYN = 3;
    constexpr int PT_DYNAMIC = 2;
    constexpr int64_t DT_NULL = 0;
    constexpr int64_t DT_STRTAB = 5;
    constexpr int64_t DT_SONAME = 14;

#pragma pack(push, 1)
    struct ehdr64 {
        uint8_t  e_ident[16];
        uint16_t e_type;
        uint16_t e_machine;
        uint32_t e_version;
        uint64_t e_entry;
        uint64_t e_phoff;
        uint64_t e_shoff;
        uint32_t e_flags;
        uint16_t e_ehsize;
        uint16_t e_phentsize;
        uint16_t e_phnum;
        uint16_t e_shentsize;
        uint16_t e_shnum;
        uint16_t e_shstrndx;
    };

    struct phdr64 {
        uint32_t p_type;
        uint32_t p_flags;
        uint64_t p_offset;
        uint64_t p_vaddr;
        uint64_t p_paddr;
        uint64_t p_filesz;
        uint64_t p_memsz;
        uint64_t p_align;
    };

    struct dyn64 {
        int64_t d_tag;
        uint64_t d_val;
    };
#pragma pack(pop)
}

class guest_scanner {
public:
    explicit guest_scanner(process_memory& mem, HANDLE process_handle)
        : mem_(mem), handle_(process_handle) {}

    // returns the in-process address where libil2cpp.so's ELF header (load base) sits
    std::optional<uintptr_t> find_module(const std::string& module_name, size_t min_region_size = 64ull * 1024 * 1024) {
        for (const auto& region : enumerate_committed_regions(min_region_size)) {
            auto hit = scan_region(region, module_name);
            if (hit) return hit;
        }
        return std::nullopt;
    }

private:
    struct region_t { uintptr_t base; size_t size; };

    std::vector<region_t> enumerate_committed_regions(size_t min_size) const {
        std::vector<region_t> regions;
        MEMORY_BASIC_INFORMATION mbi{};
        uintptr_t addr = 0;
        SYSTEM_INFO si{};
        GetSystemInfo(&si);
        uintptr_t max_addr = reinterpret_cast<uintptr_t>(si.lpMaximumApplicationAddress);

        while (addr < max_addr && VirtualQueryEx(handle_, reinterpret_cast<LPCVOID>(addr), &mbi, sizeof(mbi)) == sizeof(mbi)) {
            bool readable = (mbi.State == MEM_COMMIT) &&
                (mbi.Protect & (PAGE_READWRITE | PAGE_READONLY | PAGE_EXECUTE_READ | PAGE_EXECUTE_READWRITE)) &&
                !(mbi.Protect & PAGE_GUARD);

            if (readable && mbi.RegionSize >= min_size) {
                regions.push_back({ reinterpret_cast<uintptr_t>(mbi.BaseAddress), mbi.RegionSize });
            }
            addr = reinterpret_cast<uintptr_t>(mbi.BaseAddress) + mbi.RegionSize;
        }
        return regions;
    }

    std::optional<uintptr_t> scan_region(const region_t& region, const std::string& module_name) const {
        constexpr size_t page = 0x1000;
        for (uintptr_t off = 0; off < region.size; off += page) {
            uintptr_t candidate = region.base + off;

            uint8_t magic_buf[4];
            if (!mem_.read_raw(candidate, magic_buf, sizeof(magic_buf))) continue;
            if (memcmp(magic_buf, elf::magic, 4) != 0) continue;

            auto soname = read_soname(candidate);
            if (soname && *soname == module_name) return candidate;
        }
        return std::nullopt;
    }

    std::optional<std::string> read_soname(uintptr_t base) const {
        elf::ehdr64 eh{};
        if (!mem_.read_raw(base, &eh, sizeof(eh))) return std::nullopt;
        if (eh.e_ident[4] != elf::CLASS64) return std::nullopt;       // only chasing 64-bit libs here
        if (eh.e_type != elf::ET_DYN) return std::nullopt;            // il2cpp is always a shared object
        if (eh.e_phnum == 0 || eh.e_phnum > 64) return std::nullopt;  // sanity bound

        std::vector<elf::phdr64> phdrs(eh.e_phnum);
        if (!mem_.read_raw(base + eh.e_phoff, phdrs.data(), sizeof(elf::phdr64) * eh.e_phnum)) return std::nullopt;

        uint64_t dyn_vaddr = 0, dyn_size = 0;
        for (auto& ph : phdrs) {
            if (ph.p_type == static_cast<uint32_t>(elf::PT_DYNAMIC)) {
                dyn_vaddr = ph.p_vaddr;
                dyn_size = ph.p_filesz;
                break;
            }
        }
        if (dyn_vaddr == 0 || dyn_size == 0 || dyn_size > 0x10000) return std::nullopt;

        size_t dyn_count = dyn_size / sizeof(elf::dyn64);
        std::vector<elf::dyn64> dyns(dyn_count);
        if (!mem_.read_raw(base + dyn_vaddr, dyns.data(), sizeof(elf::dyn64) * dyn_count)) return std::nullopt;

        uint64_t strtab_vaddr = 0;
        int64_t soname_off = -1;
        for (auto& d : dyns) {
            if (d.d_tag == elf::DT_STRTAB) strtab_vaddr = d.d_val;
            else if (d.d_tag == elf::DT_SONAME) soname_off = static_cast<int64_t>(d.d_val);
            else if (d.d_tag == elf::DT_NULL) break;
        }
        if (strtab_vaddr == 0 || soname_off < 0) return std::nullopt;

        char name_buf[128]{};
        if (!mem_.read_raw(base + strtab_vaddr + soname_off, name_buf, sizeof(name_buf) - 1)) return std::nullopt;
        return std::string(name_buf);
    }

    process_memory& mem_;
    HANDLE handle_;
};
