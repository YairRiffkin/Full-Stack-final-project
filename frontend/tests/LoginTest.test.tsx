import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from '../src/pages/Login';
import { HomePage } from '../src/pages/HomePage';
import { User } from '../src/models/usertypes';
import { mockedNavigate } from './setup';

describe('LoginPage', () => {
    vi.stubGlobal("navigate", mockedNavigate);
    const renderForm = () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<LoginPage setUserToken={function (userId: string | null): void {
                        throw new Error('Function not implemented.');
                    } } />} />
                    <Route path="/" element={<HomePage userDetails={null} />} />
                </Routes>
            </MemoryRouter>
        )

        const usernameInput = screen.getByPlaceholderText('Username')
        const passwordInput = screen.getByPlaceholderText('Password')
        const submitButton = screen.getByRole('button', { name: /✓/i });
        return { usernameInput, passwordInput, submitButton };
    };

    const renderAndFillForm = async (username, password) => {
        const {usernameInput, passwordInput, submitButton} = renderForm();
        const user = userEvent.setup();
        await user.click(usernameInput)
        await user.keyboard(username)
        await user.click(passwordInput)
        await user.keyboard(password)
        return { usernameInput, passwordInput, submitButton, user };
    };

    it("Renders the login form with disabled submit", () => {
        const { submitButton } = renderForm();
        expect(submitButton).toBeDisabled();
    });

    it("Enables submit when form is valid with employee ID", async () => {
        const { submitButton } = await renderAndFillForm("E12345", "Aa1234");
        const errors = document.querySelectorAll("small");
        expect(errors.length).toEqual(0);
        console.log("warning: ", errors.length)
        expect(submitButton).toBeEnabled();
    });

    it("Enables submit when form is valid with email", async () => {
        const { submitButton } = await renderAndFillForm("d.d@xxx.com", "Aa1234");
        const errors = document.querySelectorAll("small");
        expect(errors.length).toEqual(0);
        console.log("warning: ", errors.length)
        expect(submitButton).toBeEnabled();
    });
});


        
