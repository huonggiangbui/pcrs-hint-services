export const randomize = (input: Array<any>) => {
  const randomizeIndex = Math.floor(Math.random() * input.length);
  return input[randomizeIndex];
};
