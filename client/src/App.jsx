import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';

const COLUMNS = [
  { key: 'todo', label: 'To do' },
  { key: 'doing', label: 'In progress' },
  { key: 'done', label: 'Done' },
];
const EMPTY = { title: '', notes: '', priority: 'medium', dueDate: '', tags: '' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q = search) => {
    try { setTasks(await getTasks(q)); setError(''); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(''); }, []);
  useEffect(() => { const t = setTimeout(() => load(search), 250); return () => clearTimeout(t); }, [search]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) await updateTask(editingId, payload);
      else await createTask(payload);
      setForm(EMPTY); setEditingId(null); await load();
    } catch (err) { setError(err.message); }
  };

  const edit = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title, notes: t.notes, priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '', tags: t.tags.join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const move = async (t, status) => { try { await updateTask(t._id, { status }); await load(); } catch (e) { setError(e.message); } };
  const remove = async (id) => { try { await deleteTask(id); await load(); } catch (e) { setError(e.message); } };

  return (
    <div className="app">
      <header className="top">
        <h1>flexi</h1>
        <input className="search" placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} />
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      <form className="composer" onSubmit={submit}>
        <input required maxLength={120} placeholder="What needs doing?" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Notes (optional)" value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <input placeholder="Tags, comma separated" value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <button type="submit">{editingId ? 'Save changes' : 'Add task'}</button>
        {editingId && <button type="button" className="ghost" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancel</button>}
      </form>

      {loading ? <p className="muted">Loading tasks…</p> : (
        <main className="board">
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.status === col.key);
            return (
              <section key={col.key} className="col">
                <h2>{col.label} <span className="count">{items.length}</span></h2>
                {items.length === 0 && <p className="muted">Nothing here yet.</p>}
                {items.map((t) => (
                  <article key={t._id} className={`card p-${t.priority}`}>
                    <h3>{t.title}</h3>
                    {t.notes && <p>{t.notes}</p>}
                    <div className="meta">
                      {t.dueDate && <span>Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                      {t.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <div className="actions">
                      {COLUMNS.filter((c) => c.key !== t.status).map((c) => (
                        <button key={c.key} className="ghost" onClick={() => move(t, c.key)}>Move to {c.label.toLowerCase()}</button>
                      ))}
                      <button className="ghost" onClick={() => edit(t)}>Edit</button>
                      <button className="ghost danger" onClick={() => remove(t._id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </main>
      )}
    </div>
  );
}
