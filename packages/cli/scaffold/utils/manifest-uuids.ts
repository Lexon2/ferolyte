import { v4 as uuidv4 } from 'uuid';

export interface ManifestUuids {
  behaviorPackHeader: string;
  behaviorPackDataModule: string;
  behaviorPackScriptModule: string;
  resourcePackHeader: string;
  resourcePackModule: string;
}

export const createManifestUuids = (): ManifestUuids => ({
  behaviorPackHeader: uuidv4(),
  behaviorPackDataModule: uuidv4(),
  behaviorPackScriptModule: uuidv4(),
  resourcePackHeader: uuidv4(),
  resourcePackModule: uuidv4(),
});
