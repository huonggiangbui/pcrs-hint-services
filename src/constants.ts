import { HintType } from './types';

export const PROMPT_HEADERS = {
  "Steps to fix student's code:\n1.": HintType.TEXT,
  "Suggestions to improve student's code:\n\n": HintType.CODE,
};
export const MORE_HINT_PROMPT_HEADERS = {
  'Explain the steps above:\n-': HintType.TEXT,
  "More edit suggestions to improve student's code:\n\n": HintType.CODE,
};
export const HINT_BUTTON_TEXT = ['Get a hint', 'Get a next step', 'Help'];
export const HINT_BUTTON_COLOR = ['green'];
export const HINT_TITLE = ['Your hint', 'Next step …'];
export const HINT_DESCRIPTION = ['This is your hint'];
