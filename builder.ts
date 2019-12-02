import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { getSystemPath, normalize, JsonObject } from '@angular-devkit/core';

interface SampleBuilderSchema extends JsonObject {
  message: string;
}

export function sampleBuilder(
  options: SampleBuilderSchema,
  context: BuilderContext
): Promise<BuilderOutput> {

  context.logger.info('Running from workspace root: ' + getSystemPath(normalize(context.workspaceRoot)));

  return new Promise<BuilderOutput>(resolve => {
    context.logger.info(options.message);
    resolve({ success: true });
  });
}

export default createBuilder<SampleBuilderSchema>(sampleBuilder);
