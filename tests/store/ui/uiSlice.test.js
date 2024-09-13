import { onCloseDateModal, onOpenDateModal, uiSlice } from '../../../src/store/ui/uiSlice';

describe('Test in uiSlice', () => {

    test('Should return to the default state', () => {

        //console.log(uiSlice.getInitialState());
        expect(uiSlice.getInitialState()).toEqual({
            isDateModalOpen: false
        });
    });

    test('Should change the isDateModalOpen successfully', ()=> {

        let state = uiSlice.getInitialState();
        state = uiSlice.reducer(state, onOpenDateModal());
       expect(state.isDateModalOpen).toBeTruthy();

       state = uiSlice.reducer(state, onCloseDateModal());
       expect(state.isDateModalOpen).toBeFalsy();
    });
});