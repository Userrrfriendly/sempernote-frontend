import useMediaQuery from "@material-ui/core/useMediaQuery";

/**
 * useMediaQuery returns true if the screen height is >= 600px ,and false if it is <600
 */
export const useScreenHeight = () => {
  const matches = useMediaQuery("(min-height:600px)");

  return matches;
};
