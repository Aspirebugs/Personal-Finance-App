import {useState,useEffect} from 'react'
import axios from '../api/axios';
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const LOGIN_URL = '/login';
import {useNavigate, useLocation} from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';

export default function Login() {

    const {auth,setAuth} = useAuth();
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/"; 
    const navigate = useNavigate();

    const [user,setUser] = useState('');
    const [validName,setValidName] = useState(false);

    const [pwd,setPwd] = useState('');
    const [validPwd,setValidPwd] = useState(false);
    
    const [errMsg,setErrMsg] = useState('');

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e)=>{
      e.preventDefault();
      const v1 = USER_REGEX.test(user);
      const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 ) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username : user, password : pwd}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.token;
            setAuth({user : user, pwd : pwd , access : accessToken});
            setUser('');
            setPwd('');
            navigate(from,{replace : true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if(err.response.status === 400){
                setErrMsg('Invalid Inputs')
            }else if (err.response?.status === 401) {
                setErrMsg('Invalid Credentials');
            } else {
                setErrMsg('Registration Failed')
            }
        }
    }

    return  (
          <section>
            {errMsg && (
              <section className="mb-4 px-4 py-2 text-sm text-red-400 bg-red-950 border border-red-600 rounded">
                {errMsg}
              </section>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
              onChange = {(e) => (setUser(e.target.value))}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
              onChange = {(e) => (setPwd(e.target.value))}
            />
            <button
              type="submit"
              className={!validPwd || !validName  ? "w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition cursor-not-allowed" : "w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"}
              disabled = {!validPwd || !validName ? true : false}
            >
              Sign in
            </button>
          </form>
        </section>  
    );    
}
