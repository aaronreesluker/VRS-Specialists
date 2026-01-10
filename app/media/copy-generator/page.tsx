"use client";

import { useState, useMemo, useEffect } from "react";
import mediaData from "@/data/media-organization.json";
import projectCaptionsData from "@/data/project-captions.json";

interface Project {
  id: string;
  name: string;
  serviceName: string;
  serviceId: string;
}

interface ProjectCaption {
  projectId: string;
  projectName: string;
  serviceName: string;
  caption: string;
}

export default function CopyGeneratorPage() {
  // Initialize with imported captions data
  const initializeCaptions = (): Record<string, string> => {
    const captions: Record<string, string> = {};
    projectCaptionsData.forEach((item) => {
      if (item.projectId && item.caption) {
        captions[item.projectId] = item.caption;
      }
    });
    return captions;
  };

  const [projectCaptions, setProjectCaptions] = useState<Record<string, string>>(initializeCaptions);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [instagramCaption, setInstagramCaption] = useState<string>("");
  const [importJson, setImportJson] = useState<string>("");
  const [importError, setImportError] = useState<string>("");

  // Flatten all projects from all services
  const allProjects: Project[] = useMemo(() => {
    const projects: Project[] = [];
    mediaData.services.forEach((service) => {
      service.projects.forEach((project) => {
        projects.push({
          id: project.id,
          name: project.name,
          serviceName: service.name,
          serviceId: service.id,
        });
      });
    });
    return projects.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const selectedProject = useMemo(() => {
    return allProjects.find((p) => p.id === selectedProjectId);
  }, [selectedProjectId, allProjects]);

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Load existing caption if available
    if (projectCaptions[projectId]) {
      setInstagramCaption(projectCaptions[projectId]);
    } else {
      setInstagramCaption("");
    }
  };

  // Save caption to the project
  const saveCaption = () => {
    if (!selectedProjectId) {
      alert("Please select a project first.");
      return;
    }

    if (!instagramCaption.trim()) {
      alert("Please enter a caption.");
      return;
    }

    setProjectCaptions((prev) => ({
      ...prev,
      [selectedProjectId]: instagramCaption.trim(),
    }));

    // Clear selection and input
    setSelectedProjectId("");
    setInstagramCaption("");
    alert("Caption saved! Select another project to continue.");
  };

  // Export all captions as JSON
  const exportJSON = () => {
    const exportData: ProjectCaption[] = allProjects
      .filter((project) => projectCaptions[project.id])
      .map((project) => ({
        projectId: project.id,
        projectName: project.name,
        serviceName: project.serviceName,
        caption: projectCaptions[project.id],
      }));

    if (exportData.length === 0) {
      alert("No captions to export. Please add captions to projects first.");
      return;
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `project-captions-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy JSON to clipboard
  const copyJSONToClipboard = () => {
    const exportData: ProjectCaption[] = allProjects
      .filter((project) => projectCaptions[project.id])
      .map((project) => ({
        projectId: project.id,
        projectName: project.name,
        serviceName: project.serviceName,
        caption: projectCaptions[project.id],
      }));

    if (exportData.length === 0) {
      alert("No captions to copy. Please add captions to projects first.");
      return;
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert("JSON copied to clipboard!");
  };

  // Count projects with captions
  const projectsWithCaptions = useMemo(() => {
    return allProjects.filter((p) => projectCaptions[p.id]).length;
  }, [allProjects, projectCaptions]);

  // Import JSON data
  const handleImportJSON = () => {
    setImportError("");
    
    if (!importJson.trim()) {
      setImportError("Please paste JSON data to import.");
      return;
    }

    try {
      const importedData: ProjectCaption[] = JSON.parse(importJson);
      
      // Validate structure
      if (!Array.isArray(importedData)) {
        setImportError("JSON must be an array of objects.");
        return;
      }

      // Map imported data to projectCaptions
      const newCaptions: Record<string, string> = {};
      let importedCount = 0;
      let notFoundCount = 0;

      importedData.forEach((item) => {
        if (!item.projectId || !item.caption) {
          return;
        }

        // Check if project exists
        const projectExists = allProjects.some((p) => p.id === item.projectId);
        if (projectExists) {
          newCaptions[item.projectId] = item.caption;
          importedCount++;
        } else {
          notFoundCount++;
        }
      });

      // Merge with existing captions (imported data takes precedence)
      setProjectCaptions((prev) => ({
        ...prev,
        ...newCaptions,
      }));

      setImportJson("");
      
      if (notFoundCount > 0) {
        alert(`Imported ${importedCount} captions. ${notFoundCount} project(s) not found in current project list.`);
      } else {
        alert(`Successfully imported ${importedCount} captions!`);
      }
    } catch (err) {
      setImportError("Invalid JSON format. Please check your JSON input.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 
            className="text-3xl font-bold mb-2 text-dark-900"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Project Caption Manager
          </h1>
          <p 
            className="text-dark-700 mb-6"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Add Instagram captions to projects and export as JSON.
          </p>

          {/* Stats */}
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <p 
              className="text-dark-900 font-semibold"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Progress: {projectsWithCaptions} / {allProjects.length} projects have captions
            </p>
          </div>

          {/* Import JSON Section */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 
              className="text-lg font-bold mb-3 text-dark-900"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Import Captions from JSON
            </h2>
            <p 
              className="text-sm text-dark-700 mb-3"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Paste your JSON array with project captions to import them all at once.
            </p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='Paste JSON array here, e.g., [{"projectId": "...", "caption": "..."}, ...]'
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[150px] font-mono text-sm mb-3"
            />
            {importError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{importError}</p>
              </div>
            )}
            <button
              onClick={handleImportJSON}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Import JSON
            </button>
          </div>

          {/* Project Selection */}
          <div className="mb-6">
            <label 
              className="block text-sm font-semibold mb-2 text-dark-900"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              <option value="">-- Select a project --</option>
              {allProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  [{project.serviceName}] {project.name} {projectCaptions[project.id] ? "✓" : ""}
                </option>
              ))}
            </select>
            {selectedProject && (
              <div className="mt-2">
                <p 
                  className="text-sm text-dark-600"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Selected: <strong>{selectedProject.name}</strong> ({selectedProject.serviceName})
                </p>
                {projectCaptions[selectedProject.id] && (
                  <p 
                    className="text-xs text-green-600 mt-1"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    This project already has a caption. Editing will replace it.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Instagram Caption */}
          {selectedProjectId && (
            <div className="mb-6">
              <label 
                className="block text-sm font-semibold mb-2 text-dark-900"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Instagram Caption
              </label>
              <textarea
                value={instagramCaption}
                onChange={(e) => setInstagramCaption(e.target.value)}
                placeholder="Paste the Instagram caption from your client's post here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[200px]"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              />
              <p 
                className="text-xs text-dark-500 mt-1"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {instagramCaption.length} characters
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedProjectId && (
            <div className="mb-6 flex gap-4">
              <button
                onClick={saveCaption}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Save Caption
              </button>
              <button
                onClick={() => {
                  setSelectedProjectId("");
                  setInstagramCaption("");
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Export Section */}
          {projectsWithCaptions > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 
                className="text-xl font-bold mb-4 text-dark-900"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Export Captions
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={exportJSON}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Download JSON File
                </button>
                <button
                  onClick={copyJSONToClipboard}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Copy JSON to Clipboard
                </button>
              </div>
              <p 
                className="text-sm text-dark-600 mt-2"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Export format: Array of objects with projectId, projectName, serviceName, and caption
              </p>
            </div>
          )}

          {/* Preview of Captions */}
          {projectsWithCaptions > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 
                className="text-xl font-bold mb-4 text-dark-900"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Captions Added ({projectsWithCaptions})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allProjects
                  .filter((project) => projectCaptions[project.id])
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p 
                            className="font-semibold text-dark-900"
                            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                          >
                            {project.name}
                          </p>
                          <p 
                            className="text-sm text-dark-600"
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                            {project.serviceName}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newCaptions = { ...projectCaptions };
                            delete newCaptions[project.id];
                            setProjectCaptions(newCaptions);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p 
                        className="text-dark-700 text-sm whitespace-pre-wrap"
                        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                      >
                        {projectCaptions[project.id]}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

