import React from "react";
import type {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next'
import axios from "axios";
import {useRouter} from "next/router";

interface Todo {
  id: string,
  name: string
}

interface Prop{
  todos: Todo[]
}


const Home: NextPage<Prop> = (props: Prop) => {
  const [todoName, setTodoName] = React.useState<string>('')
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [token, setToken] = React.useState<string>('')
  const router = useRouter()

  React.useEffect(() => {
    const getAuth = window.localStorage.getItem('auth')
    if(!getAuth){
      router.push('/auth/login')
    }

    console.log('this is the token',JSON.parse(getAuth as string).data.token)

    setToken(JSON.parse(getAuth as string).data.token)
  }, [])

  React.useEffect(() => {
    const getTodos = async () => {
      const getAuth = window.localStorage.getItem('auth')
      if(!getAuth){
        router.push('/auth/login')
      }

      const req = await fetch('https://todo-backend-nest-js-sdja8.ondigitalocean.app/todo', {headers: {'Authorization': token}})
      const resTodo = await req.json()
      setTodos(resTodo)
    }

    getTodos().catch()

  }, [token])

  const addTodo = async () => {
    if(todoName && todoName.length > 0){
      const res = await axios.post('https://todo-backend-nest-js-sdja8.ondigitalocean.app/todo', {name: todoName}, {headers: {'content-type': 'application/json', 'Authorization': token}})

      if(res.status < 400){
        setTodos(prevState => [...prevState, res.data])
        setTodoName('')
      }
    }
  }

  const deleteTodo = async (id: string) => {
      const res = await axios.delete(`https://todo-backend-nest-js-sdja8.ondigitalocean.app/todo/${id}`, {headers: {'content-type': 'application/json', 'Authorization': token}})

      if(res.status < 400){
        setTodos(prevState => {
          return  prevState.filter((todo) => todo.id !== id)
        })
      }
  }

  return (
    <div className="max-w-[50%] w-full mx-auto bg-white border p-10 space-y-3">
      <div className="flex justify-center  space-x-3">
        <div className="w-4/5">
          <input
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
            className="border outline-none  py-2 px-4 w-full  rounded" type="text" placeholder="Enter Todo"/>

        </div>

        <button
          onClick={addTodo}
          className="w-1/5 border bg-blue-500 rounded text-white">
          Add
        </button>
      </div>

      <hr/>

      <div className="space-y-2">
        {
          todos && todos.length > 0 && todos.map((todo) => {
            return (
              <div key={todo.id} className="border p-4 flex justify-between items-center">
                <div>{todo.name}</div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                >X</button>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default Home
