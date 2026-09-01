import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { InvitationConfig } from "./types";

const CLIENTS_DIR = join(process.cwd(), "content", "clients");

/**
 * Loads a client configuration JSON by slug.
 * Returns null if the client file does not exist.
 */
export async function getClientBySlug(slug: string): Promise<InvitationConfig | null> {
  const filePath = join(CLIENTS_DIR, `${slug}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent) as InvitationConfig;
    return data;
  } catch (error) {
    console.error(`[ERROR] Failed to load client config for slug: ${slug}`, error);
    return null;
  }
}

/**
 * Returns all available client slugs for static generation.
 */
export async function getAllClientSlugs(): Promise<string[]> {
  if (!existsSync(CLIENTS_DIR)) {
    return [];
  }

  try {
    const files = await readdir(CLIENTS_DIR);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""));
  } catch (error) {
    console.error("[ERROR] Failed to read clients directory", error);
    return [];
  }
}
