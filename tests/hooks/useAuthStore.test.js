import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { initialState, notAuthenticatedState } from '../__fixtures/authStates'
import { act } from "react";
import { testUserCredentials } from '../__fixtures/testUser';
import { calendarApi } from "../../src/api";

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
}

describe('Test in the useAuthStore', () => {

    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    test('should return default value', () => {

        const mockStore = getMockStore(initialState);


        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        });

    });

    test('startLogin should execute login successfully', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin(testUserCredentials);
        });
        //console.log(result.current);

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '66e1d934a290432fe04f9242' }
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('startlogin should failure authentication', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'falso@mail.com', password: '12345' });
        });

        const { errorMessage, status, user } = result.current;
        //console.log({errorMessage, status, user});
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        });
        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('token-init-date')).toBe(null);

        waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );

    });

    test('startRegister should create a user', async () => {

        const newUser = { email: 'algo@mail.com', password: '12345', name: 'Test User 2' };
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });


        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "123ABC",
                name: "Test User 2",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NmVkOGQ3MTA1Y2U4MzYzM2Q3ZmExM2YiLCJuYW1lIjoiVGVzdCBVc2VyIDIiLCJpYXQiOjE3MjY4NDQyNzMsImV4cCI6MTcyNjg1MTQ3M30.45h0rwosjwbkZ52kCaYVgSNyrDdKnvZI9EgGBSigmhA"
            }
        });


        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        //console.log({errorMessage, status, user});
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User 2', uid: '123ABC' }
        });
        //spy.mockRestore();
    });

    test('startRegister should failure create a user', async () => {

        const newUser = { email: 'algo2@mail.com', password: '123456', name: 'Test User 3' };
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockRejectedValue({
            response: {
                data: {
                    ok: false,
                    msg: "Un usuario ya existe con ese correo electronico"
                }
            }
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        //console.log({errorMessage, status, user});
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario ya existe con ese correo electronico',
            status: 'not-authenticated',
            user: {}
        });

        //spy.mockRestore();

    });

    test('checkAuthToken should failure if there are not token', async () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });


    });

    test('checkAuthToken should authenticate the user if there are token', async () => {
        jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "66e1d934a290432fe04f9242",
                name: "Test User",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NmUxZDkzNGEyOTA0MzJmZTA0ZjkyNDIiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNzI3MTg5NzUzLCJleHAiOjE3MjcxOTY5NTN9.89TfarP46_GBD4HwE3uLithKrKkndsDXHMVTB5P7R0E",
            }
        });
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: 'Test User',
                uid: '66e1d934a290432fe04f9242'
            }
        });

    });
});