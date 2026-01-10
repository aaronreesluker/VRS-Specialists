"use client";

import { useState, useMemo, useEffect } from "react";
import mediaData from "@/data/media-organization.json";
import projectCaptionsData from "@/data/project-captions.json";

interface MediaItem {
  id: string;
  src: string;
  alt: string;
  type: "image" | "video";
}

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  mediaIds: string[];
  media: MediaItem[];
}

interface Service {
  id: string;
  name: string;
  projectIds: string[];
  projects: Project[];
}

interface ProjectCaption {
  projectId: string;
  projectName: string;
  serviceName: string;
  caption: string;
}

interface MediaOrganizationData {
  services: Service[];
}

export default function MediaManagePage() {
  const [data, setData] = useState<MediaOrganizationData>(mediaData as MediaOrganizationData);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectLocation, setProjectLocation] = useState<string>("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newMediaSrc, setNewMediaSrc] = useState<string>("");
  const [newMediaAlt, setNewMediaAlt] = useState<string>("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [projectCaption, setProjectCaption] = useState<string>("");
  const [importJsonInput, setImportJsonInput] = useState<string>("");
  const [importMessage, setImportMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showOnlyNew, setShowOnlyNew] = useState<boolean>(false);
  const [importedDataState, setImportedDataState] = useState<MediaOrganizationData | null>(null);

  // Load captions from project-captions.json
  useEffect(() => {
    const captionsMap: Record<string, string> = {};
    projectCaptionsData.forEach((item: ProjectCaption) => {
      captionsMap[item.projectId] = item.caption;
    });
    setCaptions(captionsMap);
  }, []);

  // Get all services
  const services = useMemo(() => data.services, [data]);

  // Get existing project IDs and names for filtering (from original loaded data)
  const existingProjectInfo = useMemo(() => {
    const ids = new Set<string>();
    const names = new Set<string>();
    (mediaData as MediaOrganizationData).services.forEach((service) => {
      service.projects.forEach((project) => {
        ids.add(project.id);
        names.add(project.name.toLowerCase().trim());
      });
    });
    return { ids, names };
  }, []);

  // Get services to display (filtered to exclude existing projects if showOnlyNew is true)
  const displayServices = useMemo(() => {
    if (!showOnlyNew) {
      return services;
    }

    // Filter to show only projects that aren't in the original loaded data
    return services
      .map((service) => {
        const newProjects = service.projects.filter((project) => {
          const existsById = existingProjectInfo.ids.has(project.id);
          const existsByName = existingProjectInfo.names.has(project.name.toLowerCase().trim());
          return !existsById && !existsByName;
        });

        if (newProjects.length === 0) {
          return null;
        }

        return {
          ...service,
          projects: newProjects,
          projectIds: newProjects.map((p) => p.id),
        };
      })
      .filter((service): service is Service => service !== null);
  }, [showOnlyNew, services, existingProjectInfo]);

  // Get projects for selected service
  const selectedService = useMemo(() => {
    return displayServices.find((s) => s.id === selectedServiceId);
  }, [displayServices, selectedServiceId]);

  // Get selected project
  const selectedProject = useMemo(() => {
    if (!selectedService || !selectedProjectId) return null;
    return selectedService.projects.find((p) => p.id === selectedProjectId);
  }, [selectedService, selectedProjectId]);

  // Load project data when selected
  useEffect(() => {
    if (selectedProject) {
      setProjectName(selectedProject.name);
      setProjectDescription(selectedProject.description || "");
      setProjectLocation(selectedProject.location || "");
      setMediaItems([...selectedProject.media]);
      setProjectCaption(captions[selectedProject.id] || "");
    } else {
      // Reset form for new project
      setProjectName("");
      setProjectDescription("");
      setProjectLocation("");
      setMediaItems([]);
      setProjectCaption("");
    }
  }, [selectedProject, captions]);

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedProjectId("");
    setError("");
  };

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setError("");
  };

  // Add new media item
  const handleAddMedia = () => {
    if (!newMediaSrc.trim()) {
      setError("Media source path is required.");
      return;
    }

    const newId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMedia: MediaItem = {
      id: newId,
      src: newMediaSrc.trim(),
      alt: newMediaAlt.trim() || "Media",
      type: newMediaType,
    };

    setMediaItems([...mediaItems, newMedia]);
    setNewMediaSrc("");
    setNewMediaAlt("");
    setNewMediaType("image");
    setError("");
  };

  // Remove media item
  const handleRemoveMedia = (mediaId: string) => {
    setMediaItems(mediaItems.filter((m) => m.id !== mediaId));
  };

  // Move media item up
  const handleMoveMediaUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...mediaItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setMediaItems(newItems);
  };

  // Move media item down
  const handleMoveMediaDown = (index: number) => {
    if (index === mediaItems.length - 1) return;
    const newItems = [...mediaItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setMediaItems(newItems);
  };

  // Save project
  const handleSaveProject = () => {
    if (!selectedServiceId) {
      setError("Please select a service first.");
      return;
    }
    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    const newData = { ...data };
    const serviceIndex = newData.services.findIndex((s) => s.id === selectedServiceId);
    if (serviceIndex === -1) {
      setError("Service not found.");
      return;
    }

    const projectId = selectedProjectId || `project-${Date.now()}`;
    const mediaIds = mediaItems.map((m) => m.id);

    const project: Project = {
      id: projectId,
      name: projectName.trim(),
      description: projectDescription.trim() || undefined,
      location: projectLocation.trim() || undefined,
      mediaIds,
      media: mediaItems,
    };

    if (selectedProjectId) {
      // Update existing project
      const projectIndex = newData.services[serviceIndex].projects.findIndex(
        (p) => p.id === selectedProjectId
      );
      if (projectIndex !== -1) {
        newData.services[serviceIndex].projects[projectIndex] = project;
      }
    } else {
      // Add new project
      newData.services[serviceIndex].projects.push(project);
      if (!newData.services[serviceIndex].projectIds.includes(projectId)) {
        newData.services[serviceIndex].projectIds.push(projectId);
      }
    }

    setData(newData);
    setSelectedProjectId(projectId);
    setError("");
  };

  // Delete project
  const handleDeleteProject = () => {
    if (!selectedServiceId || !selectedProjectId) {
      setError("Please select a project to delete.");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) {
      return;
    }

    const newData = { ...data };
    const serviceIndex = newData.services.findIndex((s) => s.id === selectedServiceId);
    if (serviceIndex !== -1) {
      newData.services[serviceIndex].projects = newData.services[serviceIndex].projects.filter(
        (p) => p.id !== selectedProjectId
      );
      newData.services[serviceIndex].projectIds = newData.services[serviceIndex].projectIds.filter(
        (id) => id !== selectedProjectId
      );
    }

    setData(newData);
    setSelectedProjectId("");
    setError("");
  };

  // Save caption
  const handleSaveCaption = () => {
    if (!selectedProjectId) {
      setError("Please select a project first.");
      return;
    }

    setCaptions((prev) => ({
      ...prev,
      [selectedProjectId]: projectCaption.trim(),
    }));
    setError("");
  };

  // Export JSON
  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  const downloadJsonFile = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "media-organization.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(exportData());
    alert("JSON copied to clipboard!");
  };

  // Export captions
  const exportCaptions = () => {
    const captionsArray: ProjectCaption[] = Object.entries(captions).map(([projectId, caption]) => {
      // Find project to get name and service
      let projectName = "Unknown Project";
      let serviceName = "Unknown Service";
      
      for (const service of data.services) {
        const project = service.projects.find((p) => p.id === projectId);
        if (project) {
          projectName = project.name;
          serviceName = service.name;
          break;
        }
      }

      return {
        projectId,
        projectName,
        serviceName,
        caption,
      };
    });
    return JSON.stringify(captionsArray, null, 2);
  };

  const downloadCaptionsJsonFile = () => {
    const json = exportCaptions();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-captions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON with filtering for new projects
  const handleImportJson = (replaceExisting: boolean = false) => {
    setImportMessage("");
    setError("");
    if (!importJsonInput.trim()) {
      setImportMessage("Please paste JSON data to import.");
      return;
    }

    try {
      const importedData: MediaOrganizationData = JSON.parse(importJsonInput);
      if (!importedData.services || !Array.isArray(importedData.services)) {
        throw new Error("Invalid JSON format. Expected object with 'services' array.");
      }

      if (replaceExisting) {
        // Replace existing data
        setData(importedData);
        setImportJsonInput("");
        setImportedDataState(null);
        setImportMessage("Successfully imported media organization data (replaced existing)!");
      } else {
        // Merge: add only new projects that don't already exist
        const newData = { ...data };
        let newProjectsCount = 0;
        let skippedProjectsCount = 0;

        importedData.services.forEach((importedService) => {
          const existingServiceIndex = newData.services.findIndex(
            (s) => s.id === importedService.id
          );

          if (existingServiceIndex === -1) {
            // New service - add it
            newData.services.push(importedService);
            newProjectsCount += importedService.projects.length;
          } else {
            // Existing service - add only new projects
            const existingService = newData.services[existingServiceIndex];
            const existingProjectNames = new Set(
              existingService.projects.map((p) => p.name.toLowerCase().trim())
            );
            const existingProjectIds = new Set(existingService.projects.map((p) => p.id));

            importedService.projects.forEach((importedProject) => {
              const isDuplicate =
                existingProjectIds.has(importedProject.id) ||
                existingProjectNames.has(importedProject.name.toLowerCase().trim());

              if (!isDuplicate) {
                existingService.projects.push(importedProject);
                if (!existingService.projectIds.includes(importedProject.id)) {
                  existingService.projectIds.push(importedProject.id);
                }
                newProjectsCount++;
              } else {
                skippedProjectsCount++;
              }
            });
          }
        });

        setData(newData);
        setImportJsonInput("");
        setImportedDataState(null);
        setImportMessage(
          `✓ Successfully imported ${newProjectsCount} new project(s). Skipped ${skippedProjectsCount} duplicate(s).`
        );
      }
    } catch (err: any) {
      setError(`Failed to import JSON: ${err.message || "Invalid JSON format."}`);
      console.error(err);
    }
  };

  // Filter projects to show only those not in existing data
  const handleFilterNewProjects = () => {
    if (!importJsonInput.trim()) {
      setError("Please paste JSON data first to filter new projects.");
      return;
    }

    try {
      const importedData: MediaOrganizationData = JSON.parse(importJsonInput);
      if (!importedData.services || !Array.isArray(importedData.services)) {
        throw new Error("Invalid JSON format. Expected object with 'services' array.");
      }

      const filteredData: MediaOrganizationData = {
        services: importedData.services
          .map((importedService) => {
            // Check against original loaded data, not current state
            const existingService = (mediaData as MediaOrganizationData).services.find(
              (s) => s.id === importedService.id
            );
            const existingProjectNames = existingService
              ? new Set(existingService.projects.map((p) => p.name.toLowerCase().trim()))
              : new Set<string>();
            const existingProjectIds = existingService
              ? new Set(existingService.projects.map((p) => p.id))
              : new Set<string>();

            const newProjects = importedService.projects.filter(
              (project) =>
                !existingProjectIds.has(project.id) &&
                !existingProjectNames.has(project.name.toLowerCase().trim())
            );

            return {
              ...importedService,
              projects: newProjects,
              projectIds: newProjects.map((p) => p.id),
            };
          })
          .filter((service) => service.projects.length > 0),
      };

      const totalNew = filteredData.services.reduce((sum, s) => sum + s.projects.length, 0);
      setImportJsonInput(JSON.stringify(filteredData, null, 2));
      setImportedDataState(filteredData);
      setImportMessage(
        `✓ Filtered to show only NEW projects: ${totalNew} project(s) that aren't already in your current data. You can now import these.`
      );
    } catch (err: any) {
      setError(`Failed to filter JSON: ${err.message || "Invalid JSON format."}`);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1
            className="text-3xl font-bold mb-6 text-dark-900"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Media Management
          </h1>
          <p
            className="text-dark-700 mb-8"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Manage projects, media items, and captions for "Our Latest Work" and "Work by Brand" sections.
          </p>

          {/* Import/Export Section */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2
              className="text-xl font-bold mb-4 text-blue-800"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Import / Export
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-blue-800"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Import Media Organization JSON
                </label>
                <textarea
                  value={importJsonInput}
                  onChange={(e) => setImportJsonInput(e.target.value)}
                  placeholder='Paste your media-organization.json here...'
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] font-mono text-sm mb-4"
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => handleFilterNewProjects()}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    Filter to Show Only New Projects
                  </button>
                  <button
                    onClick={() => handleImportJson(false)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    Import & Merge (Skip Duplicates)
                  </button>
                  <button
                    onClick={() => handleImportJson(true)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    Import & Replace All
                  </button>
                </div>
                {importMessage && <p className="mt-3 text-sm text-blue-700 font-semibold">{importMessage}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadJsonFile}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Download Media Organization JSON
                </button>
                <button
                  onClick={copyJsonToClipboard}
                  className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Copy Media JSON to Clipboard
                </button>
                <button
                  onClick={downloadCaptionsJsonFile}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Download Captions JSON
                </button>
              </div>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyNew}
                onChange={(e) => {
                  setShowOnlyNew(e.target.checked);
                  if (e.target.checked) {
                    setSelectedServiceId("");
                    setSelectedProjectId("");
                  }
                }}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span
                className="text-sm font-semibold text-dark-900"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Show only NEW projects (exclude projects already in media-organization.json)
              </span>
            </label>
            <p className="text-xs text-dark-600 mt-1 ml-8" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              When enabled, only shows projects that were added/imported and aren't in the original data file. Use "Filter to Show Only New Projects" button when importing to automatically filter your JSON.
            </p>
            {showOnlyNew && (
              <div className="mt-3 ml-8 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <strong>Active:</strong> Currently showing {displayServices.reduce((sum, s) => sum + s.projects.length, 0)} new project(s) across {displayServices.length} service(s)
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div className="mb-6">
            <label
              className="block text-sm font-semibold mb-2 text-dark-900"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Select Service {showOnlyNew && <span className="text-blue-600">(Filtered)</span>}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => handleServiceSelect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              <option value="">-- Select a service --</option>
              {displayServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.projects.length} projects)
                </option>
              ))}
            </select>
            {showOnlyNew && displayServices.length === 0 && (
              <p className="mt-2 text-sm text-gray-600" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                No new projects found. All projects are already in the current data.
              </p>
            )}
          </div>

          {/* Project Selection */}
          {selectedService && (
            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-2 text-dark-900"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Select or Create Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <option value="">-- Create new project --</option>
                {selectedService.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Project Form */}
          {selectedServiceId && (
            <div className="space-y-6 mb-8">
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., BMW M3 Competition Exterior Detail"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Description (Optional)
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Brief description of the project..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px]"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  placeholder="e.g., Brighton, UK"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                />
              </div>

              {/* Media Items */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Media Items
                </label>
                <div className="space-y-4">
                  {mediaItems.map((media, index) => (
                    <div
                      key={media.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-dark-900" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                          {media.src}
                        </p>
                        <p className="text-sm text-dark-600" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                          {media.type} - {media.alt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveMediaUp(index)}
                          disabled={index === 0}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveMediaDown(index)}
                          disabled={index === mediaItems.length - 1}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveMedia(media.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Media Form */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Media Source Path *
                        </label>
                        <input
                          type="text"
                          value={newMediaSrc}
                          onChange={(e) => setNewMediaSrc(e.target.value)}
                          placeholder="/videos/instagram/image.jpg"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={newMediaAlt}
                          onChange={(e) => setNewMediaAlt(e.target.value)}
                          placeholder="Description"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-dark-900">
                          Type
                        </label>
                        <select
                          value={newMediaType}
                          onChange={(e) => setNewMediaType(e.target.value as "image" | "video")}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleAddMedia}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Add Media
                    </button>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2 text-dark-900"
                  style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Instagram Caption
                </label>
                <textarea
                  value={projectCaption}
                  onChange={(e) => setProjectCaption(e.target.value)}
                  placeholder="Paste the Instagram caption for this project here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[150px]"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                />
                <button
                  onClick={handleSaveCaption}
                  className="mt-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Save Caption
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSaveProject}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {selectedProjectId ? "Update Project" : "Create Project"}
                </button>
                {selectedProjectId && (
                  <button
                    onClick={handleDeleteProject}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    Delete Project
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Projects Summary */}
          <div className="mt-12">
            <h2
              className="text-2xl font-bold mb-4 text-dark-900"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Projects Summary
            </h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3
                    className="font-semibold text-dark-900 mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                  >
                    {service.name} ({service.projects.length} projects)
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {service.projects.map((project) => (
                      <li
                        key={project.id}
                        className="text-dark-700 text-sm"
                        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                      >
                        {project.name} ({project.media.length} media items
                        {captions[project.id] ? ", has caption" : ""})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

