import type { RawSection } from "@/types";
import { res, topicTemplate } from "../helpers";

export const graphicsSection: RawSection = {
  id: "graphics",
  slug: "graphics",
  title: "Graphics Fundamentals",
  description: "GPU APIs, render pipelines, and graphics debugging.",
  icon: "Palette",
  order: 10,
  topics: [
    topicTemplate("directx9", "DirectX 9", "Legacy D3D9 pipeline.", "Fixed-function + programmable shaders. IDirect3DDevice9 draw calls. Still used in older games/indie titles.\n\nHook Present/EndScene for overlay research (educational).", { difficulty: "intermediate", hours: 6, tags: ["directx", "d3d9"] }),
    topicTemplate("directx11", "DirectX 11", "Modern D3D11 render pipeline.", "Device → DeviceContext → RenderTargetView. Constant buffers hold shader data (view matrix, etc.). Analyze CBV bindings for world-to-screen research.", { difficulty: "intermediate", hours: 8, tags: ["directx", "d3d11"] }),
    topicTemplate("directx12", "DirectX 12", "Low-level D3D12 command lists.", "Explicit resource barriers, descriptor heaps, command queues. More complex but better performance. PIX for profiling.", { difficulty: "advanced", hours: 10, tags: ["directx", "d3d12"] }),
    topicTemplate("opengl", "OpenGL", "Cross-platform GL pipeline.", "Context, VBOs, shaders, uniform buffers. Used in indie games and some engines. apitrace for call capture.", { difficulty: "intermediate", hours: 6, tags: ["opengl"] }),
    topicTemplate("vulkan", "Vulkan", "Explicit cross-platform GPU API.", "Similar philosophy to D3D12. RenderDoc supports Vulkan capture. Growing adoption in new engines.", { difficulty: "advanced", hours: 10, tags: ["vulkan"] }),
    topicTemplate("render-pipelines", "Render Pipelines", "From scene to framebuffer.", "Stages: culling → sorting → draw calls → pixel shading → post-processing → present.\n\nFrame debugging reveals draw order, shader inputs, render targets.", { difficulty: "intermediate", hours: 6, tags: ["rendering", "pipeline"] }),
    topicTemplate("frame-analysis", "Frame Analysis", "Capturing and analyzing rendered frames.", "Use RenderDoc or PIX:\n1. Capture frame\n2. Inspect draw events\n3. View mesh/texture/shader\n4. Trace constant buffer data\n\nEssential for understanding ESP/wallhack *detection* vectors.", { difficulty: "intermediate", hours: 8, tags: ["renderdoc", "analysis"], resources: [res("renderdoc", "RenderDoc", "https://renderdoc.org/", "tool", "Graphics debugger"), res("pix", "PIX on Windows", "https://devblogs.microsoft.com/pix/", "tool", "DirectX performance tool")] }),
    topicTemplate("graphics-debugging", "Graphics Debugging Tools", "Tooling for GPU debugging.", "RenderDoc — cross-API, open source\nPIX — DirectX, Microsoft\nNsight — NVIDIA\napitrace — OpenGL\n\nAll free for educational use.", { difficulty: "intermediate", hours: 4, tags: ["tools", "graphics"] }),
  ],
};
