import type { Component } from 'solid-js';
import { AiTwotonePlusCircle } from 'solid-icons/ai'
import { FaRegularTrashCan } from 'solid-icons/fa'
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'solid-icons/im'
import { createStore } from "solid-js/store"
import { createSignal } from "solid-js";
import toast, { Toaster } from 'solid-toast';

const App: Component = () => {
  const [inputValue, setInputValue] = createSignal("");
  const [tasks, setTasks] = createStore({
    todo: [
      ...(localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo') || '') : [])
    ], 
    done: [
      ...(localStorage.getItem('done') ? JSON.parse(localStorage.getItem('done') || '') : [])
    ] as { id: number, name: string }[]
  });

  const handleCreateTask = () => {
    if (!inputValue().length) {
      toast.error('Please enter a task!')
      return;
    }

    const updatedTasks = [...tasks.todo, { id: tasks.todo.length, name: inputValue() }];

    setInputValue("");
    setTasks('todo', updatedTasks);
    localStorage.setItem('todo', JSON.stringify(updatedTasks));
    toast.success('Task created!')
  }

  const handleFinishTask = (id: number, from: "todo" | "done", to:  "todo" | "done") => {
    let task = tasks[from].find(task => task.id === id);
    setTasks(from, tasks[from].filter(task => task.id !== id));
    setTasks(to, [...tasks[to], { id: task?.id || 0, name: task?.name || ''}]);

    console.log(tasks[from], tasks[to])

    localStorage.setItem(from, JSON.stringify(tasks[from]));
    localStorage.setItem(to, JSON.stringify(tasks[to]));

    toast.success('Task updated!')
  }

  const handleClearTask = (id: number, type: "todo" | "done") => {
    setTasks(type, tasks[type].filter(task => task.id !== id));
    toast.success('Task deleted!')
  }

  return (
    <div class="h-full w-100 bg-slate-800 flex flex-col items-center gap-2 p-8 py-11">
      <Toaster />
      <h1 class="text-slate-50 text-3xl mb-8">TODO SolidJS</h1>

      <div class="flex gap-1 w-full max-w-[400px] mb-4">
        <input class='p-2 w-full rounded' type="text" placeholder='Enter todo' value={inputValue()} onInput={({ currentTarget: { value } }) => setInputValue(value)} />
        <button onClick={handleCreateTask} class='flex items-center justify-center px-1 w-[100px] bg-slate-50 rounded'><AiTwotonePlusCircle class='text-slate-950 text-2xl' /></button>
      </div>

      <div class='flex flex-col gap-4 w-full max-w-[400px] max-h-[400px] overflow-y-auto'>
        {tasks.todo.map(({ id, name }) => (
          <div id={String(id)} class="flex gap-4 px-4 py-2 border border-slate-50 rounded text-slate-50 justify-between items-center">
            <div class="flex gap-4 items-center">
              <ImCheckboxUnchecked onClick={() => handleFinishTask(id, 'todo', 'done')} class="text-1xl text-slate-50 hover:text-green-500 transition cursor-pointer" />
              {name} 
            </div>
            <FaRegularTrashCan onClick={() => handleClearTask(id, "todo")} class="text-1xl text-slate-50 hover:text-red-500 transition cursor-pointer" />
          </div>
        ))}
      </div>
      
      {!!tasks.done.length && (
        <div class='flex flex-col gap-4 w-full max-w-[400px] mt-10'>
          <h2 class="text-slate-50">Completed tasks</h2>
          {tasks.done.map(({ id, name }) => (
            <div id={String(id)} class="flex gap-4 px-4 py-2 border items-center border-slate-50 rounded text-slate-50 justify-between opacity-70 hover:opacity-100 transition-opacity delay-100">
              <div class="flex gap-4 items-center">
                <ImCheckboxChecked onClick={() => handleFinishTask(id, 'done', 'todo')} class="text-1xl text-slate-50 hover:text-green-500 transition cursor-pointer" />
                {name} 
              </div>
              <FaRegularTrashCan onClick={() => handleClearTask(id, "done")} class="text-1xl text-slate-50 hover:text-red-500 transition cursor-pointer" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
