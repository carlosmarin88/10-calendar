import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store';

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispath = useDispatch();

    const startLogin = async ({ email, password }) => {

        dispath(onChecking());
        //console.log({email, password});
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispath(onLogin({ name: data.name, uid: data.uid }));
            //console.log({ resp });

        } catch (error) {
            console.log({ error });
            dispath(onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispath(clearErrorMessage());
            }, 10);
        }
    }

    const startRegister = async ({ name, email, password }) => {
        dispath(onChecking());

        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispath(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            console.error({ error });
            const { data } = error.response;
            const errorMessage = !!data.msg ? data.msg : data.errors.password.msg;
            dispath(onLogout(errorMessage));
            setTimeout(() => {
                dispath(clearErrorMessage());
            }, 10);
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispath(onLogout());
        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispath(onLogin({ name: data.name, uid: data.uid }));
        } catch (error) {
            localStorage.clear();
            dispath(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispath(onLogout());
    }

    return {
        /* properties */
        errorMessage,
        status,
        user,

        /* methods */
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }
}