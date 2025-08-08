// src/edit.tsx
import React, { useMemo, useState } from "react";

type UserType = "faculty" | "student";

type BaseProfile = {
  type: UserType;
  name: string;
};

type FacultyProfile = BaseProfile & {
  type: "faculty";
  department: string;
  researchAreas: string[];
  supervisionAvailable: boolean;
};

type StudentProfile = BaseProfile & {
  type: "student";
  year: string;
  program: string;
  skills: string[];
  resume?: string;
  clubs: string[];
  projects: string[];
  links?: { github?: string; linkedin?: string };
};

export type ProfileData = FacultyProfile | StudentProfile;

export type CurrentUser =
  | { type: "faculty"; name: string; email?: string }
  | { type: "student"; name: string; email?: string };

// Flattened form state so we can bind inputs easily
type FormState = {
  // shared
  name: string;

  // faculty
  department: string;
  researchAreas: string; // CSV in form
  supervisionAvailable: "true" | "false";

  // student
  year: string;
  program: string;
  skills: string; // CSV in form
  resume: string;
  clubs: string; // CSV
  projects: string; // CSV
  github: string;
  linkedin: string;
};

function parseCsv(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function initialFormState(currentUser: CurrentUser, existing?: ProfileData): FormState {
  // Seed from existing profile if you have one; else from current user
  if (existing) {
    if (existing.type === "faculty") {
      return {
        name: existing.name ?? "",
        department: existing.department ?? "",
        researchAreas: existing.researchAreas?.join(", ") ?? "",
        supervisionAvailable: existing.supervisionAvailable ? "true" : "false",
        year: "",
        program: "",
        skills: "",
        resume: "",
        clubs: "",
        projects: "",
        github: "",
        linkedin: "",
      };
    }
    // student
    return {
      name: existing.name ?? "",
      department: "",
      researchAreas: "",
      supervisionAvailable: "false",
      year: existing.year ?? "",
      program: existing.program ?? "",
      skills: (existing.skills ?? []).join(", "),
      resume: existing.resume ?? "",
      clubs: (existing.clubs ?? []).join(", "),
      projects: (existing.projects ?? []).join(", "),
      github: existing.links?.github ?? "",
      linkedin: existing.links?.linkedin ?? "",
    };
  }

  // default blank
  return {
    name: currentUser.name ?? "",
    department: "",
    researchAreas: "",
    supervisionAvailable: "false",
    year: "",
    program: "",
    skills: "",
    resume: "",
    clubs: "",
    projects: "",
    github: "",
    linkedin: "",
  };
}

type EditProps = {
  currentUser: CurrentUser;
  existingProfile?: ProfileData | null;
  onSaved?: (profile: ProfileData) => void;
};

const EditProfile: React.FC<EditProps> = ({ currentUser, existingProfile, onSaved }) => {
  const [formData, setFormData] = useState<FormState>(
    initialFormState(currentUser, existingProfile ?? undefined)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFaculty = currentUser.type === "faculty";

  const canSubmit = useMemo(() => {
    if (!formData.name.trim()) return false;
    if (isFaculty) {
      return !!formData.department.trim();
    }
    // student
    return !!formData.year.trim() && !!formData.program.trim();
  }, [formData, isFaculty]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let payload: ProfileData;
    try {
      if (isFaculty) {
        payload = {
          type: "faculty",
          name: formData.name.trim(),
          department: formData.department.trim(),
          researchAreas: parseCsv(formData.researchAreas),
          supervisionAvailable: formData.supervisionAvailable === "true",
        };
      } else {
        payload = {
          type: "student",
          name: formData.name.trim(),
          year: formData.year.trim(),
          program: formData.program.trim(),
          skills: parseCsv(formData.skills),
          resume: formData.resume.trim() || undefined,
          clubs: parseCsv(formData.clubs),
          projects: parseCsv(formData.projects),
          links:
            formData.github || formData.linkedin
              ? {
                  github: formData.github.trim() || undefined,
                  linkedin: formData.linkedin.trim() || undefined,
                }
              : undefined,
        };
      }
    } catch (err) {
      setError("Failed to build profile payload.");
      return;
    }

    setSaving(true);
    try {
      // TODO: replace with your actual API call
      // Example:
      // const res = await fetch("/api/profile", { method: "POST", body: JSON.stringify(payload) });
      // if (!res.ok) throw new Error("Request failed");
      await new Promise((r) => setTimeout(r, 600)); // fake delay

      onSaved?.(payload);
    } catch (err: any) {
      setError(err?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shared */}
        <div>
          <label className="block text-sm mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            placeholder="Jane Doe"
          />
        </div>

        {isFaculty ? (
          <>
            <div>
              <label className="block text-sm mb-2" htmlFor="department">
                Department
              </label>
              <input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="researchAreas">
                Research Areas (comma separated)
              </label>
              <input
                id="researchAreas"
                name="researchAreas"
                value={formData.researchAreas}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="HCI, Systems, ML"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="supervisionAvailable">
                Supervision Availability
              </label>
              <select
                id="supervisionAvailable"
                name="supervisionAvailable"
                value={formData.supervisionAvailable}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm mb-2" htmlFor="year">
                Year
              </label>
              <input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="program">
                Program
              </label>
              <input
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="B.Comp – Software Engineering"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="skills">
                Skills (comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="TypeScript, React, C, SQL"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="resume">
                Resume (URL)
              </label>
              <input
                id="resume"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="clubs">
                Clubs (comma separated)
              </label>
              <input
                id="clubs"
                name="clubs"
                value={formData.clubs}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="SoCS, WiCS"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" htmlFor="projects">
                Projects (comma separated)
              </label>
              <input
                id="projects"
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Volunteer Matcher, TravelPal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" htmlFor="github">
                  GitHub
                </label>
                <input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="linkedin">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://www.linkedin.com/in/username"
                />
              </div>
            </div>
          </>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || saving}
          className="px-5 py-3 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
