import { useUIStore } from "../../src/hooks/useUiStore";
import { Provider } from "react-redux";
import { store, uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react";
import { renderHook } from "@testing-library/react";


const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    });
}

describe('Test in useUiStore', () => {

    test('should return default value', () => {

        const mockStore = getMockStore({
            isDateModalOpen: false,
        });

        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });
        //console.log(result);
        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function)
        });
    });

    test('openDateModal should set true in the isDateModalOpen', () => {
        const mockStore = getMockStore({
            isDateModalOpen: false,
        });

        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const { isDateModalOpen, openDateModal } = result.current;

        act(() => {
            openDateModal()
        });

        //console.log({result: result.current, isDateModalOpen});
        expect(result.current.isDateModalOpen).toBeTruthy();

    });

    test('closeDateModal should set false in the isDateModalOpen', () => {
        const mockStore = getMockStore({
            isDateModalOpen: true,
        });
        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        act(()=> {
            result.current.closeDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy();
    });

    test('toggleDateModal should change status', () => { 

        const mockStore = getMockStore({
            isDateModalOpen: true,
        });
        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        act(()=> {
            result.current.toggleDateModal();
        });

        //console.log({result: result.current});

        expect(result.current.isDateModalOpen).toBeFalsy();

        act(()=> {
            result.current.toggleDateModal();
        });

        expect(result.current.isDateModalOpen).toBeTruthy();

     });
});