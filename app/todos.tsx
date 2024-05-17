'use client';

type Todo = {
  id: number;
  title: string;
  done: boolean;
}

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function Todos({todos, setTodos}: TodosProps) {
  
    const deleteTodo = (id: number) => {
      let newTodos: Todo[] = []
      todos.forEach((todo => {
        if (todo.id != id) {
          newTodos.push(todo)
        }
      }))
      setTodos(newTodos)
    }
  
    const toggleTodo = (id: number) => {
      let newTodos = [...todos]
      newTodos.forEach((todo => {
        if (todo.id == id) {
          if (todo.done == false) {
            todo.done = true
          } else {
            todo.done = false
          }
        }
      }))
      setTodos(newTodos)
    }

    return (
        <ul>
            {todos.length != 0 ? (todos.map((todo) => (
            <li key={todo.id}>
                <span
                style={{
                    textDecoration: todo.done == true ? "line-through" : "none",
                    cursor: "pointer"
                }}
                onClick={() => toggleTodo(todo.id)}
                >
                {todo.title} &nbsp; 
                </span>
                <span
                style={{
                    color:"red",
                    cursor: "pointer"
                }}
                onClick={() => deleteTodo(todo.id)}
                >
                🗑
                </span>
            </li>
            ))) : (
            <p>no todos</p>
            )}
        </ul>
    )
}