import { AppError } from '@/lib/errors/appError';
import {
  createNote,
  deleteNote,
  findNoteById,
  updateNote,
} from '../dal/prisma/note.dal';

export async function createNoteService(args: {
  userId: string;
  content: string;
  timestamp: number;
  playlistId: string;
  videoId: string;
}) {
  const response = await createNote(
    args.playlistId,
    args.videoId,
    args.content,
    args.userId,
    args.timestamp
  );

  if (!response || !response.id) {
    throw new AppError("Failed to create note", 500, "FAILED_TO_CREATE_NOTE")
  }

  return response;

}

export async function updateNoteService(noteId: string, content: string, userId: string) {

  const existingNote = await findNoteById(noteId);

  if (!existingNote) {
    throw new AppError("Note not found", 404, "NOTE_NOT_FOUND")
  }

  if (existingNote.userId !== userId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const response = await updateNote(noteId, content);

  if (!response || !response.id) {
    throw new AppError("Failed to update note", 500, "FAILED_TO_UPDATE_NOTE")
  }

  return response;
}

export async function deleteNoteService(noteId: string, userId: string) {

  const existingNote = await findNoteById(noteId);

  if (!existingNote) {
    throw new AppError("Note not found", 404, "NOTE_NOT_FOUND")
  }

  if (existingNote.userId !== userId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const response = await deleteNote(noteId);

  if (!response || !response.id) {
    throw new AppError("Failed to delete note", 500, "FAILED_TO_DELETE_NOTE")
  }

  return response;
}
