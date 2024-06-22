import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NewUserRequest } from '../src/pages/Register';
import { HomePage } from '../src/pages/HomePage';
import { User } from '../src/models/usertypes';
import { mockedErrorFetch, mockedNavigate } from './setup';

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
        await user.selectOptions(locationInput, location)
        await user.selectOptions(roleInput, role)
        await user.click(password1Input)
        await user.keyboard(password1)
        await user.click(password2Input)
        await user.keyboard(password2)
        return { usernameInput, employeeIDInput, emailInput, phoneInput, locationInput, roleInput, password1Input, password2Input, submitButton, user };
    };

    it("Renders the register form with disabled submit", () => {
        const { submitButton } = renderForm();
        const errors = document.querySelectorAll("small");
        expect(errors.length).toEqual(2);
        expect(submitButton).toBeDisabled();
    });
    

    it("Enables submit when form is valid", async () => {
        const { submitButton } = await renderAndFillForm("Yair Cohen", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        const errors = document.querySelectorAll("small");
        expect(errors.length).toEqual(0);
        expect(submitButton).toBeEnabled();
    });


    it("Handles input validation for username field", async () => {
        const usernames = ["Yair Cohen ", "Yair", " Yair Cohen", "Yair Cohen Sadan"]
        const { submitButton, usernameInput, user } = await renderAndFillForm("Yair Cohen ", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        await Promise.all(usernames.map(async (username) => {
        await user.clear(usernameInput);
        await user.keyboard(username);
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBeGreaterThan(0);
        expect(submitButton).toBeDisabled();
        }));
    });


    it("Handles input validation for employee ID field", async () => {
        const IDs = ["F12345", "123456", " E12345", "E12345 ", "E1234"]
        const { submitButton, employeeIDInput, user } = await renderAndFillForm("Yair Cohen ", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        await Promise.all(IDs.map(async (ID) => {
        await user.clear(employeeIDInput);
        await user.keyboard(ID);
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBeGreaterThan(0);
        expect(submitButton).toBeDisabled();
        }));
    });


    it("Handles input validation for email field", async () => {
        const emails = ["admin@xxx.com ", " admin@xxx.com", " admin.xxx.com", "admin@gmail.com "]
        const { submitButton, emailInput, user } = await renderAndFillForm("Yair Cohen ", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        await Promise.all(emails.map(async (email) => {
        await user.clear(emailInput);
        await user.keyboard(email);
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBeGreaterThan(0);
        expect(submitButton).toBeDisabled();
        }));
    });


    it("Handles input validation for password field", async () => {
        const emails = ["admin@xxx.com ", " admin@xxx.com", " admin.xxx.com", "admin@gmail.com "]
        const { submitButton, emailInput, user } = await renderAndFillForm("Yair Cohen ", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        await Promise.all(emails.map(async (email) => {
        await user.clear(emailInput);
        await user.keyboard(email);
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBeGreaterThan(0);
        expect(submitButton).toBeDisabled();
        }));
    });

    it("Shows error if returned from backend", async () => {
        const { submitButton, user } = await renderAndFillForm("Yair Cohen", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        await user.click(submitButton)
        expect(mockedErrorFetch).toHaveBeenCalled();
        mockedErrorFetch.mockClear();
        const errors = document.querySelectorAll("small");
        expect(errors.length).toBeGreaterThan(0);
    });
});
