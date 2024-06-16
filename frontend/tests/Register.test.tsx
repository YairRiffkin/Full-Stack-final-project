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

        const formElements: Record<string, HTMLElement | undefined> = {};

        RegistrationFormDetails.forEach(detail => {
            // console.log("detail: " , detail.element)
            const elements = screen.getAllByRole(detail.element === 'input' ? 'textbox' : 'combobox', { name: "" });
            
            const element = elements.find(el => el.getAttribute('name') === detail.name);
            // console.log("element: ", element.name)
            if (element) {
                formElements[detail.name] = element;
                
            }
        });

        const submitButton = screen.getByRole('button', { name: /Complete the form as requested/i });
        return { ...formElements, submitButton };
    };

    const renderAndFillForm = async (formData: Record<string, string>) => {
        const { submitButton, ...elements } = renderForm();
        const user = userEvent.setup();

        for (const key in elements) {
            if (elements[key]) {
                if (elements[key].element === 'input') {
                    await user.type(elements[key], formData[key]);
                } else if (elements[key].element === 'select') {
                    await user.selectOptions(elements[key], formData[key]);
                }
            }
        }

        return { ...elements, submitButton, user };
    };

    it("Renders the register form with disabled submit", () => {
        const { submitButton } = renderForm();
        expect(submitButton).toBeDisabled();
    });
    

    it("Enables submit when form is valid", async () => {
        const { submitButton } = await renderAndFillForm("Yair Cohen", "E12345", "admin@xxx.com", "0526088092", "Afula", "Other", "Aa1234", "Aa1234");
        expect(submitButton).toBeEnabled();
    });
});
