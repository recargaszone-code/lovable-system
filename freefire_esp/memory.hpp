// memory.hpp | C++17 | Windows 11 | target: external process memory access to the emulator hosting Free Fire
#pragma once
#include <windows.h>
#include <tlhelp32.h>
#include <string>
#include <vector>
#include <optional>
#include <cstdint>

class process_memory {
public:
    bool attach(const std::wstring& process_name) {
        PROCESSENTRY32W entry{ sizeof(entry) };
        HANDLE snap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (snap == INVALID_HANDLE_VALUE) return false;

        bool found = false;
        if (Process32FirstW(snap, &entry)) {
            do {
                if (process_name == entry.szExeFile) {
                    pid_ = entry.th32ProcessID;
                    found = true;
                    break;
                }
            } while (Process32NextW(snap, &entry));
        }
        CloseHandle(snap);
        if (!found) return false;

        // PROCESS_VM_READ + PROCESS_QUERY_INFORMATION is enough for a read-only ESP.
        // Aimbot only needs SendInput (no handle to the target process required).
        handle_ = OpenProcess(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION, FALSE, pid_);
        return handle_ != nullptr;
    }

    std::optional<uintptr_t> module_base(const std::wstring& module_name) const {
        MODULEENTRY32W entry{ sizeof(entry) };
        HANDLE snap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE | TH32CS_SNAPMODULE32, pid_);
        if (snap == INVALID_HANDLE_VALUE) return std::nullopt;

        std::optional<uintptr_t> result;
        if (Module32FirstW(snap, &entry)) {
            do {
                if (module_name == entry.szModule) {
                    result = reinterpret_cast<uintptr_t>(entry.modBaseAddr);
                    break;
                }
            } while (Module32NextW(snap, &entry));
        }
        CloseHandle(snap);
        return result;
    }

    template <typename T>
    T read(uintptr_t address) const {
        T value{};
        ReadProcessMemory(handle_, reinterpret_cast<LPCVOID>(address), &value, sizeof(T), nullptr);
        return value;
    }

    bool read_raw(uintptr_t address, void* out, size_t size) const {
        SIZE_T read_bytes = 0;
        return ReadProcessMemory(handle_, reinterpret_cast<LPCVOID>(address), out, size, &read_bytes) && read_bytes == size;
    }

    // chains a series of offsets, dereferencing a pointer at each step except the last
    uintptr_t read_chain(uintptr_t base, const std::vector<uintptr_t>& offsets) const {
        uintptr_t addr = base;
        for (size_t i = 0; i < offsets.size(); ++i) {
            addr += offsets[i];
            if (i != offsets.size() - 1)
                addr = read<uintptr_t>(addr);
        }
        return addr;
    }

    bool valid() const { return handle_ != nullptr; }
    DWORD pid() const { return pid_; }
    HANDLE handle() const { return handle_; }

    ~process_memory() {
        if (handle_) CloseHandle(handle_);
    }

private:
    HANDLE handle_ = nullptr;
    DWORD pid_ = 0;
};

struct vec3 { float x, y, z; };
struct vec2 { float x, y; };

struct matrix4x4 { float m[4][4]; };

// standard perspective world->screen, works for Unity's worldToCameraMatrix * projectionMatrix combo
inline bool world_to_screen(const vec3& world, const matrix4x4& view_proj, int screen_w, int screen_h, vec2& out) {
    float clip_x = world.x * view_proj.m[0][0] + world.y * view_proj.m[1][0] + world.z * view_proj.m[2][0] + view_proj.m[3][0];
    float clip_y = world.x * view_proj.m[0][1] + world.y * view_proj.m[1][1] + world.z * view_proj.m[2][1] + view_proj.m[3][1];
    float clip_w = world.x * view_proj.m[0][3] + world.y * view_proj.m[1][3] + world.z * view_proj.m[2][3] + view_proj.m[3][3];

    if (clip_w < 0.1f) return false; // behind camera

    float ndc_x = clip_x / clip_w;
    float ndc_y = clip_y / clip_w;

    out.x = (screen_w / 2.0f) * (1.0f + ndc_x);
    out.y = (screen_h / 2.0f) * (1.0f - ndc_y);
    return true;
}
