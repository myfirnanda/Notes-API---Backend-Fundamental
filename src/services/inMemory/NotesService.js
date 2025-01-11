const { nanoid } = require("nanoid");

class NotesService {
  constructor() {
    this._notes = [];
  }

  addNote({title, body, tags}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const newNote = { title, tags, body, id, createdAt, updateAt };

    this._notes.push(newNote);

    const isSuccess = this._notes.filter(note => note.id === id).length > 0;

    if (!isSuccess) {
        throw new Error("Catatan Gagal Ditambahkan");
    }

    return id;
  };

  getNotes() {
    return this._notes;
  };

  getNoteById(id) {
    const note = this._notes.filter(n => n.id === id)[0];

    if (!note) {
        throw new Error('Catatan Tidak Ditemukan');
    }

    return note;
  };

  editNoteById(id, {title, body, tags}) {
    const index = this._notes.findIndex(note => note.id === id);

    if (index !== -1) {
        throw new Error('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    const updateAt = new Date().toISOString();

    this._notes[index] = {
        ...this.notes[index],
        title,
        tags,
        body,
        updateAt,
    }
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex(note => note.id === id).length > 0;

    if (index === -1) {
        throw new Error('Catatan gagal dihapus. Id tidak ditemukan');
    }

    this._notes.splice(index, 1);
  }
}

module.exports = NotesService;
