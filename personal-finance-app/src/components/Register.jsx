import {useState,useEffect} from 'react'
import axios from '../api/axios';
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export default function Register() {
    const [user,setUser] = useState('');
    const [validName,setValidName] = useState(false);

    const [email,setEmail] = useState('');
    const [validMail,setValidMail] = useState(false);

    const [pwd,setPwd] = useState('');
    const [validPwd,setValidPwd] = useState(false);
    
    const [errMsg,setErrMsg] = useState('');
    const [success,setSuccess] = useState(false);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd])

    useEffect(() => {
        setValidMail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, email])

    const handleSubmit = async (e)=>{
      e.preventDefault();
      const v1 = USER_REGEX.test(user);
      const v2 = PWD_REGEX.test(pwd);
      const v3 = EMAIL_REGEX.test(email)
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username : user, email , password : pwd}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setSuccess(true);
            setUser('');
            setPwd('');
            setEmail('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if(err.response.status === 400){
                setErrMsg('Invalid inputs')
            }else if (err.response?.status === 409) {
                setErrMsg('Username or Email Taken');
            } else {
                setErrMsg('Registration Failed')
            }
        }
    }

    return  (
      <>
        { success ? 
          <section className='flex items-center justify-center'>
            <p> Now head to Login in page</p>
          </section>
          :  
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
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
              onChange = {(e) => (setEmail(e.target.value))}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
              onChange = {(e) => (setPwd(e.target.value))}
            />
            <button
              type="submit"
              className={!validMail || !validName || !validPwd ? "w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition cursor-not-allowed" : "w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"}
              disabled = {!validMail || !validName || !validPwd ? true : false}
            >
              Sign Up
            </button>
          </form>
        </section>  
    }
    </>
    );    
}
