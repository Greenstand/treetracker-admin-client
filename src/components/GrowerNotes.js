import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import growerNotesApi from '../api/growerNotes';
import { AppContext } from '../context/AppContext';
import { hasPermission, POLICIES } from '../models/auth';
import { getDateTimeStringLocale } from '../common/locale';

// Shown when the backend API is not yet available
const MOCK_NOTES = [
  {
    id: 1,
    content:
      'Grower has been active since 2021. Participated in the reforestation program in the northern region.',
    authorName: 'Jane Doe',
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 2,
    content: 'Follow-up needed regarding device registration issue.',
    authorName: 'Admin Panel',
    createdAt: '2026-04-01T08:30:00Z',
    updatedAt: '2026-04-01T08:30:00Z',
  },
];

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  noteCard: {
    backgroundColor: '#fdf8ee',
    border: '1px solid #e8d9b0',
    borderRadius: 8,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  noteCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
  },
  noteAuthorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  avatar: {
    width: 28,
    height: 28,
    fontSize: '0.75rem',
    backgroundColor: theme.palette.primary.main,
  },
  authorName: {
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  timestamp: {
    fontSize: '0.78rem',
    color: theme.palette.text.secondary,
  },
  internalLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  noteContent: {
    fontSize: '0.9rem',
    marginTop: theme.spacing(0.5),
    whiteSpace: 'pre-wrap',
  },
  editButton: {
    minWidth: 'auto',
    padding: theme.spacing(0, 1),
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  newNoteBox: {
    marginTop: theme.spacing(2),
  },
  textarea: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  emptyText: {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(2),
  },
}));

const GrowerNotes = ({ growerId }) => {
  const classes = useStyles();
  const { user } = useContext(AppContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const canManage = hasPermission(user, [
    POLICIES.SUPER_PERMISSION,
    POLICIES.MANAGE_GROWER,
  ]);

  useEffect(() => {
    if (growerId) {
      loadNotes();
    }
    // eslint-disable-next-line
  }, [growerId]);

  async function loadNotes() {
    setLoading(true);
    try {
      const result = await growerNotesApi.getNotes(growerId);
      setNotes(result || []);
    } catch {
      // Backend not available yet — show mock data during development
      setNotes(MOCK_NOTES);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote() {
    if (!newNoteText.trim()) return;
    setSaving(true);
    try {
      await growerNotesApi.addNote(growerId, newNoteText.trim());
      setNewNoteText('');
      await loadNotes();
    } catch {
      // Backend not ready — optimistically add to local state
      setNotes((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: newNoteText.trim(),
          authorName: user?.userName || 'Admin Panel',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setNewNoteText('');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateNote(noteId) {
    if (!editingText.trim()) return;
    setSaving(true);
    try {
      await growerNotesApi.updateNote(growerId, noteId, editingText.trim());
      setEditingNoteId(null);
      setEditingText('');
      await loadNotes();
    } catch {
      // Backend not ready — update local state directly
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? {
                ...n,
                content: editingText.trim(),
                updatedAt: new Date().toISOString(),
              }
            : n
        )
      );
      setEditingNoteId(null);
      setEditingText('');
    } finally {
      setSaving(false);
    }
  }

  function handleEditClick(note) {
    setEditingNoteId(note.id);
    setEditingText(note.content);
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setEditingText('');
  }

  async function handleDeleteNote() {
    setSaving(true);
    try {
      await growerNotesApi.deleteNote(growerId, deletingNoteId);
      await loadNotes();
    } catch {
      // Backend not ready — remove from local state directly
      setNotes((prev) => prev.filter((n) => n.id !== deletingNoteId));
    } finally {
      setDeletingNoteId(null);
      setSaving(false);
    }
  }

  function isNoteAuthor(note) {
    return note.authorName === user?.userName;
  }

  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <>
      <Divider />
      <Box className={classes.section}>
        <Typography variant="subtitle1" className={classes.header}>
          Admin Notes
          <Typography className={classes.internalLabel}>
            Only visible to admin panel
          </Typography>
        </Typography>

        {loading && <CircularProgress size={20} />}

        {!loading && notes.length === 0 && (
          <Typography className={classes.emptyText}>No notes yet.</Typography>
        )}

        {!loading &&
          notes.map((note) => (
            <Box key={note.id} className={classes.noteCard}>
              <Box className={classes.noteCardHeader}>
                <Box className={classes.noteAuthorRow}>
                  <Avatar className={classes.avatar}>
                    {getInitials(note.authorName)}
                  </Avatar>
                  <Box>
                    <Typography className={classes.authorName}>
                      {note.authorName}
                    </Typography>
                    <Typography className={classes.timestamp}>
                      {getDateTimeStringLocale(note.createdAt)}
                      {note.updatedAt !== note.createdAt && ' (edited)'}
                    </Typography>
                  </Box>
                </Box>
                <Box style={{ display: 'flex', gap: 4 }}>
                  {canManage && editingNoteId !== note.id && (
                    <Button
                      size="small"
                      className={classes.editButton}
                      onClick={() => handleEditClick(note)}
                      startIcon={<EditIcon fontSize="small" />}
                    >
                      Edit
                    </Button>
                  )}
                  {isNoteAuthor(note) && editingNoteId !== note.id && (
                    <Button
                      size="small"
                      className={classes.editButton}
                      onClick={() => setDeletingNoteId(note.id)}
                      startIcon={<DeleteIcon fontSize="small" />}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </Box>

              {editingNoteId === note.id ? (
                <Box>
                  <TextField
                    className={classes.textarea}
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                  />
                  <Box className={classes.actionRow}>
                    <Button size="small" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={saving || !editingText.trim()}
                      onClick={() => handleUpdateNote(note.id)}
                    >
                      {saving ? <CircularProgress size={16} /> : 'Save'}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography className={classes.noteContent}>
                  {note.content}
                </Typography>
              )}
            </Box>
          ))}

        {canManage && (
          <Box className={classes.newNoteBox}>
            <TextField
              className={classes.textarea}
              multiline
              rows={3}
              variant="outlined"
              size="small"
              placeholder="Write a note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <Box className={classes.actionRow}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={saving || !newNoteText.trim()}
                onClick={handleAddNote}
              >
                {saving ? <CircularProgress size={16} /> : 'Comment'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={deletingNoteId !== null}
        onClose={() => setDeletingNoteId(null)}
      >
        <DialogTitle>Delete this note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This note will be permanently deleted and cannot be recovered.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingNoteId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteNote}
            color="secondary"
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={16} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GrowerNotes;
