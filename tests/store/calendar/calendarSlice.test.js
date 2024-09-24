import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../__fixtures/calendarStates";

describe('Test in calendarSlice', () => {

    test('should return default state', () => {

        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    });

    test('when trigger onSetActiveEvent should active the event', () => {

        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        //console.log(state);
        expect(state.activeEvent).toEqual(events[0]);
    });

    test('when trigger onAddNewEvent should add the event', () => {

        const newEvent = {
            id: "3",
            start: new Date('2024-09-21 13:00:00'),
            end: new Date('2024-09-21 15:00:00'),
            title: 'Primavera',
            notes: 'alguna nota de primavera',
        }

        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
        //console.log(state);
        expect(state.events).toEqual([...events, newEvent]);
    });

    test('when trigger onUpdateEvent should update event', () => {

        const updatedEvent = {
            id: "1",
            start: new Date('2024-09-21 13:00:00'),
            end: new Date('2024-09-21 15:00:00'),
            title: 'Primavera',
            notes: 'alguna nota de primavera',
        }

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));
        //console.log(state);
        expect(state.events).toContain(updatedEvent);
    });

    test('when trigger onDeleteEvent should remove active event', () => {
        //console.log(calendarWithActiveEventState);
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        //console.log(state);
        expect(state.activeEvent).toBe(null);
        expect(state.events).not.toContain(calendarWithActiveEventState.activeEvent);
    });

    test('when trigger onLoadEvents should set events', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));
        expect(state).toEqual({
            isLoadingEvents: false,
            events,
            activeEvent: null
        });
    });

    test('when trigger onLogoutCalendar should clear the event', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
        //console.log(state);
        expect(state).toEqual(initialState);
    });

});