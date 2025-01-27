// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as commander from "commander";
import { logErrorMessage } from "office-addin-usage-data";
import { usageDataObject } from "./defaults";
import { convertProject } from "./convert";

export async function convert(command: commander.Command) {
  try {
    const manifestPath: string = command.manifest ?? "./manifest.xml";
    const backupPath: string = command.backup ?? "./backup.zip";

    await convertProject(manifestPath, backupPath);
    usageDataObject.reportSuccess("convert");
  } catch (err: any) {
    usageDataObject.reportException("convert", err);
    logErrorMessage(err);
  }
}
