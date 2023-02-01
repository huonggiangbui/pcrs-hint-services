import { HintType } from './types';

export const HINT_BUTTON_TEXT = ['Get hint'];
export const PROMPT_HEADERS = {
  "Steps to fix student's code:\n1.": HintType.TEXT,
  "Suggestions to improve student's code:\n\n": HintType.CODE,
};
export const MORE_HINT_PROMPT_HEADERS = {
  'Explain the steps above:\n-': HintType.TEXT,
  "More edit suggestions to improve student's code:\n\n": HintType.CODE,
};
export const HINT_TITLE = ['Hint'];
export const HINT_DESCRIPTION = ['This is your hint'];
