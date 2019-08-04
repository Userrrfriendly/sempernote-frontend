import useMediaQuery from "@material-ui/core/useMediaQuery";

/**
 * useMediaQuery returns true if the screen size is >= 600px ,and false if it is <600
 */
export const useScreenSize = () => {
  const matches = useMediaQuery("(min-width:600px)");

  return matches;
};
