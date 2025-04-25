// src/validators/categoryValidator.ts

import { Response } from "express";

export function parseAndValidateCategories(raw: any, res: Response): string[] | null {
  let parsedCategories: string[] = [];

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        parsedCategories = parsed;
      } else {
        res.status(400).send({ message: 'categories must be an array of strings' });
        return null;
      }
    } catch {
      res.status(400).send({ message: 'Invalid categories format' });
      return null;
    }
  } else if (Array.isArray(raw) && raw.every(item => typeof item === 'string')) {
    parsedCategories = raw;
  } else {
    res.status(400).send({ message: 'Missing or invalid categories' });
    return null;
  }

  return parsedCategories;
}
