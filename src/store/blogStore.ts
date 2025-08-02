import { create } from "zustand";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  link?: string;
  author: string;
  category: string;
  sub_category: string;
  date: string;
  is_active: boolean;
}

export interface CreateBlogPost {
  title: string;
  excerpt: string;
  image?: string;
  link?: string;
  author: string;
  category: string;
  sub_category: string;
  date: string;
}

export interface UpdateBlogPost extends Partial<CreateBlogPost> {
  id: number;
}

interface BlogStore {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (
    post: CreateBlogPost,
    accessToken?: string | null
  ) => Promise<void>;
  updatePost: (
    post: UpdateBlogPost,
    accessToken?: string | null
  ) => Promise<void>;
  deletePost: (id: number, accessToken?: string | null) => Promise<void>;
  getPostById: (id: number) => BlogPost | undefined;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/posts/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const posts: BlogPost[] = await response.json();
      set({ posts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  createPost: async (post: CreateBlogPost, accessToken?: string | null) => {
    set({ loading: true, error: null });
    try {
      const postData = {
        title: post.title?.trim() || "",
        excerpt: post.excerpt?.trim() || "",
        author: post.author?.trim() || "",
        category: post.category?.trim() || "Blog",
        sub_category: post.sub_category?.trim() || "Educational",
        date: post.date || new Date().toISOString().split("T")[0],
        link: post.link?.trim() || "",
        image: post.image?.trim() || "",
      };

      // Validate required fields
      if (!postData.title) {
        throw new Error("Title is required");
      }
      if (!postData.excerpt) {
        throw new Error("Content is required");
      }
      if (!postData.author) {
        throw new Error("Author is required");
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      console.log("Creating post with data:", postData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/posts/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(postData),
          redirect: "follow",
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to create post";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        console.error("Create post error:", errorMessage);
        throw new Error(errorMessage);
      }

      const newPost: BlogPost = await response.json();
      console.log("Post created successfully:", newPost);
      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
    } catch (error) {
      console.error("Create post error:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
      throw error;
    }
  },

  updatePost: async (post: UpdateBlogPost, accessToken?: string | null) => {
    set({ loading: true, error: null });
    try {
      const updateData: Partial<BlogPost> = {};

      if (post.title !== undefined) updateData.title = post.title.trim();
      if (post.excerpt !== undefined) updateData.excerpt = post.excerpt.trim();
      if (post.author !== undefined) updateData.author = post.author.trim();
      if (post.category !== undefined)
        updateData.category = post.category.trim();
      if (post.sub_category !== undefined)
        updateData.sub_category = post.sub_category.trim();
      if (post.date !== undefined) updateData.date = post.date;
      if (post.link !== undefined) updateData.link = post.link.trim();
      if (post.image !== undefined) updateData.image = post.image.trim();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      console.log("Updating post with data:", updateData);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/posts/${post.id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to update post";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        console.error("Update post error:", errorMessage);
        throw new Error(errorMessage);
      }

      const updatedPost: BlogPost = await response.json();
      console.log("Post updated successfully:", updatedPost);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === post.id ? updatedPost : p)),
        loading: false,
      }));
    } catch (error) {
      console.error("Update post error:", error);
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
      throw error;
    }
  },

  deletePost: async (id: number, accessToken?: string | null) => {
    set({ loading: true, error: null });
    try {
      const headers: HeadersInit = {};

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles/posts/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to delete post");
      }

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
      throw error;
    }
  },

  getPostById: (id: number) => {
    return get().posts.find((post) => post.id === id);
  },
}));
