import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store/calendar/calendarSlice';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';

export const useCalendarStore = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);
  const { user } = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
    //console.log('calendarEvent', {calendarEvent})
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async (calendarEvent) => {
    //TODO: Update event

    //Todo bien
    if (calendarEvent._id) {
      //Actualizando
      dispatch(onUpdateEvent({ ...calendarEvent }));
    } else {
      // Creando
      const { data } = await calendarApi.post('/events', calendarEvent);
      //console.log({data});

      dispatch(onAddNewEvent({
        ...calendarEvent,
        _id: data.event.id,
        user
      }));
    }
  }

  const startDeletingEvent = async () => {
    dispatch(onDeleteEvent());
  }

  const startLoadingEvents = async () => {
    try {

      const { data } = await calendarApi.get('/events');
      //console.log('get events',{data});
      const events = convertEventsToDateEvents(data.events);
      //console.log({events});
      dispatch(onLoadEvents(events));

    } catch (error) {
      console.error('Error cargando evento');
      console.error(error);
    }
  }

  return {

    //properties
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    //methods
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
  }
}
