import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store/calendar/calendarSlice';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);
  const { user } = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
    //console.log('calendarEvent', {calendarEvent})
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async (calendarEvent) => {

    try {

      if (calendarEvent.id) {
        //Actualizando
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }
      // Creando
      const { data } = await calendarApi.post('/events', calendarEvent);
      //console.log({data});

      dispatch(onAddNewEvent({
        ...calendarEvent,
        _id: data.event.id,
        user
      }));

    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar', error.response.data.msg, 'error');
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
