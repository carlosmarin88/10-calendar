import calendarApi from "../../src/api/calendarApi"

describe('Test in the CalendarApi', () => { 

    test('It must have the default configuration', () => { 

       // console.log(calendarApi);
       // console.log(process.env);
       expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
     });

     test('Its must have the x-token in the header of all requests', async() => { 

        const token = 'ABC-123'
        localStorage.setItem('token', token);
        const res = await calendarApi.get('/auth');
        //console.log(res);
        //console.log(res.config.headers['x-token']);
        expect(res.config.headers['x-token']).toBe(token);
      });

 });