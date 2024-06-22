import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserEdit } from '../src/pages/UserEdit';
import { HomePage } from '../src/pages/HomePage';
import { mockedNavigate } from './setup';

describe('UserEdit', () => {
    vi.stubGlobal("navigate", mockedNavigate);

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
            <MemoryRouter initialEntries={['/useredit']}>
                <Routes>
                    <Route path="/useredit" element={<UserEdit 
                    userDetails={userDetailsMock} 
                    userToken={null}
                    />} />
                    <Route path="/" element={<HomePage userDetails={null} />} />
                </Routes>
            </MemoryRouter>
        )

        const usernameInput = screen.getByPlaceholderText('First name, Surname')
        const employeeIDInput = screen.getByPlaceholderText('Employee ID')
        const emailInput = screen.getByPlaceholderText('Email')
        const phoneInput = screen.getByPlaceholderText('Phone Number')
        const locationInput = screen.getByLabelText(/Location/i)
        const roleInput = screen.getByLabelText(/Role/i)
        const passwordButton = screen.getByRole('button', { name: /Password/i });
        const submitButton = screen.getByRole('button', { name: /UPDATE/i });
        return { usernameInput, employeeIDInput, emailInput, phoneInput, locationInput, roleInput, passwordButton, submitButton };
    };

    it("Renders the register form existing user details", () => {
        const { employeeIDInput, emailInput, passwordButton, submitButton } = renderForm();
        const errors = document.querySelectorAll("small");
        expect(errors.length).toEqual(0);
        expect(employeeIDInput).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordButton).toBeEnabled();
        expect(submitButton).toBeEnabled();
    });

    it("Clicks on Password button", () => {
        const { passwordButton, submitButton } = renderForm();
        fireEvent.click(passwordButton);
        const oldPasswordInput = screen.getByPlaceholderText('Old Password');
        expect(oldPasswordInput).toBeVisible();
        const password1Input = screen.getByPlaceholderText('New Password');
        expect(password1Input).toBeVisible();
        const password2Input = screen.getByPlaceholderText('Verify Password');
        expect(password2Input).toBeVisible();
        expect(passwordButton).toHaveTextContent("Close");
        expect(submitButton).toHaveTextContent("Complete the form");
        expect(submitButton).toBeDisabled();
    });
});