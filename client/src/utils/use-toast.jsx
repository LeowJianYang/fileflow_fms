import { useToast } from "../components/toast";



/**
 * PLEASE USE WITH TAILWINDCSS 
 * @returns {object} - An object containing methods to show different types of toast notifications (Predefined types)
 * @example
 * import { useAppToast } from '../utils/use-toast';
 * const toast = useAppToast();
 * toast.success("Operation successful!", { duration: 5000, position: "bottom-left" });
 * 
 * @description
 * This hook provides convenient methods to show toast notifications of various types:
 * success, error, info, warning, and custom. Each method accepts the content to display
 * and an optional options object to customize duration and position.
 * @see useToast
 */
export const useAppToast = () => {
  const { addToast } = useToast();

  return {
    success: (node, options) => addToast(node, "success", options),
    error: (node, options) => addToast(node, "error", options),
    info: (node, options) => addToast(node, "info", options),
    warning: (node, options) => addToast(node, "warning", options),
    custom: (node, options) => addToast(node, null, options),
  };
};
