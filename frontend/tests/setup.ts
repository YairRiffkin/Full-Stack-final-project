import "@testing-library/jest-dom";
import { afterAll, beforeAll, vi } from 'vitest';

export const mockedErrorFetch = vi.fn(async (path: string) => {
    if (path.includes("/login") | path.includes("/users/new_user")) {
    return { 
        json: async () => ({ error: "fake error" }) 
    }
    }
    });

beforeAll(() => {
    vi.stubGlobal("fetch", mockedErrorFetch)
});

afterAll(() => {
    vi.unstubAllGlobals()
});

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
