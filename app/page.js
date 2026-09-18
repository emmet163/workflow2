'use client';

import { useMemo, useState } from 'react';

const initialTasks = [
  { id: 1, title: 'Accounting homework', course: 'Accounting', due: 'Tomorrow', minutes: 45, done: false },
  { id: 2, title: 'Economics quiz review', course: 'Economics', due: 'Friday', minutes: 35, done: false },
  { id: 3, title: 'English reading', course: 'English', due: 'Monday', minutes: 30, done: false }
];

const initialEvents = [
  ['Monday', '10:00 AM', 'Accounting', 'Class'],
  ['Monday', '1:00 PM', 'Economics', 'Class'],
  ['Tuesday', '9:30 AM', 'English', 'Class'],
  ['Tuesday', '3:30 PM', 'Accounting study', 'Study'],
  ['Wednesday', '1:00 PM', 'Economics', 'Class'],
  ['Thursday', '10:00 AM', 'Accounting', 'Class'],
  ['Thursday', '4:00 PM', 'Essay work', 'Assignment'],
  ['Friday', '9:30 AM', 'English', 'Class']
];

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [events, setEvents] = useState(initialEvents);  
  const [task, setTask] = useState({ title:'', course:'', due:'', minutes:'30' });
  const [event, setEvent] = useState({ day:'Monday', time:'', name:'', type:'Class' });
  
const [uploadedFile, setUploadedFile] = useState(null);
  
  const next = tasks.find(t => !t.done);
  const completed = tasks.filter(t => t.done).length;

  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  }

  function addTask(e) {
    e.preventDefault();
    if (!task.title || !task.course || !task.due) return;
    setTasks([...tasks, { id: Date.now(), ...task, minutes: Number(task.minutes) || 30, done:false }]);
    setTask({ title:'', course:'', due:'', minutes:'30' });
  }

  function addEvent(e) {
    e.preventDefault();
    if (!event.name || !event.time) return;
    setEvents([...events, [event.day, event.time, event.name, event.type]]);
    setEvent({ day:'Monday', time:'', name:'', type:'Class' });
  }

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">YOUR SCHOOL COMMAND CENTER</div>
          <h1>SchoolFlow</h1>
          <p>Schedule, assignments, and study planning in one place.</p>
        </div>
        <button className="connect" disabled>Connect Marquette D2L — coming next</button>
      </header>

      <section className="heroGrid">
        <article className="card featured">
          <span>UP NEXT</span>
          <h2>{next ? next.title : 'You’re caught up'}</h2>
          <p>{next ? `${next.course} • ${next.due} • ~${next.minutes} min` : 'No unfinished assignments.'}</p>
        </article>
        <article className="card stat">
          <span>PROGRESS</span>
          <strong>{completed}/{tasks.length}</strong>
          <p>assignments finished</p>
        </article>
      </section>

      <section>
        <div className="sectionHead">
          <div><span className="eyebrow">WEEK AT A GLANCE</span><h2>Weekly schedule</h2></div>
        </div>
        <div className="calendar">
          {days.map(day => (
            <div className="day" key={day}>
              <h3>{day}</h3>
              {events.filter(x => x[0] === day).map((x,i) => (
                <div className="event" key={i}><small>{x[1]} • {x[3]}</small><b>{x[2]}</b></div>
              ))}
            </div>
          ))}
        </div>
        <form className="inlineForm" onSubmit={addEvent}>
          <select value={event.day} onChange={e=>setEvent({...event,day:e.target.value})}>{days.map(d=><option key={d}>{d}</option>)}</select>
          <input type="time" value={event.time} onChange={e=>setEvent({...event,time:e.target.value})}/>
          <input placeholder="Class or study block" value={event.name} onChange={e=>setEvent({...event,name:e.target.value})}/>
          <select value={event.type} onChange={e=>setEvent({...event,type:e.target.value})}><option>Class</option><option>Study</option><option>Assignment</option><option>Personal</option></select>
          <button>Add to schedule</button>
        </form>
      </section>

      <section className="twoCol">
        <div>
          <div className="sectionHead"><div><span className="eyebrow">WORK QUEUE</span><h2>Assignments</h2></div></div>
          <div className="taskList">
            {tasks.map(t => (
              <label className={`task ${t.done ? 'done':''}`} key={t.id}>
                <input type="checkbox" checked={t.done} onChange={()=>toggleTask(t.id)}/>
                <div><b>{t.title}</b><small>{t.course} • {t.due} • ~{t.minutes} min</small></div>
              </label>
            ))}
          </div>
          <form className="taskForm" onSubmit={addTask}>
            <input placeholder="Assignment" value={task.title} onChange={e=>setTask({...task,title:e.target.value})}/>
            <input placeholder="Course" value={task.course} onChange={e=>setTask({...task,course:e.target.value})}/>
            <input type="date" value={task.due} onChange={e=>setTask({...task,due:e.target.value})}/>
            <input type="number" min="5" max="600" value={task.minutes} onChange={e=>setTask({...task,minutes:e.target.value})}/>
            <button>Add assignment</button>
          </form>
        </div>

        <aside className="card planner">
          <span>AI PLANNER</span>
          <h2>What should I work on?</h2>
          <p>{next ? `Start with ${next.title}. Set aside about ${next.minutes} minutes, then move to your next unfinished deadline.` : 'Everything on your list is complete.'}</p>
          <div className="d2l">
            <b>Marquette D2L</b>
            <p>The production version can use an approved Brightspace OAuth connection to import course deadlines without storing your Marquette password.</p>
          </div>
        </aside>
      </section>
              
<section>
  <div className="sectionHead">
    <div>
      <span className="eyebrow">AI IMPORT</span>
      <h2>Upload Schedule or Syllabus</h2>
    </div>
  </div>

  <div className="card">
    <input
      type="file"
      accept=".pdf,image/*"
      onChange={(e) => setUploadedFile(e.target.files[0])}
    />

    {uploadedFile && (
      <div style={{ marginTop: "15px" }}>
        <p>
          <strong>Selected:</strong> {uploadedFile.name}
        </p>

        <button
  onClick={async () => {
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

   if (data.result) {
  console.log(data.result);
  alert(data.result);
} else {
  alert(data.message);
}
  }}
>
  Organize Schedule with AI
</button>
          
      </div>
    )}
  </div>
</section>
      
      <footer>SchoolFlow • Starter build</footer>
    </main>
  );
}
