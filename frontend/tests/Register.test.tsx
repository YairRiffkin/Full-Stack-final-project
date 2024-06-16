import { getByRole, getByText, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NewUserRequest } from '../src/pages/Register';
import { HomePage } from '../src/pages/HomePage';
import { User } from '../src/models/usertypes';
import { mockedFetch, mockedNavigate } from './setup';
import { RegistrationFormDetails } from '../src/components/pages/RegistrationDisplayElements';

describe('NewUserRequest', () => {
    vi.stubGlobal("navigate", mockedNavigate);
    const renderForm = () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <Routes>
                    <Route path="/register" element={<NewUserRequest setUserDetails={function (details: User | null): void {
                        throw new Error('Function not implemented.');
                    } } />} />
                    <Route path="/" element={<HomePage userDetails={null} />} />
                </Routes>
            </MemoryRouter>
        )

        const usernameInput = screen.getByPlaceholderText('First name, Surname')
        const employeeIDInput = screen.getByPlaceholderText('Employee ID')
        const emailInput = screen.getByPlaceholderText('Email')
        const phoneInput = screen.getByPlaceholderText('Phone Number')
        const locationInput = screen.getByLabelText(/Location:/i)
        const roleInput = screen.getByLabelText(/Role/i)
        const password1Input = screen.getByPlaceholderText('Password')
        const password2Input = screen.getByPlaceholderText('Verify Password')
        const submitButton = screen.getByRole('button', { name: /Complete the form as requested/i });
        return { usernameInput, employeeIDInput, emailInput, phoneInput, locationInput, roleInput, password1Input, password2Input, submitButton };
    };

    const renderAndFillForm = async (username, employeeID, email, phone, location, role, password1, password2) => {
        const {usernameInput, employeeIDInput, emailInput, phoneInput, locationInput, roleInput, password1Input, password2Input, submitButton} = renderForm();
        const user = userEvent.setup();
        await user.click(usernameInput)
        await user.keyboard(username)
        await user.click(employeeIDInput)
        await user.keyboard(employeeID)
        await user.click(emailInput)
        await user.keyboard(email)
        await user.click(phoneInput)
        await user.keyboard(phone)
        // await user.click(locationInput)
        await user.selectOptions(locationInput, location)
        // await user.keyboard(location)
        await user.selectOptions(roleInput, role)
        // await user.click(roleInput)
        // await user.keyboard(role)
        await user.click(password1Input)
        await user.keyboard(password1)
        await user.click(password2Input)
        await user.keyboard(password2)
        return { usernameInput, employeeIDInput, emailInput, phoneInput, locationInput, roleInput, password1Input, password2Input, submitButton, user };
    };

    it("Renders the register form with disabled submit", () => {
        const { submitButton } = renderForm();
        expect(submitButton).toBeDisabled();
    });
    

    it("Enables submit when form is valid", async () => {
        const { submitButton } = await renderAndFillForm("Yair Cohen", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        const errors = document.querySelectorAll("small");
        console.log(errors);
        expect(errors.length).toEqual(0);
        expect(submitButton).toBeEnabled();
    });
});
