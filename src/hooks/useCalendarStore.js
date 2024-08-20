import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store/calendar/calendarSlice';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent} = useSelector(state => state.calendar);

    const setActiveEvent = (calendarEvent) => {
      //console.log('calendarEvent', {calendarEvent})
      dispatch(onSetActiveEvent(calendarEvent));
    }

    const startSavingEvent = async(calendarEvent) => {
      //TODO: llegar al backend

      //Todo bien
      if(calendarEvent._id){
        //Actualizando
        dispatch(onUpdateEvent({...calendarEvent}));
      }else {
        // Creando
        dispatch(onAddNewEvent({
          ...calendarEvent,
          _id: new Date().getTime()
        }));
      }
    }

    const startDeletingEvent = async() => {
      dispatch(onDeleteEvent());
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
  }
}
