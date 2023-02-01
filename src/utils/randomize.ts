export enum NullDeciderType {
  NO_NULL = 0,
  ALLOW_NULL = 1,
}

export const randomize = (input: Array<any>, nullDecider: NullDeciderType) => {
  const randomizeIndex = Math.floor(
    Math.random() * (input.length + nullDecider),
  );
  if (nullDecider === 1 && randomizeIndex === input.length) return null;
  return input[randomizeIndex];
};
