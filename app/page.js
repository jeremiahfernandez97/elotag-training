import AddTodo from './add-todo'

function Header({ title }) {
  return <h1>{title}</h1>
}

export default function HomePage() {
  const [todos, setTodos] = useState([]);

  return (
    <div>
      <Header title="Jopet's Todo App" />
      <ul>
        {
        todos.length != 0 ? (todos.map((name) => (
          <li key={name}>{name}</li>
        ))) : (
          <>no todos</>
        )}
      </ul>
      <AddTodo />
    </div>
  )
}