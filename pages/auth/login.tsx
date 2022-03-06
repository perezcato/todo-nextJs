import React from 'react';
import {NextPage} from "next";
import axios from "axios";
import {useRouter} from "next/router";

const Login: NextPage = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const router = useRouter()

  return (
    <div className="w-screen h-screen">
      <form onSubmit={async (e) => {
        e.preventDefault()

        try{
          const res = await axios.post('https://todo-next-js-naxi6.ondigitalocean.app/api/auth', {email, password})
          if(res && res.status < 400){
            window.localStorage.setItem('auth', JSON.stringify(res.data))
            router.push('/').catch()
          }
        }catch (e){
          setError('Invalid username or password')
        }

      }}>
        <div className="w-1/4 border mx-auto space-y-8 p-8 rounded-md">
          <div>
            {error}
          </div>
          <div className="border py-2 px-4 rounded-md">
            <input
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value) }
              className="w-full outline-none"
              placeholder="Email" type="email"
            />
          </div>
          <div className="border py-2 px-4 rounded-md">
            <input
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value) }
              required
              className="w-full outline-none"
              placeholder="Password"
              type="password"
            />
          </div>

          <button className="bg-blue-400 rounded-md py-2 text-white w-full">
            Submit
          </button>
        </div>
      </form>

    </div>
  );
};

export default Login;