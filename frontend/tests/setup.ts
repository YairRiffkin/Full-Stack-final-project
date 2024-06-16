import "@testing-library/jest-dom";
import { afterAll, beforeAll, vi } from 'vitest';

export const mockedFetch = vi.fn(async (path: string) => {
    if (path.includes("/users/new_user")) {
    return { error: "fake error" }
    }
})

beforeAll(() => {
    vi.stubGlobal("fetch", mockedFetch)
})

afterAll(() => {
    vi.unstubAllGlobals()
})

export const mockedNavigate = vi.fn(async (path: string) => {
    if (path === "/") {
        return;
    }
});

beforeAll(() => {
    vi.stubGlobal("navigate", mockedNavigate);
});

afterAll(() => {
    vi.unstubAllGlobals();
});