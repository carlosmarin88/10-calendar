export const events = [
    {
        id: "1",
        start: new Date('2024-09-13 13:00:00'),
        end: new Date('2024-09-13 15:00:00'),
        title: 'Cumple Pedro',
        notes: 'Alguna nota',
    },
    {
        id: "2",
        start: new Date('2024-09-16 13:00:00'),
        end: new Date('2024-09-16 15:00:00'),
        title: 'Cumple Hector',
        notes: 'Alguna nota para hector',
    }
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: { ...events[0] }
}