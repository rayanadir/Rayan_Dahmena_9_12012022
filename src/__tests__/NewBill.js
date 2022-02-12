/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then mail icon in vertical layout should be highlighted", async() => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.NewBill)
            await waitFor(() => screen.getByTestId('icon-mail'))
            const windowIcon = screen.getByTestId('icon-mail')
            const iconActivated = windowIcon.classList.contains('active-icon')
            expect(iconActivated).toBeTruthy()
        })
    })
    describe("When I select an image in a correct format", () => {
        test("Then the input file should display the file name", () => {
            const html = NewBillUI();
            document.body.innerHTML = html;
            const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
            const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
            const input = screen.getByTestId('file');
            input.addEventListener('change', handleChangeFile);
            //fichier au bon format
            fireEvent.change(input, {
                target: {
                    files: [new File(['image.png'], 'image.png', {
                        type: 'image/png'
                    })],
                }
            })
            expect(handleChangeFile).toHaveBeenCalled()
            expect(input).toBe('image.png');
        })
        test("Then a bill is created", () => {
            const html = NewBillUI();
            document.body.innerHTML = html;
            const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
            const handleSubmit = jest.fn(() => newBill.handleSubmit)
            const submit = screen.getByTestId('form-new-bill');
            submit.addEventListener('submit', handleSubmit);
            fireEvent.submit(submit)
            expect(handleSubmit).toHaveBeenCalled();
        })
    })
    describe("When I select a file with an incorrect extension", () => {
            test("Then the bill is deleted", () => {
                const html = NewBillUI();
                document.body.innerHTML = html;
                const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
                const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
                const input = screen.getByTestId('file');
                input.addEventListener('change', handleChangeFile);
                //fichier au mauvais format
                fireEvent.change(input, {
                    target: {
                        files: [new File(['image.txt'], 'image.txt', {
                            type: 'image/txt'
                        })],
                    }
                })
                expect(handleChangeFile).toHaveBeenCalled()
                expect(input).toBe('image.txt');
            })
        })
        /*describe("When I am on NewBill page and I select a file with a different extension than jpg, jpeg or png", () => {
            test("Then the file is deleted", () => {
                const html = NewBillUI();
                document.body.innerHTML = html;

                const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
                const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
                newBill.fileName = null;
                const input = screen.getByTestId('file')
                input.addEventListener('change', handleChangeFile)
                fireEvent.change(input);
                const file = screen.getByTestId('file').value;
                expect(handleChangeFile).toHaveBeenCalled();
            })
            test("Then a message error appears", async() => {
                const html = NewBillUI();
                document.body.innerHTML = html;
                const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
                const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
                const input = screen.getByTestId('file');
                input.addEventListener('change', handleChangeFile);
                expect(handleChangeFile).toHaveBeenCalled();
                await waitFor(() => expect(screen.getByTestId('required_extension').classList).toHaveLength(0));
            })
        })
        describe("When I am on NewBill page and I select a bill in a correct format", () => {
            test("Then it should create a new bill", () => {
                const html = NewBillUI();
                document.body.innerHTML = html;
                const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
                const submit = jest.fn(() => newBill.handleSubmit);
                const submitBtn = screen.getByTestId('form-new-bill');
                submitBtn.addEventListener('submit', submit);
                fireEvent.submit(submit);
                expect(submit).toHaveBeenCalled();
            })
        })*/


})