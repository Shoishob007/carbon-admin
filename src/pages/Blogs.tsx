import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  User,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Carbon Offsetting: Technology and Innovation",
    excerpt:
      "Exploring how emerging technologies are revolutionizing carbon offset markets and making environmental impact measurement more accurate.",
    author: "Dr. Sarah Green",
    status: "published",
    publishDate: "2024-06-15",
    views: 1247,
    featured: false,
  },
  {
    id: 2,
    title: "Corporate Carbon Footprint: A Comprehensive Guide",
    excerpt:
      "Everything businesses need to know about measuring, tracking, and reducing their carbon footprint in 2024.",
    author: "Michael Chen",
    status: "published",
    publishDate: "2024-06-12",
    views: 892,
    featured: false,
  },
  {
    id: 3,
    title: "Renewable Energy Credits vs Carbon Offsetting",
    excerpt:
      "Understanding the differences between RECs and carbon offsets, and how they fit into your sustainability strategy.",
    author: "Dr. Sarah Green",
    status: "draft",
    publishDate: "2024-06-20",
    views: 0,
    featured: false,
  },
  {
    id: 4,
    title: "Forest Conservation Projects: Impact and Verification",
    excerpt:
      "Deep dive into how forest conservation projects generate carbon credits and the verification process.",
    author: "Emily Rodriguez",
    status: "published",
    publishDate: "2024-06-10",
    views: 1534,
    featured: false,
  },
];

const statuses = ["All Blogs", "published", "draft"];

export default function Blogs() {
  const [selectedStatus, setSelectedStatus] = useState("All Blogs");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    featured: false,
  });

  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesStatus =
        selectedStatus === "All Blogs" || post.status === selectedStatus;
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const handleCreatePost = () => {
    console.log("Creating new post:", newPost);
  };

  const handleEditPost = (id: number) => {
    console.log("Editing post:", id);
  };

  const handleDeletePost = (id: number) => {
    console.log("Deleting post:", id);
  };

  const handleViewPost = (id: number) => {
    console.log("Viewing post:", id);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Blog Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage blog content about carbon emissions and
            sustainability
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-carbon-gradient hover:bg-carbon-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-background border">
            <DialogHeader className="text-center">
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write a new blog post about carbon emissions and sustainability
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    placeholder="Enter post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newPost.author}
                    onChange={(e) =>
                      setNewPost({ ...newPost, author: e.target.value })
                    }
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={newPost.excerpt}
                    onChange={(e) =>
                      setNewPost({ ...newPost, excerpt: e.target.value })
                    }
                    placeholder="Brief description of the post"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    placeholder="Write your blog post content here..."
                    className="min-h-32"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center px-4 pb-4">
              <Button
                onClick={handleCreatePost}
                className="bg-carbon-gradient w-full"
              >
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-carbon-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-carbon-700">
              {blogPosts.length}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {blogPosts.filter((post) => post.status === "published").length}
            </div>
            <p className="text-xs text-muted-foreground">Live on website</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {blogPosts.filter((post) => post.status === "draft").length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {blogPosts
                .reduce((sum, post) => sum + post.views, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time views</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage your blog content and posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border">
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className="w-48"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{post.title}</div>
                        {post.featured && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {post.author}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        post.status === "published" ? "default" : "secondary"
                      }
                      className={
                        post.status === "published"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      {post.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{post.publishDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
