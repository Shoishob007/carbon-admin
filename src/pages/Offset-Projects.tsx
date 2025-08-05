import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  User,
  MapPin,
  ExternalLink,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth";

// Dummy images
const projectImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
];

type OffsetProject = {
  id: number;
  name: string;
  image: string;
  owner: string;
  site: string;
  location: string;
  description: string;
  isActive: boolean;
  moreDetails: string;
  estimatedOffset?: string;
  startDate?: string;
  endDate?: string;
  projectType?: string;
  lastUpdated?: string;
};

const initialProjects: OffsetProject[] = [
  {
    id: 1,
    name: "Amazon Rainforest Restoration",
    image: projectImages[0],
    owner: "GreenFuture Org",
    site: "https://greenfuture.org/projects/amazon",
    location: "Brazil, Amazon Basin",
    description: "Reforestation and biodiversity recovery in deforested areas of the Amazon.",
    isActive: true,
    moreDetails:
      "This project aims to restore over 5,000 hectares of native forest, support local communities, and protect wildlife habitats. Activities include tree planting, soil restoration, and monitoring carbon sequestration through satellite and field surveys.",
    estimatedOffset: "150,000 tCO₂e/year",
    startDate: "2022-01-01",
    endDate: "2032-12-31",
    projectType: "Reforestation",
    lastUpdated: "2025-07-21",
  },
  {
    id: 2,
    name: "Clean Cookstoves in Kenya",
    image: projectImages[1],
    owner: "EcoHelp Nonprofit",
    site: "https://ecohelp.org/cookstoves",
    location: "Nairobi, Kenya",
    description: "Distribution of efficient cookstoves to reduce emissions and improve indoor air quality.",
    isActive: true,
    moreDetails:
      "By providing over 10,000 clean cookstoves, this project lowers wood use, reduces smoke-related illnesses, and empowers women. The project is monitored annually to ensure ongoing impact and adoption.",
    estimatedOffset: "35,000 tCO₂e/year",
    startDate: "2021-06-01",
    endDate: "2028-06-01",
    projectType: "Renewable Energy/Community",
    lastUpdated: "2025-07-20",
  },
  {
    id: 3,
    name: "Wind Power for Rural India",
    image: projectImages[2],
    owner: "Sustainable Energy Trust",
    site: "https://sustainableenergytrust.org/wind-india",
    location: "Gujarat, India",
    description: "Development of community wind turbines supplying renewable energy to villages.",
    isActive: true,
    moreDetails:
      "Installed turbines have generated over 20 MW of clean electricity, serving 15 rural communities and displacing fossil fuels. The project includes training programs for local technicians and long-term maintenance plans.",
    estimatedOffset: "70,000 tCO₂e/year",
    startDate: "2023-02-15",
    endDate: "2030-02-15",
    projectType: "Renewable Energy",
    lastUpdated: "2025-07-19",
  },
  {
    id: 4,
    name: "Peatland Protection in Indonesia",
    image: projectImages[3],
    owner: "EarthGuardians",
    site: "https://earthguardians.asia/peatlands",
    location: "Sumatra, Indonesia",
    description: "Conservation of critical peatland ecosystems to prevent CO₂ release.",
    isActive: false,
    moreDetails:
      "By blocking drainage canals and restoring natural water levels, this project prevents peat fires and large-scale CO₂ emissions. Community education and sustainable land-use alternatives are core components.",
    estimatedOffset: "95,000 tCO₂e/year",
    startDate: "2020-03-20",
    endDate: "2026-03-20",
    projectType: "Conservation",
    lastUpdated: "2025-07-16",
  },
];

export default function OffsetProjects() {
    const role = useAuthStore((state) => state.user?.role);
  const [projects, setProjects] = useState<OffsetProject[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<OffsetProject | null>(null);

  const [newProject, setNewProject] = useState({
    name: "",
    image: "",
    owner: "",
    site: "",
    location: "",
    description: "",
    isActive: true,
    moreDetails: "",
    estimatedOffset: "",
    startDate: "",
    endDate: "",
    projectType: "",
    lastUpdated: "",
  });
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [editProject, setEditProject] = useState<typeof newProject>(newProject);

  // CRUD
  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.image.trim()) return;
    setProjects([
      ...projects,
      {
        ...newProject,
        id: Math.max(0, ...projects.map((p) => p.id)) + 1,
      },
    ]);
    setNewProject({
      name: "",
      image: "",
      owner: "",
      site: "",
      location: "",
      description: "",
      isActive: true,
      moreDetails: "",
      estimatedOffset: "",
      startDate: "",
      endDate: "",
      projectType: "",
      lastUpdated: "",
    });
  };

  const openEditProject = (project: OffsetProject) => {
    setEditProjectId(project.id);
    setEditProject({
      name: project.name,
      image: project.image,
      owner: project.owner,
      site: project.site,
      location: project.location,
      description: project.description,
      isActive: project.isActive,
      moreDetails: project.moreDetails,
      estimatedOffset: project.estimatedOffset || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      projectType: project.projectType || "",
      lastUpdated: project.lastUpdated || "",
    });
  };

  const handleSaveEditProject = () => {
    if (editProjectId === null) return;
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === editProjectId
          ? {
              ...proj,
              ...editProject,
            }
          : proj
      )
    );
    setEditProjectId(null);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleToggleProject = (id: number) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, isActive: !proj.isActive } : proj
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Offset Projects
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and showcase environmental offset projects. Add, edit, delete or view details.
          </p>
        </div>
        {role === "super_admin" && (
          <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-carbon-gradient hover:bg-carbon-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-background border">
            <DialogHeader className="text-center">
              <DialogTitle>Add Offset Project</DialogTitle>
              <DialogDescription>
                Register a new environmental offset project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  placeholder="e.g., Amazon Rainforest Restoration"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-image">Image URL</Label>
                <Input
                  id="project-image"
                  value={newProject.image}
                  onChange={(e) =>
                    setNewProject({ ...newProject, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-owner">Owner</Label>
                <Input
                  id="project-owner"
                  value={newProject.owner}
                  onChange={(e) =>
                    setNewProject({ ...newProject, owner: e.target.value })
                  }
                  placeholder="Organization or Individual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-site">Project Site (URL)</Label>
                <Input
                  id="project-site"
                  value={newProject.site}
                  onChange={(e) =>
                    setNewProject({ ...newProject, site: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-location">Location</Label>
                <Input
                  id="project-location"
                  value={newProject.location}
                  onChange={(e) =>
                    setNewProject({ ...newProject, location: e.target.value })
                  }
                  placeholder="e.g., Brazil, Amazon Basin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Short Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  placeholder="Short summary of project..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-more-details">More Details</Label>
                <Textarea
                  id="project-more-details"
                  value={newProject.moreDetails}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      moreDetails: e.target.value,
                    })
                  }
                  placeholder="Detailed description, methodology, monitoring, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-estimated-offset">Estimated Offset</Label>
                <Input
                  id="project-estimated-offset"
                  value={newProject.estimatedOffset}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      estimatedOffset: e.target.value,
                    })
                  }
                  placeholder="e.g., 150,000 tCO₂e/year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Input
                  id="project-type"
                  value={newProject.projectType}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      projectType: e.target.value,
                    })
                  }
                  placeholder="e.g., Reforestation, Renewable Energy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-startdate">Start Date</Label>
                <Input
                  id="project-startdate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-enddate">End Date</Label>
                <Input
                  id="project-enddate"
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Switch
                  checked={newProject.isActive}
                  onCheckedChange={() =>
                    setNewProject({
                      ...newProject,
                      isActive: !newProject.isActive,
                    })
                  }
                  id="project-active"
                />
                <Label htmlFor="project-active">
                  {newProject.isActive ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>
            <div className="flex justify-center px-4 pb-4">
              <Button
                onClick={handleCreateProject}
                className="bg-carbon-gradient w-full"
              >
                Add Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Cards - Responsive grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col cursor-pointer transition-shadow ring-offset-2 ring-carbon-200 hover:ring-2"
            onClick={() => setSelectedProject(project)}
            title="Click to view details"
          >
            <div className="h-36 sm:h-40 w-full relative rounded-t overflow-hidden flex-shrink-0">
              <img
                src={project.image}
                alt={project.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              {!project.isActive && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold z-10">
                  Inactive
                </div>
              )}
            </div>
            <CardContent className="flex flex-col flex-1 pt-3 pb-4">
              <div className="font-bold text-lg mb-1 flex items-center gap-2">
                {project.name}
                <a
                  href={project.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-carbon-600 hover:text-carbon-800"
                  onClick={e => e.stopPropagation()}
                  title="Open project site"
                >
                  <ExternalLink className="w-4 h-4 inline" />
                </a>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {project.description}
              </div>
              <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" /> {project.owner}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {project.location}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-blue-700 hover:bg-accent px-2 py-1"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                  title="View details"
                >
                  <Eye className="w-4 h-4 mr-1" /> View
                </Button>
                {role === "super_admin" && (
                  <>
                    <Dialog
                      open={editProjectId === project.id}
                      onOpenChange={open => !open && setEditProjectId(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-700 hover:bg-accent px-2 py-1"
                          onClick={e => {
                            e.stopPropagation();
                            openEditProject(project);
                          }}
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-background border">
                        <DialogHeader className="text-center">
                          <DialogTitle>Edit Project</DialogTitle>
                          <DialogDescription>
                            Update offset project details.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-96 overflow-y-auto px-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-name">Project Name</Label>
                            <Input
                              id="edit-project-name"
                              value={editProject.name}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-image">Image URL</Label>
                            <Input
                              id="edit-project-image"
                              value={editProject.image}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  image: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-owner">Owner</Label>
                            <Input
                              id="edit-project-owner"
                              value={editProject.owner}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  owner: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-site">Project Site (URL)</Label>
                            <Input
                              id="edit-project-site"
                              value={editProject.site}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  site: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-location">Location</Label>
                            <Input
                              id="edit-project-location"
                              value={editProject.location}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  location: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-description">Short Description</Label>
                            <Textarea
                              id="edit-project-description"
                              value={editProject.description}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-more-details">More Details</Label>
                            <Textarea
                              id="edit-project-more-details"
                              value={editProject.moreDetails}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  moreDetails: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-estimated-offset">Estimated Offset</Label>
                            <Input
                              id="edit-project-estimated-offset"
                              value={editProject.estimatedOffset}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  estimatedOffset: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-type">Project Type</Label>
                            <Input
                              id="edit-project-type"
                              value={editProject.projectType}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  projectType: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-startdate">Start Date</Label>
                            <Input
                              id="edit-project-startdate"
                              type="date"
                              value={editProject.startDate}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  startDate: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-project-enddate">End Date</Label>
                            <Input
                              id="edit-project-enddate"
                              type="date"
                              value={editProject.endDate}
                              onChange={e =>
                                setEditProject({
                                  ...editProject,
                                  endDate: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Switch
                              checked={editProject.isActive}
                              onCheckedChange={() =>
                                setEditProject({
                                  ...editProject,
                                  isActive: !editProject.isActive,
                                })
                              }
                              id="edit-project-active"
                            />
                            <Label htmlFor="edit-project-active">
                              {editProject.isActive ? "Active" : "Inactive"}
                            </Label>
                          </div>
                        </div>
                        <div className="flex justify-center px-4 pb-4 gap-2">
                          <Button
                            onClick={handleSaveEditProject}
                            className="bg-carbon-gradient w-full"
                          >
                            Save Changes
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline" className="w-full">
                              Cancel
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-700 hover:bg-accent px-2 py-1"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`px-2 py-1 ${project.isActive ? "text-gray-700" : "text-green-700"}`}
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleProject(project.id);
                      }}
                      title={project.isActive ? "Deactivate project" : "Activate project"}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      {project.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">No projects available.</div>
        )}
      </div>

      {/* Project View Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl w-full bg-background border overflow-y-auto max-h-[90vh]">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  {selectedProject.name}
                  <a
                    href={selectedProject.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-carbon-600 hover:text-carbon-800"
                    title="Open project site"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </DialogTitle>
                <DialogDescription className="mt-2 text-base">
                  <div className="flex flex-wrap gap-4 items-center text-base">
                    <span className="flex items-center gap-1">
                      <User className="w-5 h-5" /> <b>Owner:</b> {selectedProject.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" /> <b>Location:</b> {selectedProject.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-5 h-5" /> <b>Status:</b> {selectedProject.isActive ? "Active" : "Inactive"}
                    </span>
                    {selectedProject.projectType && (
                      <span className="flex items-center gap-1">
                        <b>Type:</b> {selectedProject.projectType}
                      </span>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-8 mt-4">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="object-cover rounded w-full md:w-96 h-56 md:h-96 border"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="font-semibold text-lg">Short Description:</span>
                    <div className="mt-1 text-base">{selectedProject.description}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">Detailed Overview:</span>
                    <div className="mt-1 whitespace-pre-line text-base">{selectedProject.moreDetails}</div>
                  </div>
                  {selectedProject.estimatedOffset && (
                    <div>
                      <span className="font-semibold">Estimated Offset: </span>
                      <span>{selectedProject.estimatedOffset}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-6 mt-2">
                    {selectedProject.startDate && (
                      <div>
                        <span className="font-semibold">Start Date: </span>
                        <span>{selectedProject.startDate}</span>
                      </div>
                    )}
                    {selectedProject.endDate && (
                      <div>
                        <span className="font-semibold">End Date: </span>
                        <span>{selectedProject.endDate}</span>
                      </div>
                    )}
                    {selectedProject.lastUpdated && (
                      <div>
                        <span className="font-semibold">Last Updated: </span>
                        <span>{selectedProject.lastUpdated}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Official Project Link: </span>
                    <a
                      href={selectedProject.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline break-all"
                    >
                      {selectedProject.site}
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}