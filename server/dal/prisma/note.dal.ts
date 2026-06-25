import prisma from '@/lib/prisma';

export async function createNote(
  playlistId: string,
  videoId: string,
  content: string,
  userId: string,
  timestamp: number,
) {
  const note = await prisma.note.create({
    data: {
      content,
      timestamp,
      playlistId,
      videoId,
      userId,
    },
  });

  return note;
}

export async function getNotes(videoId: string, userId: string) {
  return await prisma.note.findMany({
    where: {
      videoId,
      userId
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function updateNote(noteId: string, content: string) {
  return await prisma.note.update({
    where: {
      id: noteId,
    },
    data: {
      content,
    },
  });
}

export async function deleteNote(noteId: string) {
  return await prisma.note.delete({
    where: {
      id: noteId,
    },
  });
}

export async function findNoteById(noteId: string) {
  return await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });
}
