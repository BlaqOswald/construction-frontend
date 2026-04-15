import { createContext, useContext, useState } from "react";

const ProjectContext = createContext<any>(null);

export const ProjectProvider = ({ children }: any) => {
  const [projectId, setProjectId] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
