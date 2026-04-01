import { describe, it, expect, vi, beforeEach } from "vitest";
import { presetService } from "@/lib/preset-service";

// ---------------------------------------------------------------------------
// Mock @/lib/appwrite-config so we never touch the real Appwrite SDK
// ---------------------------------------------------------------------------
const {
  mockListDocuments,
  mockCreateDocument,
  mockUpdateDocument,
  mockDeleteDocument,
} = vi.hoisted(() => ({
  mockListDocuments: vi.fn(),
  mockCreateDocument: vi.fn(),
  mockUpdateDocument: vi.fn(),
  mockDeleteDocument: vi.fn(),
}));

vi.mock("@/lib/appwrite-config", () => ({
  databases: {
    listDocuments: mockListDocuments,
    createDocument: mockCreateDocument,
    updateDocument: mockUpdateDocument,
    deleteDocument: mockDeleteDocument,
  },
  databaseID: "test-db",
  collection03ID: "test-presets-col",
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDoc(overrides: Record<string, unknown> = {}) {
  return {
    $id: "preset_abc",
    name: "Test Preset",
    content: ["item 1", "item 2"],
    userId: "user_123",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// getPresets
// ---------------------------------------------------------------------------

describe("presetService.getPresets", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns an empty array when no documents exist", async () => {
    mockListDocuments.mockResolvedValue({ documents: [], total: 0 });
    const result = await presetService.getPresets("user_123");
    expect(result).toEqual([]);
  });

  it("maps document fields to Preset shape", async () => {
    const doc = makeDoc();
    mockListDocuments.mockResolvedValue({ documents: [doc], total: 1 });
    const [preset] = await presetService.getPresets("user_123");
    expect(preset.id).toBe("preset_abc");
    expect(preset.name).toBe("Test Preset");
    expect(preset.content).toEqual(["item 1", "item 2"]);
    expect(preset.userId).toBe("user_123");
  });

  it("queries by userId", async () => {
    mockListDocuments.mockResolvedValue({ documents: [], total: 0 });
    await presetService.getPresets("user_xyz");
    const [, , queries] = mockListDocuments.mock.calls[0];
    expect(JSON.stringify(queries)).toContain("user_xyz");
  });

  it("falls back to $createdAt when createdAt is absent", async () => {
    const doc = makeDoc({ createdAt: undefined, $createdAt: "2024-06-01T00:00:00.000Z" });
    mockListDocuments.mockResolvedValue({ documents: [doc], total: 1 });
    const [preset] = await presetService.getPresets("user_123");
    expect(preset.createdAt).toBe("2024-06-01T00:00:00.000Z");
  });
});

// ---------------------------------------------------------------------------
// createPreset
// ---------------------------------------------------------------------------

describe("presetService.createPreset", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the created Preset", async () => {
    const doc = makeDoc({ name: "New Preset", content: ["a", "b"] });
    mockCreateDocument.mockResolvedValue(doc);
    const preset = await presetService.createPreset("user_123", "New Preset", ["a", "b"]);
    expect(preset.name).toBe("New Preset");
    expect(preset.content).toEqual(["a", "b"]);
  });

  it("passes userId, name, and content to createDocument", async () => {
    mockCreateDocument.mockResolvedValue(makeDoc());
    await presetService.createPreset("user_456", "My List", ["x", "y"]);
    const [, , , payload] = mockCreateDocument.mock.calls[0];
    expect(payload.userId).toBe("user_456");
    expect(payload.name).toBe("My List");
    expect(payload.content).toEqual(["x", "y"]);
  });

  it("sets createdAt and updatedAt timestamps", async () => {
    mockCreateDocument.mockResolvedValue(makeDoc());
    await presetService.createPreset("user_123", "Stamped", ["z"]);
    const [, , , payload] = mockCreateDocument.mock.calls[0];
    expect(typeof payload.createdAt).toBe("string");
    expect(typeof payload.updatedAt).toBe("string");
  });

  it("sets user-scoped read/update/delete permissions", async () => {
    mockCreateDocument.mockResolvedValue(makeDoc());
    await presetService.createPreset("user_789", "Private", ["p"]);
    const [, , , , permissions] = mockCreateDocument.mock.calls[0];
    expect(Array.isArray(permissions)).toBe(true);
    expect(permissions.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// updatePreset
// ---------------------------------------------------------------------------

describe("presetService.updatePreset", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the updated Preset", async () => {
    const doc = makeDoc({ name: "Renamed", content: ["new item"] });
    mockUpdateDocument.mockResolvedValue(doc);
    const preset = await presetService.updatePreset("preset_abc", "Renamed", ["new item"]);
    expect(preset.name).toBe("Renamed");
    expect(preset.content).toEqual(["new item"]);
  });

  it("passes name and content to updateDocument", async () => {
    mockUpdateDocument.mockResolvedValue(makeDoc());
    await presetService.updatePreset("preset_abc", "Updated Name", ["c1", "c2"]);
    const [, , , payload] = mockUpdateDocument.mock.calls[0];
    expect(payload.name).toBe("Updated Name");
    expect(payload.content).toEqual(["c1", "c2"]);
  });

  it("sets updatedAt timestamp on update", async () => {
    mockUpdateDocument.mockResolvedValue(makeDoc());
    await presetService.updatePreset("preset_abc", "Name", []);
    const [, , , payload] = mockUpdateDocument.mock.calls[0];
    expect(typeof payload.updatedAt).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// deletePreset
// ---------------------------------------------------------------------------

describe("presetService.deletePreset", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls deleteDocument with the correct presetId", async () => {
    mockDeleteDocument.mockResolvedValue(undefined);
    await presetService.deletePreset("preset_xyz");
    const [, , id] = mockDeleteDocument.mock.calls[0];
    expect(id).toBe("preset_xyz");
  });

  it("resolves without throwing on success", async () => {
    mockDeleteDocument.mockResolvedValue(undefined);
    await expect(presetService.deletePreset("preset_abc")).resolves.toBeUndefined();
  });
});
