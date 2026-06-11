import {
  createNote,
  deleteNote,
  findNoteById,
  updateNote,
} from '../dal/prisma/note.dal';
import { findUserByClerkUserId } from '../dal/prisma/user.dal';

export async function createNoteService(args: {
  clerkUserId: string;
  content: string;
  timestamp: number;
  playlistId: string;
  videoId: string;
}) {
  const user = await findUserByClerkUserId(args.clerkUserId);

  if (!user) {
    throw new Error('User not found');
  }

  try {
    const response = await createNote(
      args.playlistId,
      args.videoId,
      args.content,
      user.id,
      args.timestamp
    );

    if (!response || !response.id) {
      throw new Error('Failed to create note');
    }
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
}

export async function updateNoteService(noteId: string, content: string) {
  try {
    const existingNote = await findNoteById(noteId);

    if (!existingNote) {
      throw new Error('Note not found');
    }

    const response = await updateNote(noteId, content);

    if (!response || !response.id) {
      throw new Error('Failed to update note');
    }
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }
}

export async function deleteNoteService(noteId: string) {
  try {
    const existingNote = await findNoteById(noteId);

    if (!existingNote) {
      throw new Error('Note not found');
    }

    const response = await deleteNote(noteId);

    if (!response || !response.id) {
      throw new Error('Failed to delete note');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
}
