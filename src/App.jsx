import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false); 

  
  useEffect(() => {
    console.log('=== ЗАПУСК ПРИЛОЖЕНИЯ ===');
    
    if (hasLoaded) {
      console.log('Уже загружали, пропускаем');
      return;
    }
    
    const saved = window.localStorage.getItem('my-notes');
    console.log('Из localStorage:', saved);
    
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Распарсили, заметок:', parsed.length);
        
        setNotes(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Ошибка парсинга:', error);
        createFirstNote();
      }
    } else {
      console.log('Первый запуск приложения');
      createFirstNote();
    }
    
    setHasLoaded(true);
  }, [hasLoaded]);
  
  useEffect(() => {
    if (!hasLoaded) return;
    
    console.log('Сохраняем заметки:', notes.length);
    window.localStorage.setItem('my-notes', JSON.stringify(notes));
  }, [notes, hasLoaded]);

  const createFirstNote = () => {
    console.log('Создаем первую заметку...');
    const firstNote = {
      id: Date.now(),
      text: 'Добро пожаловать в Заметки!\n\nЭто ваша первая заметка.\nВы можете:\n• Создать новую\n• Редактировать эту\n• Удалить заметки\n\nВсе сохраняется автоматически!',
      date: new Date().toLocaleString('ru-RU')
    };
    setNotes([firstNote]);
  };
 
  const addNote = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Введите текст заметки!');
      return;
    }
    
    const newNote = {
      id: Date.now(),
      text: text,
      date: new Date().toLocaleString('ru-RU')
    };
    
    setNotes([newNote, ...notes]);
    setText('');
  };
  
  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };
  
  const saveEdit = () => {
    if (!editText.trim()) {
      alert('Заметка не может быть пустой!');
      return;
    }
    
    const updatedNotes = notes.map(note => 
      note.id === editingId 
        ? { ...note, text: editText }
        : note
    );
    
    setNotes(updatedNotes);
    setEditingId(null);
  };
  
  const deleteNote = (id) => {
    if (window.confirm('Удалить заметку?')) {
      const newNotes = notes.filter(note => note.id !== id);
      setNotes(newNotes);
      
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>📝 Заметки на React</h1>
        <p>Сохранение в localStorage работает!</p>
        <div className="header-info">
          <span>Заметок: {notes.length}</span>
          <span>• Загружено: {hasLoaded ? 'да' : 'нет'}</span>
        </div>
      </header>

      <main>
        <div className="form-container">
          <form onSubmit={addNote}>
            <textarea
              placeholder="Введите текст заметки..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
            />
            <button type="submit">+ Добавить</button>
          </form>
        </div>

        <div className="notes-container">
          <h2>Мои заметки {notes.length > 0 && `(${notes.length})`}</h2>
          
          {notes.length === 0 ? (
            <div className="empty">
              <p>Заметок пока нет</p>
              <button onClick={() => {
                const newNote = {
                  id: Date.now(),
                  text: 'Пример заметки',
                  date: new Date().toLocaleString('ru-RU')
                };
                setNotes([newNote]);
              }} className="create-btn">
                Создать пример
              </button>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map(note => (
                <div key={note.id} className={`note ${editingId === note.id ? 'editing' : ''}`}>
                  {editingId === note.id ? (
                    <div className="edit-mode">
                      <h4>✏️ Редактирование</h4>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="4"
                        autoFocus
                      />
                      <div className="edit-btns">
                        <button onClick={saveEdit} className="save">💾 Сохранить</button>
                        <button onClick={() => setEditingId(null)} className="cancel">❌ Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <div className="view-mode">
                      <div className="note-text">
                        <p>{note.text}</p>
                      </div>
                      <div className="note-footer">
                        <div className="note-btns">
                          <button onClick={() => startEdit(note)} className="edit">✏️</button>
                          <button onClick={() => deleteNote(note.id)} className="delete">🗑️</button>
                        </div>
                        <div className="note-date">
                          <small>{note.date}</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <p><strong>React Notes App</strong> • localStorage: {window.localStorage.getItem('my-notes') ? 'работает' : 'не работает'}</p>
          <button 
            className="debug-btn"
            onClick={() => {
              console.log('=== DEBUG INFO ===');
              console.log('localStorage:', window.localStorage.getItem('my-notes'));
              console.log('notes state:', notes);
              console.log('hasLoaded:', hasLoaded);
            }}
          >
            Отладка в Console
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;