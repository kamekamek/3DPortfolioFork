import type { Express, Request, Response, NextFunction } from "express";
import { db } from "../db";
import { projects, reviews, loginSchema, registerSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import { signUp, signIn, getCurrentUser } from "./auth";
import { supabase } from "./auth";

interface AuthRequest extends Request {
  user?: any;
}

// Supabase認証ミドルウェア
async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ message: "無効なトークンです" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "認証エラーが発生しました" });
  }
}

export function setupRoutes(app: Express) {
  // 認証関連のエンドポイント
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);
      
      const user = await signUp(email, password, name);
      if (!user) {
        return res.status(400).json({ message: "ユーザー登録に失敗しました" });
      }

      const { data: { session }, error: signInError } = await signIn(email, password);
      if (signInError || !session) {
        return res.status(400).json({ message: "ログインに失敗しました" });
      }

      res.status(201).json({ 
        user, 
        token: session.access_token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const { data: { session }, error: signInError } = await signIn(email, password);
      if (signInError || !session) {
        return res.status(401).json({ message: "メールアドレスまたはパスワードが正しくありません" });
      }

      const user = await getCurrentUser();
      if (!user) {
        return res.status(401).json({ message: "ユーザーが見つかりません" });
      }

      res.json({ 
        user,
        token: session.access_token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // プロジェクト一覧の取得（公開）
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, req.params.id))
        .limit(1);
      
      if (project.length === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      
      res.json(project[0]);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Update project position/rotation
  app.patch("/api/projects/:id/transform", async (req, res) => {
    const { position, rotation } = req.body;
    try {
      await db
        .update(projects)
        .set({ 
          position: JSON.stringify(position),
          rotation: JSON.stringify(rotation)
        })
        .where(eq(projects.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update project transform" });
    }
  });

  // 認証が必要なAPIルートに認証ミドルウェアを追加
  const protectedRoutes = [
    "/api/projects/create",
    "/api/projects/update",
    "/api/projects/delete",
    "/api/reviews"
  ];
  
  protectedRoutes.forEach(route => {
    app.use(route, authenticateToken);
  });

  // Create new project
  app.post("/api/projects", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const projectData = {
        ...req.body,
        user_id: req.user.id
      };
      const result = await db.insert(projects).values(projectData).returning();
      res.status(201).json(result[0]);
    } catch (error) {
      console.error("Failed to create project:", error);
      res.status(500).json({ error: "プロジェクトの作成に失敗しました" });
    }
  });

  // Update project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const result = await db
        .update(projects)
        .set(req.body)
        .where(eq(projects.id, req.params.id))
        .returning();
      
      if (result.length === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const result = await db
        .delete(projects)
        .where(eq(projects.id, req.params.id))
        .returning();
      
      if (result.length === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Get project reviews
  app.get("/api/projects/:id/reviews", async (req, res) => {
    try {
      const projectReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.projectId, req.params.id));
      res.json(projectReviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create project review
  app.post("/api/projects/:id/reviews", async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const [review] = await db
        .insert(reviews)
        .values({
          projectId: req.params.id,
          rating,
          comment,
        })
        .returning();
      res.status(201).json(review);
    } catch (error) {
      console.error("Failed to create review:", error);
      res.status(500).json({ error: "レビューの作成に失敗しました" });
    }
  });
}
