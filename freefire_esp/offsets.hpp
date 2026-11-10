// offsets.hpp | Windows x64 | target: Free Fire via emulator (libil2cpp.so mapped in emulator's Android VM, read through emulator host process)
// NOTE: Garena rotates these almost every patch and the libil2cpp binary is stripped/obfuscated.
// Dump fresh ones with Il2CppInspector or il2cpp-dumper against the emulator's libil2cpp.so for
// the exact client version, then replace every FILL below. These are placeholders only.
#pragma once
#include <cstdint>

namespace offsets {
    // --- module-relative offsets inside libil2cpp.so (as mapped in the emulator VM's process space) ---
    inline constexpr uintptr_t il2cpp_base_module      = 0x00000000; // FILL: base of libil2cpp.so, resolved at runtime via module enumeration
    inline constexpr uintptr_t game_assembly_domain    = 0x00000000; // FILL: offset to il2cpp_domain / static GameObjectManager singleton
    inline constexpr uintptr_t local_player_ptr_off    = 0x00000000; // FILL: static field -> LocalPlayer instance
    inline constexpr uintptr_t entity_list_ptr_off     = 0x00000000; // FILL: static field -> PlayerManager/EntityList array
    inline constexpr uintptr_t entity_list_count_off   = 0x00000000; // FILL: count field next to the array ptr
    inline constexpr uintptr_t camera_manager_off      = 0x00000000; // FILL: static field -> active Camera / CameraManager
    inline constexpr uintptr_t view_matrix_off         = 0x00000000; // FILL: Camera -> worldToCameraMatrix or equivalent 4x4

    // --- per-instance field offsets on the player/entity object ---
    inline constexpr uintptr_t entity_health_off       = 0x00000000; // FILL
    inline constexpr uintptr_t entity_team_id_off      = 0x00000000; // FILL
    inline constexpr uintptr_t entity_pos_off          = 0x00000000; // FILL: Vector3 world position (root bone or transform cache)
    inline constexpr uintptr_t entity_head_bone_off    = 0x00000000; // FILL: cached head bone world position, or bone array index for head
    inline constexpr uintptr_t entity_is_dead_off      = 0x00000000; // FILL
    inline constexpr uintptr_t entity_name_ptr_off     = 0x00000000; // FILL

    inline constexpr uintptr_t screen_width_off        = 0x00000000; // FILL: or just query emulator window client rect, simpler and more stable
    inline constexpr uintptr_t screen_height_off       = 0x00000000; // FILL
}
