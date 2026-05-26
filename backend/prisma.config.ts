import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://postgres.skqbqnaphjkqvigtxfcc:ClarixAI%402026@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
    directUrl:
      "postgresql://postgres.skqbqnaphjkqvigtxfcc:ClarixAI%402026@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
  },
});
