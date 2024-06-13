import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NewUserRequest } from '../src/pages/Register';
import { HomePage } from '../src/pages/HomePage';
import { User } from '../src/models/usertypes';

describe(NewUserRequest, () => {
    const renderForm = () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/register" element={<NewUserRequest userDetails={null} setUserDetails={function (details: User | null): void {
                        throw new Error('Function not implemented.');
                    } } />} />
                    <Route path="/" element={<HomePage userDetails={null} setUserDetails={function (details: User | null): void {throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </MemoryRouter>
        )
        // const usernameInput = screen.getByRole('textbox', { name: 'username' }) as HTMLInputElement;
        // const employee_idInput = screen.getByRole('textbox', { name: 'employee_id' }) as HTMLInputElement;
        const form = screen.getByRole('form'); // Replace 'form' with the actual role of your form
        const submitButton = within(form).getByRole('button', { name: /submit/i });
        return { submitButton };
    }

    it("Renders the register form with disabled submit", () => {
        const { submitButton } = renderForm();
        expect(submitButton.disabled).toBeTruthy();
    });
})
