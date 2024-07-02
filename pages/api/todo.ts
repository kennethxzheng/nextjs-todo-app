import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        return await postTodo(req, res);
      case "GET":
        return await getTodos(req, res);
      case "PUT":
        return await updateTodo(req, res);
      case "DELETE":
        return await deleteTodo(req, res);
      default:
        res.status(405).end();
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function postTodo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const todo = await prisma.todo.create({
      data: {
        title: String(title),
      },
    });
    res.json(todo);
  } catch (error) {
    console.error("Failed to create todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
}

async function getTodos(req: NextApiRequest, res: NextApiResponse) {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
}

async function updateTodo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, title } = req.body;
    const todo = await prisma.todo.update({
      where: { id: String(id) },
      data: { title: String(title) },
    });
    res.json(todo);
  } catch (error) {
    console.error("Failed to update todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
}

async function deleteTodo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.body;
    await prisma.todo.delete({
      where: { id: String(id) },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
}
