/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from '../containers/Bills.js'
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async() => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            const iconActivated = windowIcon.classList.contains('active-icon')
            expect(iconActivated).toBeTruthy()
        })
        test("Then bills should be ordered from earliest to latest", () => {
            const html = BillsUI({ data: bills })
            document.body.innerHTML = html
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => (a < b ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })
    })
    describe("When I am on Bills Page and I click on the icon eye", () => {
        test("Then it should open the modal", () => {
            const html = BillsUI({
                data: bills
            });
            document.body.innerHTML = html;
            const store = null;
            const billsList = new Bills({ document, onNavigate, store, localStorage: window.localStorage, });
            const icon = screen.getAllByTestId('icon-eye')[0];
            const handleClickIconEye = jest.fn(() =>
                billsList.handleClickIconEye(icon)
            );
            icon.addEventListener('click', handleClickIconEye);
            fireEvent.click(icon);
            expect(handleClickIconEye).toHaveBeenCalled();
            const modale = document.getElementById('modaleFile');
            expect(modale).toBeTruthy();
        })
    })
    describe("When I click on 'Send a new bill' page", () => {
        test("Then I should be sent to 'New bill page'", () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            const navigationButton = screen.getByTestId('btn-new-bill');
            const navigate = jest.fn(window.onNavigate(ROUTES_PATH.NewBill));
            navigationButton.addEventListener("click", navigate);
            fireEvent.click(navigationButton);
            expect(navigate).toHaveBeenCalled();
            const content_header = document.querySelector('.content-header');
            const form = document.querySelector('.form-newbill-container');
            const content = document.querySelector('.content')
            expect(content.querySelector(content_header)).toBeTruthy()
            expect(content.querySelector(form)).toBeTruthy()
        })
    })
})