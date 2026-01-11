"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import mediaData from "@/data/media-organization.json";

interface MediaFile {
  filename: string;
  path: string;
  type: "image" | "video";
}

interface SelectedGroup {
  id: string;
  files: MediaFile[];
  serviceId: string;
  serviceName: string;
  brand: string;
  projectName: string;
  caption: string;
  description?: string;
  detailedDescription?: string;
  location?: string;
  existingProjectId?: string; // For adding to existing projects
}

interface ExistingProject {
  id: string;
  name: string;
  serviceId: string;
  serviceName: string;
  brand: string;
  currentMediaCount: number;
}

const SERVICES = [
  { id: "detailing", name: "Car Detailing" },
  { id: "correction", name: "Paint Correction" },
  { id: "coating", name: "Ceramic Coating" },
  { id: "ppf", name: "PPF Protection" },
  { id: "specials", name: "Specials" },
];

// Only the 12 brands shown on the page
const BRANDS = [
  "Aston Martin",
  "Audi",
  "BMW",
  "Ferrari",
  "Jaguar",
  "Lamborghini",
  "McLaren",
  "Porsche",
  "Range Rover",
  "Rolls Royce",
  "Tesla",
  "Specials", // The "Plus" sign represents Specials
];

export default function MediaOrganizePage() {
  const [mode, setMode] = useState<"new" | "existing">("new"); // "new" or "existing"
  const [availableFiles, setAvailableFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<SelectedGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Partial<SelectedGroup> | null>(null);
  const [error, setError] = useState("");
  const [existingProjects, setExistingProjects] = useState<ExistingProject[]>([]);
  const [selectedExistingProjectId, setSelectedExistingProjectId] = useState<string>("");

  // Load available media files and existing projects
  useEffect(() => {
    loadAvailableFiles();
    loadExistingProjects();
  }, []);

  // Load existing projects from media-organization.json
  const loadExistingProjects = () => {
    try {
      const data = mediaData as any;
      const projects: ExistingProject[] = [];
      
      data.services.forEach((service: any) => {
        service.projects.forEach((project: any) => {
          // Extract brand from project name (simple heuristic)
          let brand = "Unknown";
          for (const brandName of BRANDS) {
            if (project.name.toLowerCase().includes(brandName.toLowerCase())) {
              brand = brandName;
              break;
            }
          }
          
          projects.push({
            id: project.id,
            name: project.name,
            serviceId: service.id,
            serviceName: service.name,
            brand,
            currentMediaCount: project.media?.length || 0,
          });
        });
      });
      
      setExistingProjects(projects);
    } catch (err) {
      console.error("Failed to load existing projects:", err);
    }
  };

  const loadAvailableFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/media/scan");
      
      if (!response.ok) {
        // API route disabled in production - return empty for pitch site
        setAvailableFiles([]);
        setError("Media scanning API is not available in production. This feature is for local development only.");
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAvailableFiles(data.files || []);
      } else {
        setError(data.error || "Failed to load media files");
      }
    } catch (err: any) {
      // API route disabled in production - return empty for pitch site
      setAvailableFiles([]);
      setError("Media scanning API is not available in production. This feature is for local development only.");
    } finally {
      setLoading(false);
    }
  };

  // Filter out files already in groups
  const displayFiles = useMemo(() => {
    const usedInGroups = new Set<string>();
    groups.forEach((group) => {
      group.files.forEach((file) => usedInGroups.add(file.filename));
    });
    
    return availableFiles.filter((file) => !usedInGroups.has(file.filename));
  }, [availableFiles, groups]);

  // Toggle file selection
  const toggleFileSelection = (filename: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedFiles(newSelected);
  };

  // Create a new group from selected files
  const createGroup = () => {
    if (selectedFiles.size === 0) {
      setError("Please select at least one file to create a group");
      return;
    }

    const files = availableFiles.filter((file) => selectedFiles.has(file.filename));
    
    if (mode === "existing" && selectedExistingProjectId) {
      // Adding to existing project
      const existingProject = existingProjects.find(p => p.id === selectedExistingProjectId);
      if (!existingProject) {
        setError("Selected project not found");
        return;
      }
      
      const newGroup: Partial<SelectedGroup> = {
        id: `group-${Date.now()}`,
        files,
        serviceId: existingProject.serviceId,
        serviceName: existingProject.serviceName,
        brand: existingProject.brand,
        projectName: existingProject.name,
        caption: "",
        existingProjectId: existingProject.id,
      };
      
      setCurrentGroup(newGroup);
      setSelectedFiles(new Set());
    } else {
      // Creating new project
      const newGroup: Partial<SelectedGroup> = {
        id: `group-${Date.now()}`,
        files,
        serviceId: "",
        serviceName: "",
        brand: "",
        projectName: "",
        caption: "",
      };

      setCurrentGroup(newGroup);
      setSelectedFiles(new Set());
    }
  };

  // Update current group
  const updateCurrentGroup = (updates: Partial<SelectedGroup>) => {
    setCurrentGroup((prev) => (prev ? { ...prev, ...updates } : null));
  };

  // Save current group
  const saveGroup = () => {
    if (!currentGroup) {
      setError("No group to save");
      return;
    }
    
    // For new projects, require brand and project name
    // For existing projects, these are already set
    if (!currentGroup.existingProjectId && (!currentGroup.brand || !currentGroup.projectName)) {
      setError("Please fill in brand and project name");
      return;
    }

    // Service is optional, but if selected, validate it
    let service = null;
    if (currentGroup.serviceId) {
      service = SERVICES.find((s) => s.id === currentGroup.serviceId);
      if (!service) {
        setError("Invalid service selected");
        return;
      }
    }

    const savedGroup: SelectedGroup = {
      id: currentGroup.id || `group-${Date.now()}`,
      files: currentGroup.files || [],
      serviceId: currentGroup.serviceId || "",
      serviceName: service?.name || "",
      brand: currentGroup.brand,
      projectName: currentGroup.projectName,
      caption: currentGroup.caption || "",
      description: currentGroup.description,
      detailedDescription: currentGroup.detailedDescription,
      location: currentGroup.location,
    };

    setGroups((prev) => [...prev, savedGroup]);
    setCurrentGroup(null);
    setError("");
  };

  // Generate SEO content from caption
  const generateContent = async () => {
    if (!currentGroup || !currentGroup.caption || !currentGroup.projectName) {
      setError("Please fill in caption and project name to generate content");
      return;
    }

    // Service is optional for content generation
    const service = currentGroup.serviceId 
      ? SERVICES.find((s) => s.id === currentGroup.serviceId)
      : null;

    // Generate description and detailed description based on service (if selected) and project name
    const nameLower = currentGroup.projectName.toLowerCase();
    let description = "";
    let detailedDescription = "";

    if (service) {
      if (service.name === "Car Detailing") {
        description = "Premium car detailing service delivering exceptional results through meticulous attention to detail.";
        detailedDescription = `Our ${currentGroup.projectName} service combined premium detailing techniques with professional-grade products to deliver outstanding results. ${currentGroup.caption}`;
      } else if (service.name === "Paint Correction") {
        description = "Professional paint correction removing defects to restore showroom finish and depth.";
        detailedDescription = `This ${currentGroup.projectName} involved comprehensive paint correction work to restore the vehicle's original finish. ${currentGroup.caption}`;
      } else if (service.name === "Ceramic Coating") {
        description = "Premium ceramic coating application providing long-lasting protection and enhanced gloss.";
        detailedDescription = `Our ${currentGroup.projectName} featured the application of premium ceramic coating for exceptional protection. ${currentGroup.caption}`;
      } else if (service.name === "PPF Protection") {
        description = "Premium paint protection film installation providing invisible protection against road hazards.";
        detailedDescription = `This ${currentGroup.projectName} featured precision PPF installation for maximum protection. ${currentGroup.caption}`;
      } else {
        description = "Premium vehicle rejuvenation service tailored to your specific requirements.";
        detailedDescription = `Our ${currentGroup.projectName} service delivered exceptional results. ${currentGroup.caption}`;
      }
    } else {
      // No service selected - generate generic content
      description = "Premium vehicle rejuvenation service tailored to your specific requirements.";
      detailedDescription = `Our ${currentGroup.projectName} service delivered exceptional results through premium techniques and attention to detail. ${currentGroup.caption}`;
    }

    updateCurrentGroup({
      description,
      detailedDescription,
    });

    setError("");
  };

  // Export groups as JSON
  const exportJSON = () => {
    if (groups.length === 0) {
      setError("No groups to export. Please create at least one group.");
      return;
    }

    // Transform groups into media-organization.json format
    const serviceMap = new Map<string, typeof groups>();
    
    groups.forEach((group) => {
      const serviceId = group.serviceId || "specials"; // Default to specials if no service
      if (!serviceMap.has(serviceId)) {
        serviceMap.set(serviceId, []);
      }
      serviceMap.get(serviceId)!.push(group);
    });

    const exportData = {
      services: Array.from(serviceMap.entries()).map(([serviceId, serviceGroups]) => {
        const service = SERVICES.find((s) => s.id === serviceId) || SERVICES.find((s) => s.id === "specials")!;
        
        const projects = serviceGroups.map((group) => {
          // If adding to existing project, use existing project ID, otherwise create new
          const projectId = group.existingProjectId || `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const media = group.files.map((file, index) => {
            const mediaId = file.filename.replace(/\.[^/.]+$/, "") || `media-${index}`;
            return {
              id: mediaId,
              src: file.path,
              alt: `${group.brand} ${group.projectName}`,
              type: file.type,
            };
          });

          return {
            id: projectId,
            name: group.projectName,
            description: group.description,
            location: group.location,
            mediaIds: media.map((m) => m.id),
            media,
          };
        });

        return {
          id: service.id,
          name: service.name,
          projectIds: projects.map((p) => p.id),
          projects,
        };
      }),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `media-organization-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setError("");
  };

  // Delete a group
  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2 text-dark-900"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Media Organization Tool
          </h1>
          <p className="text-dark-600 mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            Select images/videos, group them, assign metadata, and export as JSON
          </p>
          
          {/* Mode Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setMode("new");
                setCurrentGroup(null);
                setSelectedExistingProjectId("");
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                mode === "new"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-dark-900 hover:bg-gray-300"
              }`}
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Create New Project
            </button>
            <button
              onClick={() => {
                setMode("existing");
                setCurrentGroup(null);
                setSelectedFiles(new Set());
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                mode === "existing"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-dark-900 hover:bg-gray-300"
              }`}
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Add to Existing Project
            </button>
          </div>
          
          {/* Existing Project Selector (shown when mode is "existing") */}
          {mode === "existing" && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <label className="block text-sm font-semibold mb-2 text-dark-900">
                Select Existing Project
              </label>
              <select
                value={selectedExistingProjectId}
                onChange={(e) => setSelectedExistingProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <option value="">-- Select Project --</option>
                {existingProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.serviceName} • {project.brand} • {project.name} ({project.currentMediaCount} media)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Available Media */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-2xl font-semibold text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Available Media ({displayFiles.length})
                </h2>
                <button
                  onClick={loadAvailableFiles}
                  className="px-4 py-2 bg-gray-200 text-dark-900 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="text-center py-10 text-dark-600">Loading media files...</div>
              ) : displayFiles.length === 0 ? (
                <div className="text-center py-10 text-dark-600">
                  No available media files. All files are already used.
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <span className="text-sm text-dark-600">
                      {selectedFiles.size} file(s) selected
                    </span>
                    {selectedFiles.size > 0 && (
                      <button
                        onClick={createGroup}
                        disabled={mode === "existing" && !selectedExistingProjectId}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                          mode === "existing" && !selectedExistingProjectId
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                      >
                        {mode === "existing" ? "Add to Project" : "Create Group"}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[600px] overflow-y-auto">
                    {displayFiles.map((file) => (
                      <div
                        key={file.filename}
                        onClick={() => toggleFileSelection(file.filename)}
                        className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedFiles.has(file.filename)
                            ? "border-blue-500 ring-2 ring-blue-300"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {file.type === "image" ? (
                          <Image
                            src={file.path}
                            alt={file.filename}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
                          />
                        ) : (
                          <video
                            src={file.path}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        )}
                        {selectedFiles.has(file.filename) && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                              ✓
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                          {file.filename}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Groups & Current Group Form */}
          <div className="space-y-6">
            {/* Current Group Form */}
            {currentGroup && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2
                  className="text-xl font-semibold mb-4 text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  {mode === "existing" ? "Add Media to Project" : "Configure Group"} ({currentGroup.files?.length || 0} files)
                </h2>

                <div className="space-y-4">
                  {mode === "existing" && currentGroup.existingProjectId ? (
                    <>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-semibold mb-1">Adding to existing project:</p>
                        <p className="text-sm text-blue-900">{currentGroup.serviceName} • {currentGroup.brand} • {currentGroup.projectName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Service (optional)
                        </label>
                        <select
                          value={currentGroup.serviceId || ""}
                          onChange={(e) => {
                            const service = SERVICES.find((s) => s.id === e.target.value);
                            updateCurrentGroup({
                              serviceId: e.target.value,
                              serviceName: service?.name || "",
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        >
                          <option value="">-- Select Service (optional) --</option>
                          {SERVICES.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Brand *
                        </label>
                        <select
                          value={currentGroup.brand || ""}
                          onChange={(e) => updateCurrentGroup({ brand: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        >
                          <option value="">-- Select Brand --</option>
                          {BRANDS.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          value={currentGroup.projectName || ""}
                          onChange={(e) => updateCurrentGroup({ projectName: e.target.value })}
                          placeholder="e.g., BMW M3 Full Detail"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-dark-900">
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={currentGroup.location || ""}
                      onChange={(e) => updateCurrentGroup({ location: e.target.value })}
                      placeholder="e.g., Brighton"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    />
                  </div>

                  {mode === "new" && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Instagram Caption *
                        </label>
                        <textarea
                          value={currentGroup.caption || ""}
                          onChange={(e) => updateCurrentGroup({ caption: e.target.value })}
                          placeholder="Paste your Instagram caption here..."
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        />
                      </div>

                      <button
                        onClick={generateContent}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                      >
                        Generate SEO Content
                      </button>
                    </>
                  )}

                  {currentGroup.description && (
                    <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-green-800">
                          Description
                        </label>
                        <textarea
                          value={currentGroup.description}
                          onChange={(e) => updateCurrentGroup({ description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-green-300 rounded text-sm bg-white"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-green-800">
                          Detailed Description
                        </label>
                        <textarea
                          value={currentGroup.detailedDescription || ""}
                          onChange={(e) => updateCurrentGroup({ detailedDescription: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-green-300 rounded text-sm bg-white"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={saveGroup}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      {mode === "existing" ? "Save Media Addition" : "Save Group"}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentGroup(null);
                        setSelectedExistingProjectId("");
                      }}
                      className="px-4 py-2 bg-gray-300 text-dark-900 rounded-lg hover:bg-gray-400 transition-colors"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Groups */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-semibold text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Saved Groups ({groups.length})
                </h2>
                {groups.length > 0 && (
                  <button
                    onClick={exportJSON}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    Export JSON
                  </button>
                )}
              </div>

              {groups.length === 0 ? (
                <p className="text-sm text-dark-600 text-center py-4">
                  No groups created yet. Select files and create a group to get started.
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3
                            className="font-semibold text-dark-900 mb-1"
                            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                          >
                            {group.projectName}
                          </h3>
                          <p className="text-xs text-dark-600 mb-1">
                            {group.serviceName ? `${group.serviceName} • ` : ""}{group.brand}
                          </p>
                          <p className="text-xs text-dark-500">
                            {group.files.length} file(s)
                          </p>
                        </div>
                        <button
                          onClick={() => deleteGroup(group.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ×
                        </button>
                      </div>
                      {group.caption && (
                        <p className="text-xs text-dark-600 mt-2 line-clamp-2">
                          {group.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
