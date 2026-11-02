// import { createElement } from 'react';
import { toast } from 'react-toastify';

// const icons = {
//   success: CircleCheck,
//   error: CircleX,
//   info: Info,
//   warning: TriangleAlert,
// };

// function toastIcon(type: keyof typeof icons) {
//   return () => createElement(icons[type], { size: 20, strokeWidth: 2.25 });
// }

export const themedToast = {
  success: (msg: string) =>
    toast.success(msg, {
      className: 'toast-success border-2 border-green rounded-md',
      // icon: toastIcon('success'),
    }),
  error: (msg: string) =>
    toast.error(msg, {
      className: 'toast-error border-2 border-destructive rounded-md',
      // icon: toastIcon('error'),
    }),
  info: (msg: string) => toast.info(msg, { className: 'toast-info' }),
  warning: (msg: string) => toast.warn(msg, { className: 'toast-warning' }),
};
