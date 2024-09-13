import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState } from "../../__fixtures/authStates";
import { testUserCredentials } from "../../__fixtures/testUser";

describe('Test in authSlice', () => {


    test('Should return to the default state', () => {

        expect(authSlice.getInitialState()).toEqual(initialState);

    });

    test('Should login successfully', () => {

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
        //console.log(state);
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessge: undefined
        });
    });

    test('Should logout successfully', () => {

        const errorMessage = 'Credenciales no validas';
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage
            ///errorMessge: undefined
        })
    });

    test('should clear error message', () => {
        const errorMessage = 'Credenciales no validas';
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        const newState = authSlice.reducer(state, clearErrorMessage());
        expect(newState.errorMessage).toBe(undefined);

    });

});