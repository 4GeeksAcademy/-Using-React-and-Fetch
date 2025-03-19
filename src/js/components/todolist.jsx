//importamos la biblioteca necesaria(react y sus metodos)
import React, {useEffect, useState} from "react";
// declaramos el componente siempre tiene la misma sintaxis
const Todolist = () =>{
// usestate es un hook de React para manejar el estado inicial del componente
    const[tasks, setTasks] = useState([]) //estado para almacenar las tareas 1º(tasks)almacena la información y set sirve para modificar el valor de tasks
    const[newtask, setnewtask] = useState("")//estado para almacenar la nueva tarea antes de ser agregada a tasks
    
//Función para cargar las tasks desde la API
    const loadTasks = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Andres"); 
            console.log(response)
            const data = await response.json();
            console.log(data)
            
            if (Array.isArray(data)) {
                setTasks(data) //Guardamos la información que nos llega desde la API en Tasks
            } else {
                setTasks([]) // Si no es un array, inicializamos con array vacío
            }  //Guardamos la información que nos llega desde la API en Tasks
        } catch (error) {
            console.log(error)
        }
    }
    //Función para crear una nueva tarea.
    const createTasks = async (taskLabel) => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/Andres",{
                method:"Post",
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({label:taskLabel,is_done: false, user_name: "Andres"})
            });
            console.log(response)
            const newtask = await response.json();
            console.log(newtask)
            setTasks([...tasks, newtask]) //Agregamos la tarea que hemos creado en la API a la lista de tareas
            setnewtask("") //Limpiamos el input donde escribimos las tareas en nuestra aplicación
        } catch (error) {
            console.log(error)
        }
    }
        //Función para eliminar una tarea de manera individaul atentionde a su id
        const deleteTask = async (taskId)=>{
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`,{method:"DELETE"});
                setTasks(tasks.filter(task => task.id !== taskId))//Actualizamos el estado de las tareas con set taks filtramos las tareas en el array de tasks 
                //El filter escribe un nuevo array con toda las tareas que sean estrictamente diferentes por su Id al Id que hemos introducido al principio como parametro  
            } catch (error) {
                console.log(error)
            }
        }
        //Función para eliminar todas las tareas
        const deleteAllTasks = async () => {
            try {
            //Creamos un array de promesas para eliminar cada tarea de manera individual
                const deleteTasks = tasks.map(task => 
                //Hacemos una petición de delete por cada tarea
                    fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                );
                //Esperamos a que se resuelvan todas las promesas si todas las promsas se cumplen
                //se resolvera esta promesa,si cualquiera de las promesas falla se rechazara
                await Promise.all(deleteTasks);
                setTasks([]);
            } catch (error) {
                console.error("Error deleting all tasks:", error);
            }
        };
        //UseEffect se utiliza para ejecutar codigo que depende de efectos secundarios como en este caso 
        //Cargarb las tareas cuando el componente se monta
        useEffect(() =>{
            loadTasks();//Llamamos a la función loadTaks para cargar las tareas cuando el componente se monta
        }, [])
    return(
        <div className="todo-list">
            <h1>
                introduce tu tarea en la agenda.
            </h1>
            {/*campo de entrada que vamos a utilizar para escribir las nuevas tareas */}
             <input type="text" placeholder="escribe aqui tus tareas" value={newtask} onChange={(e)=> setnewtask(e.target.value)} onKeyDown={(e)=> e.key==="Enter" && newtask.trim()!==""&& createTasks(newtask.trim())} />
            {/*boton para eliminar todas las tareas de una sola vez */}
            <button className="delete-all-button" onClick={deleteAllTasks}> 
            borrar todas las tareas x
            </button>
             {/*realizamos un .map del array tasks para mostrar la lista de las tareas */}
             <ul>
                {tasks.length===0?(<li>no hay tareas en la lista, añade mas tareas.</li>):(
                    tasks.map((task)=>(
                       <li key={task.id}>
                        <span style={{ textDecoration: task.is_done ? 'line-through' : 'none' }}>
                            {task.label}
                        </span>
                       </li> 
                    ))
                )}
             </ul>
        </div>
    )
}
export default Todolist;