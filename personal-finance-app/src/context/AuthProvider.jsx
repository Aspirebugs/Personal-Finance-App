import {createContext,useState} from 'react';

export const AuthContext = createContext({});

export default function AuthProvider({children}){
    const [auth,setAuth] = useState({});
    return(
        <AuthContext value = {{auth,setAuth}}>
            {children}
        </AuthContext>
    );
};