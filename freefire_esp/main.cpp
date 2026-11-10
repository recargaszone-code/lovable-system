// main.cpp | C++17 | Windows 11, MSVC | target: external ESP + aimbot overlay for Free Fire (PC emulator build)
// Requires Dear ImGui (docking or master branch) with the win32 + dx11 backends vendored into imgui/.
// Link: d3d11.lib, dxgi.lib, d3dcompiler.lib
//
// Overlay strategy: a topmost, layered, click-through WS_EX_TRANSPARENT window sized to the
// emulator's client rect, rendered with D3D11. Catches no input itself -> emulator stays playable
// underneath. Toggle menu visibility with INSERT to temporarily take input for the ImGui UI.
#include <windows.h>
#include <d3d11.h>
#include <dwmapi.h>
#include <string>
#include <cmath>
#include <algorithm>

#include "imgui.h"
#include "imgui_impl_win32.h"
#include "imgui_impl_dx11.h"

#include "memory.hpp"
#include "offsets.hpp"
#include "entities.hpp"
#include "guest_scan.hpp"

#pragma comment(lib, "d3d11.lib")
#pragma comment(lib, "dxgi.lib")
#pragma comment(lib, "dwmapi.lib")

extern IMGUI_IMPL_API LRESULT ImGui_ImplWin32_WndProcHandler(HWND, UINT, WPARAM, LPARAM);

namespace {
    ID3D11Device* g_device = nullptr;
    ID3D11DeviceContext* g_context = nullptr;
    IDXGISwapChain* g_swapchain = nullptr;
    ID3D11RenderTargetView* g_rtv = nullptr;
    HWND g_hwnd = nullptr;

    struct config {
        bool esp_enabled = true;
        bool box_esp = true;
        bool health_bar = true;
        bool distance_text = true;
        bool snaplines = false;
        bool team_filter = true;

        bool aimbot_enabled = false;
        bool aim_target_head = true;
        float fov_radius = 120.0f;       // px radius from screen center the aimbot will consider
        float smoothing = 6.0f;          // higher = slower/smoother, 1 = instant snap
        int aim_key = VK_RBUTTON;        // hold-to-aim key, ADS button by default
        bool triggerbot = false;
        int trigger_key = VK_XBUTTON1;
    } cfg;

    bool menu_open = false;
}

LRESULT CALLBACK wnd_proc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam) {
    if (ImGui_ImplWin32_WndProcHandler(hwnd, msg, wparam, lparam)) return true;
    if (msg == WM_DESTROY) { PostQuitMessage(0); return 0; }
    return DefWindowProc(hwnd, msg, wparam, lparam);
}

bool find_target_window(const wchar_t* title_substr, RECT& out_rect, HWND& out_hwnd) {
    // Finds the emulator's render window by title (e.g. L"LDPlayer", L"GameLoop", L"BlueStacks").
    struct ctx_t { const wchar_t* needle; HWND found; } ctx{ title_substr, nullptr };
    EnumWindows([](HWND h, LPARAM lp) -> BOOL {
        auto* c = reinterpret_cast<ctx_t*>(lp);
        wchar_t buf[256];
        GetWindowTextW(h, buf, 256);
        if (IsWindowVisible(h) && wcsstr(buf, c->needle)) { c->found = h; return FALSE; }
        return TRUE;
        }, reinterpret_cast<LPARAM>(&ctx));
    if (!ctx.found) return false;
    out_hwnd = ctx.found;
    GetClientRect(ctx.found, &out_rect);
    return true;
}

void make_overlay_click_through(HWND hwnd, bool clickable) {
    LONG ex = GetWindowLongW(hwnd, GWL_EXSTYLE);
    if (clickable) ex &= ~WS_EX_TRANSPARENT;
    else           ex |= WS_EX_TRANSPARENT;
    SetWindowLongW(hwnd, GWL_EXSTYLE, ex);
}

bool create_device(HWND hwnd) {
    DXGI_SWAP_CHAIN_DESC sd{};
    sd.BufferCount = 2;
    sd.BufferDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    sd.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
    sd.OutputWindow = hwnd;
    sd.SampleDesc.Count = 1;
    sd.Windowed = TRUE;
    sd.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;
    sd.BufferDesc.RefreshRate = { 60, 1 };
    sd.Flags = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH;

    UINT flags = 0;
    D3D_FEATURE_LEVEL fl;
    HRESULT hr = D3D11CreateDeviceAndSwapChain(nullptr, D3D_DRIVER_TYPE_HARDWARE, nullptr, flags,
        nullptr, 0, D3D11_SDK_VERSION, &sd, &g_swapchain, &g_device, &fl, &g_context);
    if (FAILED(hr)) return false;

    ID3D11Texture2D* back_buffer = nullptr;
    g_swapchain->GetBuffer(0, IID_PPV_ARGS(&back_buffer));
    g_device->CreateRenderTargetView(back_buffer, nullptr, &g_rtv);
    back_buffer->Release();
    return true;
}

void aim_at(const vec2& target, int screen_w, int screen_h) {
    POINT center{ screen_w / 2, screen_h / 2 };
    float dx = (target.x - center.x) / cfg.smoothing;
    float dy = (target.y - center.y) / cfg.smoothing;

    INPUT input{};
    input.type = INPUT_MOUSE;
    input.mi.dwFlags = MOUSEEVENTF_MOVE; // relative move, works against emulator window regardless of raw-input mode
    input.mi.dx = static_cast<LONG>(dx);
    input.mi.dy = static_cast<LONG>(dy);
    SendInput(1, &input, sizeof(INPUT));
}

void click_fire() {
    INPUT down{}, up{};
    down.type = up.type = INPUT_MOUSE;
    down.mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
    up.mi.dwFlags = MOUSEEVENTF_LEFTUP;
    SendInput(1, &down, sizeof(INPUT));
    SendInput(1, &up, sizeof(INPUT));
}

int APIENTRY wWinMain(HINSTANCE hinst, HINSTANCE, LPWSTR, int) {
    WNDCLASSEXW wc{ sizeof(wc), CS_CLASSDC, wnd_proc, 0, 0, hinst, nullptr, nullptr, nullptr, nullptr, L"ff_overlay", nullptr };
    RegisterClassExW(&wc);

    RECT target_rect{};
    HWND target_hwnd = nullptr;
    if (!find_target_window(L"LDPlayer", target_rect, target_hwnd) &&
        !find_target_window(L"GameLoop", target_rect, target_hwnd) &&
        !find_target_window(L"BlueStacks", target_rect, target_hwnd)) {
        MessageBoxW(nullptr, L"Emulator window not found. Launch LDPlayer/GameLoop/BlueStacks with Free Fire running first.", L"ff_esp", MB_OK);
        return 1;
    }

    POINT origin{ target_rect.left, target_rect.top };
    ClientToScreen(target_hwnd, &origin);
    int screen_w = target_rect.right - target_rect.left;
    int screen_h = target_rect.bottom - target_rect.top;

    g_hwnd = CreateWindowExW(
        WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST | WS_EX_TOOLWINDOW,
        wc.lpszClassName, L"overlay", WS_POPUP,
        origin.x, origin.y, screen_w, screen_h,
        nullptr, nullptr, hinst, nullptr);

    SetLayeredWindowAttributes(g_hwnd, RGB(0, 0, 0), 0, LWA_COLORKEY);
    ShowWindow(g_hwnd, SW_SHOW);
    UpdateWindow(g_hwnd);

    if (!create_device(g_hwnd)) return 1;

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGui::GetIO().IniFilename = nullptr;
    ImGui_ImplWin32_Init(g_hwnd);
    ImGui_ImplDX11_Init(g_device, g_context);

    process_memory mem;
    // LDPlayer9 runs the Android VM as Ld9BoxHeadless.exe (confirmed via live process list on this
    // machine's LDPlayer9 install), with dnplayer.exe being just the UI shell. libil2cpp.so is mapped
    // inside Ld9BoxHeadless.exe's address space.
    if (!mem.attach(L"Ld9BoxHeadless.exe") && !mem.attach(L"dnplayer.exe")) {
        MessageBoxW(nullptr, L"Could not attach to LDPlayer process. Run this tool as admin and make sure LDPlayer + Free Fire are running.", L"ff_esp", MB_OK);
        return 1;
    }

    // libil2cpp.so lives inside the guest RAM blob, not as a Windows module (confirmed: Module32
    // enumeration of Ld9BoxHeadless.exe never shows it, it's a real hardware-virtualized VM). Scan
    // guest RAM for the ELF header + verified soname instead. This takes a few seconds on first run.
    guest_scanner scanner(mem, mem.handle());
    auto base_opt = scanner.find_module("libil2cpp.so");
    if (!base_opt) {
        MessageBoxW(nullptr, L"libil2cpp.so not found in guest RAM yet. Make sure Free Fire is fully loaded into a match/lobby (the lib is only mapped once the Unity runtime starts), then relaunch this tool.", L"ff_esp", MB_OK);
        return 1;
    }
    entity_reader reader(mem);
    reader.refresh_base(*base_opt);

    bool running = true;
    MSG msg{};
    while (running) {
        while (PeekMessage(&msg, nullptr, 0, 0, PM_REMOVE)) {
            if (msg.message == WM_QUIT) running = false;
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
        if (!running) break;

        if ((GetAsyncKeyState(VK_INSERT) & 1)) {
            menu_open = !menu_open;
            make_overlay_click_through(g_hwnd, menu_open);
        }

        ImGui_ImplDX11_NewFrame();
        ImGui_ImplWin32_NewFrame();
        ImGui::NewFrame();

        vec3 local_pos = reader.read_local_position();
        matrix4x4 vp = reader.read_view_proj();
        auto entities = reader.read_entities(local_pos);

        ImDrawList* draw = ImGui::GetBackgroundDrawList();
        vec2 crosshair{ screen_w / 2.0f, screen_h / 2.0f };
        vec2 closest_target{};
        float closest_dist_px = FLT_MAX;
        bool has_target = false;

        for (auto& e : entities) {
            if (cfg.team_filter && e.team_id == mem.read<int>(e.address + offsets::entity_team_id_off)) continue;

            vec2 feet, head;
            bool feet_vis = world_to_screen(e.position, vp, screen_w, screen_h, feet);
            bool head_vis = world_to_screen(e.head_position, vp, screen_w, screen_h, head);
            if (!feet_vis && !head_vis) continue;

            if (cfg.esp_enabled) {
                float height = std::max(1.0f, feet.y - head.y);
                float width = height * 0.45f;

                if (cfg.box_esp) {
                    draw->AddRect(ImVec2(feet.x - width / 2, head.y), ImVec2(feet.x + width / 2, feet.y),
                        IM_COL32(255, 60, 60, 255), 2.0f);
                }
                if (cfg.health_bar) {
                    float hp_pct = std::clamp(e.health / 100.0f, 0.0f, 1.0f);
                    draw->AddRectFilled(ImVec2(feet.x - width / 2 - 6, head.y), ImVec2(feet.x - width / 2 - 3, feet.y),
                        IM_COL32(40, 40, 40, 200));
                    draw->AddRectFilled(ImVec2(feet.x - width / 2 - 6, feet.y - (feet.y - head.y) * hp_pct),
                        ImVec2(feet.x - width / 2 - 3, feet.y), IM_COL32(60, 220, 60, 220));
                }
                if (cfg.distance_text) {
                    char buf[32];
                    snprintf(buf, sizeof(buf), "%.0fm", e.distance);
                    draw->AddText(ImVec2(feet.x - width / 2, feet.y + 2), IM_COL32(255, 255, 0, 255), buf);
                }
                if (cfg.snaplines) {
                    draw->AddLine(ImVec2(screen_w / 2.0f, (float)screen_h), ImVec2(feet.x, feet.y),
                        IM_COL32(255, 255, 255, 120), 1.0f);
                }
            }

            vec2 aim_point = cfg.aim_target_head ? head : feet;
            float dx = aim_point.x - crosshair.x, dy = aim_point.y - crosshair.y;
            float dist_px = std::sqrt(dx * dx + dy * dy);
            if (dist_px < cfg.fov_radius && dist_px < closest_dist_px) {
                closest_dist_px = dist_px;
                closest_target = aim_point;
                has_target = true;
            }
        }

        if (cfg.fov_radius > 0 && cfg.esp_enabled)
            draw->AddCircle(ImVec2(crosshair.x, crosshair.y), cfg.fov_radius, IM_COL32(0, 255, 255, 150));

        if (cfg.aimbot_enabled && has_target && (GetAsyncKeyState(cfg.aim_key) & 0x8000))
            aim_at(closest_target, screen_w, screen_h);

        if (cfg.triggerbot && has_target && closest_dist_px < 6.0f && (GetAsyncKeyState(cfg.trigger_key) & 0x8000))
            click_fire();

        if (menu_open) {
            ImGui::Begin("ff_esp");
            ImGui::Checkbox("ESP", &cfg.esp_enabled);
            ImGui::Checkbox("Box", &cfg.box_esp);
            ImGui::Checkbox("Health bar", &cfg.health_bar);
            ImGui::Checkbox("Distance", &cfg.distance_text);
            ImGui::Checkbox("Snaplines", &cfg.snaplines);
            ImGui::Checkbox("Team filter", &cfg.team_filter);
            ImGui::Separator();
            ImGui::Checkbox("Aimbot", &cfg.aimbot_enabled);
            ImGui::Checkbox("Target head", &cfg.aim_target_head);
            ImGui::SliderFloat("FOV radius", &cfg.fov_radius, 20.0f, 400.0f);
            ImGui::SliderFloat("Smoothing", &cfg.smoothing, 1.0f, 20.0f);
            ImGui::Checkbox("Triggerbot", &cfg.triggerbot);
            ImGui::End();
        }

        ImGui::Render();
        float clear[4] = { 0, 0, 0, 0 };
        g_context->OMSetRenderTargets(1, &g_rtv, nullptr);
        g_context->ClearRenderTargetView(g_rtv, clear);
        ImGui_ImplDX11_RenderDrawData(ImGui::GetDrawData());
        g_swapchain->Present(1, 0);
    }

    ImGui_ImplDX11_Shutdown();
    ImGui_ImplWin32_Shutdown();
    ImGui::DestroyContext();
    return 0;
}
