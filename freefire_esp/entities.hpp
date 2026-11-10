// entities.hpp | C++17 | reads the Free Fire player/entity list through the emulator's process memory
#pragma once
#include "memory.hpp"
#include "offsets.hpp"
#include <vector>
#include <string>

struct game_entity {
    uintptr_t address = 0;
    vec3 position{};
    vec3 head_position{};
    int health = 0;
    int team_id = -1;
    bool is_dead = false;
    bool is_local = false;
    std::string name;
    vec2 screen_pos{};
    bool on_screen = false;
    float distance = 0.0f;
};

class entity_reader {
public:
    explicit entity_reader(process_memory& mem) : mem_(mem) {}

    bool refresh_base(uintptr_t il2cpp_base) {
        il2cpp_base_ = il2cpp_base;
        return il2cpp_base_ != 0;
    }

    matrix4x4 read_view_proj() const {
        uintptr_t cam = mem_.read<uintptr_t>(il2cpp_base_ + offsets::camera_manager_off);
        return mem_.read<matrix4x4>(cam + offsets::view_matrix_off);
    }

    vec3 read_local_position() const {
        uintptr_t local = mem_.read<uintptr_t>(il2cpp_base_ + offsets::local_player_ptr_off);
        return mem_.read<vec3>(local + offsets::entity_pos_off);
    }

    std::vector<game_entity> read_entities(const vec3& local_pos) const {
        std::vector<game_entity> result;

        uintptr_t list_ptr = mem_.read<uintptr_t>(il2cpp_base_ + offsets::entity_list_ptr_off);
        int count = mem_.read<int>(il2cpp_base_ + offsets::entity_list_count_off);
        if (list_ptr == 0 || count <= 0 || count > 128) return result; // sanity bound, stale/garbage pointer guard

        result.reserve(count);
        for (int i = 0; i < count; ++i) {
            uintptr_t entity_ptr = mem_.read<uintptr_t>(list_ptr + i * sizeof(uintptr_t));
            if (entity_ptr == 0) continue;

            game_entity e;
            e.address = entity_ptr;
            e.health = mem_.read<int>(entity_ptr + offsets::entity_health_off);
            e.team_id = mem_.read<int>(entity_ptr + offsets::entity_team_id_off);
            e.is_dead = mem_.read<uint8_t>(entity_ptr + offsets::entity_is_dead_off) != 0;
            e.position = mem_.read<vec3>(entity_ptr + offsets::entity_pos_off);
            e.head_position = mem_.read<vec3>(entity_ptr + offsets::entity_head_bone_off);

            if (e.is_dead || e.health <= 0) continue;

            float dx = e.position.x - local_pos.x;
            float dy = e.position.y - local_pos.y;
            float dz = e.position.z - local_pos.z;
            e.distance = std::sqrt(dx * dx + dy * dy + dz * dz);

            result.push_back(e);
        }
        return result;
    }

private:
    process_memory& mem_;
    uintptr_t il2cpp_base_ = 0;
};
