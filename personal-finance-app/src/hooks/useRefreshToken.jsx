import axios from '../api/axios';
import useAuth from './useAuth';
const REFRESH_URL = '/refresh';

const useRefreshToken = () =>{

    const {auth,setAuth} = useAuth();
    const refresh = async () => {
        const response = await axios.get(REFRESH_URL,{
            withCredentials : true
        });

        setAuth({auth,access : response.data.token});
        
        return response.data.token;
    };


    return refresh;
};
export default useRefreshToken;