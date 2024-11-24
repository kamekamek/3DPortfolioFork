import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/lib/types";

// フォームのスキーマを定義
const formSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().min(1, "説明は必須です"),
  image: z.string().url("有効なURLを入力してください"),
  link: z.string().url("有効なURLを入力してください").optional(),
  technologies: z.string().transform((str) => 
    str ? str.split(",").map((s) => s.trim()).filter(Boolean) : []
  ),
});

type FormData = z.infer<typeof formSchema>;

interface ProjectFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<Project>;
  isSubmitting?: boolean;
}

export default function ProjectForm({ onSubmit, initialData, isSubmitting }: ProjectFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      link: initialData?.link || "",
      technologies: initialData?.technologies || [],  // 空の配列をデフォルト値に
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async (data) => {
        try {
          await onSubmit(data);
          toast({
            title: "成功",
            description: "プロジェクトが保存されました",
          });
        } catch (error) {
          toast({
            title: "エラー",
            description: "プロジェクトの保存に失敗しました",
            variant: "destructive",
          });
        }
      })} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input placeholder="プロジェクトのタイトル" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="プロジェクトの説明"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>画像URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プロジェクトURL（任意）</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>技術スタック（カンマ区切り）</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Node.js" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          保存
        </Button>
      </form>
    </Form>
  );
}
