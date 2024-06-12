import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { describe, expect } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { NewUserRequest } from '../src/pages/Register';
import { User } from '../src/models/usertypes';

describe(NewUserRequest, () => {
    const renderForm = () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/register" element={<NewUserRequest userDetails={null} setUserDetails={function (details: User | null): void {
                        throw new Error('Function not implemented.');
                    } } />} />
                </Routes>
            </MemoryRouter>
        )
        const usernameInput = screen.getByRole('textbox', { name: 'username' });
        const employee_idInput = screen.getByRole('textbox', { name: 'employee_id' });
        const submitButton = screen.getByRole('button', { name: /submit/i }) as HTMLButtonElement;
        return { usernameInput, employee_idInput, submitButton };
    }

    // const getFormErrors = () => document.querySelectorAll(".error");

    const renderAndFillForm = async (username, employee_id) => {
        const { usernameInput, employee_idInput, submitButton } = renderForm()
        const user = userEvent.setup();
        await user.click(usernameInput)
        await user.keyboard(username)
        await user.click(employee_idInput)
        await user.keyboard(employee_id)
        
        return { usernameInput, employee_idInput, submitButton, user };
    }

    it("Renders the register form with disabled submit", () => {
        const { submitButton } = renderForm();
        expect(submitButton.disabled).toBeTruthy();
    });
})
