import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NewItemLog } from '../src/pages/newItem';
import userEvent from '@testing-library/user-event';
import { User } from '../src/models/usertypes';

describe('NewItemLog', () => {

    const userDetailsMock: User | null = {
        email: "ilan.klein@xxx.com",
        employee_id: "E00002",
        id: 2,
        location: "Afula",
        phone_number: "052-608-8092",
        role: "MRP Controller",
        user_level: "user",
        username: "Ilan Klein"
    };

    const renderForm = () => {
        render(
            <MemoryRouter initialEntries={['/newitem']}>
                <Routes>
                    <Route 
                        path="/newitem" 
                            element={
                                <NewItemLog 
                                    userDetails={userDetailsMock} 
                                    userToken={null}
                            />} 
                    />
                </Routes>
            </MemoryRouter>
        )


        const typeInput = screen.getByTestId("materialType") as HTMLSelectElement;
        const demoInput = screen.getByLabelText(/Select demo item number from 1 - 50:/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /Complete the form as requested/i }) as HTMLButtonElement;
        return { typeInput, demoInput, submitButton };
    };

    it("Renders the new item form", () => {
        const { submitButton } = renderForm();
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBeGreaterThan(0);
        expect(submitButton.disabled).toBe(true);
    });

    it("Chooses a demo item", async () => {
        const { demoInput } = renderForm();
        expect(demoInput.type).toBe('number'); // Check input type
        expect(demoInput.name).toBe('demo item'); // Check input name
        expect(demoInput.value).toBe('25');
        await userEvent.clear(demoInput);
        await userEvent.type(demoInput, '26');
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBe(4);
    });

    it("Completes the form", async () => {
        const { demoInput, typeInput } = renderForm();
        await userEvent.clear(demoInput);
        await userEvent.type(demoInput, '15');
        await userEvent.selectOptions(typeInput, 'Z104');
        await new Promise(resolve => setTimeout(resolve, 0));
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBe(2);
    });
});