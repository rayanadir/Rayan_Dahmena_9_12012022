/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";

import store from "../__mocks__/store.js";

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
            const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
            const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
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
            expect(input.files[0].name).toBe('image.png');
        })
        test("Then a bill is created", () => {
            const html = NewBillUI();
            document.body.innerHTML = html;
            const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
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
            const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
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
            expect(input.files[0].name).toBe('image.txt');
        })
    })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
    describe("When I add a new bill", () => {
        test("Then it creates a new bill", () => {
            const newBill = {
                "id": "47qAXb6fIm2zOKkLzMro",
                "vat": "80",
                "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                "status": "pending",
                "type": "Hôtel et logement",
                "commentary": "séminaire billed",
                "name": "encore",
                "fileName": "preview-facture-free-201801-pdf-1.jpg",
                "date": "2004-04-04",
                "amount": 400,
                "commentAdmin": "ok",
                "email": "a@a",
                "pct": 20
            };
            const createBill = jest.fn(() => store.bills().create(newBill))
            const send = screen.getByTestId('form-new-bill');
            send.addEventListener('submit', createBill)
            fireEvent(createBill)
            expect(createBill).toHaveBeenCalled()
        })
        test("Then it fails with a 404 message error", async() => {
            const html = BillsUI({ error: 'Erreur 404' })
            document.body.innerHTML = html;
            const message = await screen.getByText(/Erreur 404/);
            expect(message).toBeTruthy();
        })
        test("Then it fails with a 500 message error", async() => {
            const html = BillsUI({ error: 'Erreur 500' })
            document.body.innerHTML = html;
            const message = await screen.getByText(/Erreur 500/);
            expect(message).toBeTruthy();
        })
    })
})