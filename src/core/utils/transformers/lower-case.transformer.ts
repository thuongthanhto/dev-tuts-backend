import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../types/maybe.type';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => {
  console.log('lowerCaseTransformer called with value:', params.value);
  const result = params.value?.toLowerCase().trim();
  console.log('lowerCaseTransformer returns:', result);
  return result;
};
