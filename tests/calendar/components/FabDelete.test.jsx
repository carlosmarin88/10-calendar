import { fireEvent, render, screen } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks";


jest.mock('../../../src/hooks/useCalendarStore');

describe('Test in <FabDelete />', () => { 


    const mockStartDeletingEvent = jest.fn();

    beforeEach(()=> jest.clearAllMocks());

    test('Should show the components sucessfully', () => { 

        useCalendarStore.mockReturnValue({
            hasEvenSelected: false
        });

        render(<FabDelete />);
        //screen.debug();
        const btn = screen.getByLabelText('btn-delete');
        //console.log(btn.classList.toString());
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');
     });


     test('Should show the button if there is an active event', () => { 

        useCalendarStore.mockReturnValue({
            hasEvenSelected: true
        });

        render(<FabDelete />);
        const btn = screen.getByLabelText('btn-delete');
        
        expect(btn.style.display).not.toBe('');
     });


     test('Should call startDeletingEvent if there is an active event', () => { 

        useCalendarStore.mockReturnValue({
            hasEvenSelected: true,
            startDeletingEvent: mockStartDeletingEvent
        });

        render(<FabDelete />);
        const btn = screen.getByLabelText('btn-delete');
        
        expect(btn.style.display).not.toBe('');
        fireEvent.click(btn);

        expect(mockStartDeletingEvent).toHaveBeenCalled();
     });
 });