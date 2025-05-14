module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "1-tokens-color-modes-border-secondary":
          "var(--1-tokens-color-modes-border-secondary)",
        "1-tokens-color-modes-common-danger-hight":
          "var(--1-tokens-color-modes-common-danger-hight)",
        "1-tokens-color-modes-common-danger-highter":
          "var(--1-tokens-color-modes-common-danger-highter)",
        "1-tokens-color-modes-common-danger-hightest":
          "var(--1-tokens-color-modes-common-danger-hightest)",
        "1-tokens-color-modes-common-danger-low":
          "var(--1-tokens-color-modes-common-danger-low)",
        "1-tokens-color-modes-common-danger-lower":
          "var(--1-tokens-color-modes-common-danger-lower)",
        "1-tokens-color-modes-common-danger-lowest":
          "var(--1-tokens-color-modes-common-danger-lowest)",
        "1-tokens-color-modes-common-danger-medium":
          "var(--1-tokens-color-modes-common-danger-medium)",
        "1-tokens-color-modes-common-neutral-hight":
          "var(--1-tokens-color-modes-common-neutral-hight)",
        "1-tokens-color-modes-common-neutral-highter":
          "var(--1-tokens-color-modes-common-neutral-highter)",
        "1-tokens-color-modes-common-neutral-hightest":
          "var(--1-tokens-color-modes-common-neutral-hightest)",
        "1-tokens-color-modes-common-neutral-low":
          "var(--1-tokens-color-modes-common-neutral-low)",
        "1-tokens-color-modes-common-neutral-lower":
          "var(--1-tokens-color-modes-common-neutral-lower)",
        "1-tokens-color-modes-common-neutral-lowest":
          "var(--1-tokens-color-modes-common-neutral-lowest)",
        "1-tokens-color-modes-common-neutral-medium":
          "var(--1-tokens-color-modes-common-neutral-medium)",
        "1-tokens-color-modes-common-primary-brand-hight":
          "var(--1-tokens-color-modes-common-primary-brand-hight)",
        "1-tokens-color-modes-common-primary-brand-highter":
          "var(--1-tokens-color-modes-common-primary-brand-highter)",
        "1-tokens-color-modes-common-primary-brand-hightest":
          "var(--1-tokens-color-modes-common-primary-brand-hightest)",
        "1-tokens-color-modes-common-primary-brand-low":
          "var(--1-tokens-color-modes-common-primary-brand-low)",
        "1-tokens-color-modes-common-primary-brand-lower":
          "var(--1-tokens-color-modes-common-primary-brand-lower)",
        "1-tokens-color-modes-common-primary-brand-lowest":
          "var(--1-tokens-color-modes-common-primary-brand-lowest)",
        "1-tokens-color-modes-common-primary-brand-medium":
          "var(--1-tokens-color-modes-common-primary-brand-medium)",
        "1-tokens-color-modes-common-secondary-brand-hight":
          "var(--1-tokens-color-modes-common-secondary-brand-hight)",
        "1-tokens-color-modes-common-secondary-brand-highter":
          "var(--1-tokens-color-modes-common-secondary-brand-highter)",
        "1-tokens-color-modes-common-secondary-brand-hightest":
          "var(--1-tokens-color-modes-common-secondary-brand-hightest)",
        "1-tokens-color-modes-common-secondary-brand-low":
          "var(--1-tokens-color-modes-common-secondary-brand-low)",
        "1-tokens-color-modes-common-secondary-brand-lower":
          "var(--1-tokens-color-modes-common-secondary-brand-lower)",
        "1-tokens-color-modes-common-secondary-brand-lowest":
          "var(--1-tokens-color-modes-common-secondary-brand-lowest)",
        "1-tokens-color-modes-common-secondary-brand-medium":
          "var(--1-tokens-color-modes-common-secondary-brand-medium)",
        "1-tokens-color-modes-common-success-hight":
          "var(--1-tokens-color-modes-common-success-hight)",
        "1-tokens-color-modes-common-success-highter":
          "var(--1-tokens-color-modes-common-success-highter)",
        "1-tokens-color-modes-common-success-hightest":
          "var(--1-tokens-color-modes-common-success-hightest)",
        "1-tokens-color-modes-common-success-low":
          "var(--1-tokens-color-modes-common-success-low)",
        "1-tokens-color-modes-common-success-lower":
          "var(--1-tokens-color-modes-common-success-lower)",
        "1-tokens-color-modes-common-success-lowest":
          "var(--1-tokens-color-modes-common-success-lowest)",
        "1-tokens-color-modes-common-success-medium":
          "var(--1-tokens-color-modes-common-success-medium)",
        "1-tokens-color-modes-common-warning-hight":
          "var(--1-tokens-color-modes-common-warning-hight)",
        "1-tokens-color-modes-common-warning-highter":
          "var(--1-tokens-color-modes-common-warning-highter)",
        "1-tokens-color-modes-common-warning-hightest":
          "var(--1-tokens-color-modes-common-warning-hightest)",
        "1-tokens-color-modes-common-warning-low":
          "var(--1-tokens-color-modes-common-warning-low)",
        "1-tokens-color-modes-common-warning-lower":
          "var(--1-tokens-color-modes-common-warning-lower)",
        "1-tokens-color-modes-common-warning-lowest":
          "var(--1-tokens-color-modes-common-warning-lowest)",
        "1-tokens-color-modes-common-warning-medium":
          "var(--1-tokens-color-modes-common-warning-medium)",
        "1-tokens-color-modes-nav-tab-primary-disable-border":
          "var(--1-tokens-color-modes-nav-tab-primary-disable-border)",
        "3-primitives-color-amber-100": "var(--3-primitives-color-amber-100)",
        "3-primitives-color-amber-200": "var(--3-primitives-color-amber-200)",
        "3-primitives-color-amber-300": "var(--3-primitives-color-amber-300)",
        "3-primitives-color-amber-400": "var(--3-primitives-color-amber-400)",
        "3-primitives-color-amber-50": "var(--3-primitives-color-amber-50)",
        "3-primitives-color-amber-500": "var(--3-primitives-color-amber-500)",
        "3-primitives-color-amber-600": "var(--3-primitives-color-amber-600)",
        "3-primitives-color-amber-700": "var(--3-primitives-color-amber-700)",
        "3-primitives-color-amber-800": "var(--3-primitives-color-amber-800)",
        "3-primitives-color-amber-900": "var(--3-primitives-color-amber-900)",
        "3-primitives-color-amber-950": "var(--3-primitives-color-amber-950)",
        "3-primitives-color-blue-100": "var(--3-primitives-color-blue-100)",
        "3-primitives-color-blue-200": "var(--3-primitives-color-blue-200)",
        "3-primitives-color-blue-300": "var(--3-primitives-color-blue-300)",
        "3-primitives-color-blue-400": "var(--3-primitives-color-blue-400)",
        "3-primitives-color-blue-50": "var(--3-primitives-color-blue-50)",
        "3-primitives-color-blue-500": "var(--3-primitives-color-blue-500)",
        "3-primitives-color-blue-600": "var(--3-primitives-color-blue-600)",
        "3-primitives-color-blue-700": "var(--3-primitives-color-blue-700)",
        "3-primitives-color-blue-800": "var(--3-primitives-color-blue-800)",
        "3-primitives-color-blue-900": "var(--3-primitives-color-blue-900)",
        "3-primitives-color-blue-950": "var(--3-primitives-color-blue-950)",
        "3-primitives-color-cyan-100": "var(--3-primitives-color-cyan-100)",
        "3-primitives-color-cyan-200": "var(--3-primitives-color-cyan-200)",
        "3-primitives-color-cyan-300": "var(--3-primitives-color-cyan-300)",
        "3-primitives-color-cyan-400": "var(--3-primitives-color-cyan-400)",
        "3-primitives-color-cyan-50": "var(--3-primitives-color-cyan-50)",
        "3-primitives-color-cyan-500": "var(--3-primitives-color-cyan-500)",
        "3-primitives-color-cyan-600": "var(--3-primitives-color-cyan-600)",
        "3-primitives-color-cyan-700": "var(--3-primitives-color-cyan-700)",
        "3-primitives-color-cyan-800": "var(--3-primitives-color-cyan-800)",
        "3-primitives-color-cyan-900": "var(--3-primitives-color-cyan-900)",
        "3-primitives-color-cyan-950": "var(--3-primitives-color-cyan-950)",
        "3-primitives-color-dark-0": "var(--3-primitives-color-dark-0)",
        "3-primitives-color-dark-10": "var(--3-primitives-color-dark-10)",
        "3-primitives-color-dark-100": "var(--3-primitives-color-dark-100)",
        "3-primitives-color-dark-2": "var(--3-primitives-color-dark-2)",
        "3-primitives-color-dark-20": "var(--3-primitives-color-dark-20)",
        "3-primitives-color-dark-30": "var(--3-primitives-color-dark-30)",
        "3-primitives-color-dark-4": "var(--3-primitives-color-dark-4)",
        "3-primitives-color-dark-40": "var(--3-primitives-color-dark-40)",
        "3-primitives-color-dark-50": "var(--3-primitives-color-dark-50)",
        "3-primitives-color-dark-6": "var(--3-primitives-color-dark-6)",
        "3-primitives-color-dark-60": "var(--3-primitives-color-dark-60)",
        "3-primitives-color-dark-70": "var(--3-primitives-color-dark-70)",
        "3-primitives-color-dark-8": "var(--3-primitives-color-dark-8)",
        "3-primitives-color-dark-80": "var(--3-primitives-color-dark-80)",
        "3-primitives-color-dark-90": "var(--3-primitives-color-dark-90)",
        "3-primitives-color-emerald-200":
          "var(--3-primitives-color-emerald-200)",
        "3-primitives-color-emerald-500":
          "var(--3-primitives-color-emerald-500)",
        "3-primitives-color-emerald-700":
          "var(--3-primitives-color-emerald-700)",
        "3-primitives-color-emerald-900":
          "var(--3-primitives-color-emerald-900)",
        "3-primitives-color-fuchsia-100":
          "var(--3-primitives-color-fuchsia-100)",
        "3-primitives-color-fuchsia-200":
          "var(--3-primitives-color-fuchsia-200)",
        "3-primitives-color-fuchsia-300":
          "var(--3-primitives-color-fuchsia-300)",
        "3-primitives-color-fuchsia-400":
          "var(--3-primitives-color-fuchsia-400)",
        "3-primitives-color-fuchsia-50": "var(--3-primitives-color-fuchsia-50)",
        "3-primitives-color-fuchsia-500":
          "var(--3-primitives-color-fuchsia-500)",
        "3-primitives-color-fuchsia-600":
          "var(--3-primitives-color-fuchsia-600)",
        "3-primitives-color-fuchsia-700":
          "var(--3-primitives-color-fuchsia-700)",
        "3-primitives-color-fuchsia-800":
          "var(--3-primitives-color-fuchsia-800)",
        "3-primitives-color-fuchsia-900":
          "var(--3-primitives-color-fuchsia-900)",
        "3-primitives-color-fuchsia-950":
          "var(--3-primitives-color-fuchsia-950)",
        "3-primitives-color-gray-100": "var(--3-primitives-color-gray-100)",
        "3-primitives-color-gray-200": "var(--3-primitives-color-gray-200)",
        "3-primitives-color-gray-300": "var(--3-primitives-color-gray-300)",
        "3-primitives-color-gray-400": "var(--3-primitives-color-gray-400)",
        "3-primitives-color-gray-50": "var(--3-primitives-color-gray-50)",
        "3-primitives-color-gray-500": "var(--3-primitives-color-gray-500)",
        "3-primitives-color-gray-600": "var(--3-primitives-color-gray-600)",
        "3-primitives-color-gray-700": "var(--3-primitives-color-gray-700)",
        "3-primitives-color-gray-800": "var(--3-primitives-color-gray-800)",
        "3-primitives-color-gray-900": "var(--3-primitives-color-gray-900)",
        "3-primitives-color-gray-950": "var(--3-primitives-color-gray-950)",
        "3-primitives-color-green-100": "var(--3-primitives-color-green-100)",
        "3-primitives-color-green-200": "var(--3-primitives-color-green-200)",
        "3-primitives-color-green-300": "var(--3-primitives-color-green-300)",
        "3-primitives-color-green-400": "var(--3-primitives-color-green-400)",
        "3-primitives-color-green-50": "var(--3-primitives-color-green-50)",
        "3-primitives-color-green-500": "var(--3-primitives-color-green-500)",
        "3-primitives-color-green-600": "var(--3-primitives-color-green-600)",
        "3-primitives-color-green-700": "var(--3-primitives-color-green-700)",
        "3-primitives-color-green-800": "var(--3-primitives-color-green-800)",
        "3-primitives-color-green-900": "var(--3-primitives-color-green-900)",
        "3-primitives-color-green-950": "var(--3-primitives-color-green-950)",
        "3-primitives-color-indigo-200": "var(--3-primitives-color-indigo-200)",
        "3-primitives-color-indigo-500": "var(--3-primitives-color-indigo-500)",
        "3-primitives-color-indigo-700": "var(--3-primitives-color-indigo-700)",
        "3-primitives-color-indigo-900": "var(--3-primitives-color-indigo-900)",
        "3-primitives-color-light-2": "var(--3-primitives-color-light-2)",
        "3-primitives-color-light-20": "var(--3-primitives-color-light-20)",
        "3-primitives-color-light-30": "var(--3-primitives-color-light-30)",
        "3-primitives-color-light-4": "var(--3-primitives-color-light-4)",
        "3-primitives-color-light-40": "var(--3-primitives-color-light-40)",
        "3-primitives-color-light-50": "var(--3-primitives-color-light-50)",
        "3-primitives-color-light-6": "var(--3-primitives-color-light-6)",
        "3-primitives-color-light-60": "var(--3-primitives-color-light-60)",
        "3-primitives-color-light-70": "var(--3-primitives-color-light-70)",
        "3-primitives-color-light-8": "var(--3-primitives-color-light-8)",
        "3-primitives-color-light-80": "var(--3-primitives-color-light-80)",
        "3-primitives-color-light-90": "var(--3-primitives-color-light-90)",
        "3-primitives-color-lime-100": "var(--3-primitives-color-lime-100)",
        "3-primitives-color-lime-200": "var(--3-primitives-color-lime-200)",
        "3-primitives-color-lime-300": "var(--3-primitives-color-lime-300)",
        "3-primitives-color-lime-400": "var(--3-primitives-color-lime-400)",
        "3-primitives-color-lime-50": "var(--3-primitives-color-lime-50)",
        "3-primitives-color-lime-500": "var(--3-primitives-color-lime-500)",
        "3-primitives-color-lime-600": "var(--3-primitives-color-lime-600)",
        "3-primitives-color-lime-700": "var(--3-primitives-color-lime-700)",
        "3-primitives-color-lime-800": "var(--3-primitives-color-lime-800)",
        "3-primitives-color-lime-900": "var(--3-primitives-color-lime-900)",
        "3-primitives-color-lime-950": "var(--3-primitives-color-lime-950)",
        "3-primitives-color-neutral-100":
          "var(--3-primitives-color-neutral-100)",
        "3-primitives-color-neutral-200":
          "var(--3-primitives-color-neutral-200)",
        "3-primitives-color-neutral-300":
          "var(--3-primitives-color-neutral-300)",
        "3-primitives-color-neutral-400":
          "var(--3-primitives-color-neutral-400)",
        "3-primitives-color-neutral-50": "var(--3-primitives-color-neutral-50)",
        "3-primitives-color-neutral-500":
          "var(--3-primitives-color-neutral-500)",
        "3-primitives-color-neutral-600":
          "var(--3-primitives-color-neutral-600)",
        "3-primitives-color-neutral-700":
          "var(--3-primitives-color-neutral-700)",
        "3-primitives-color-neutral-800":
          "var(--3-primitives-color-neutral-800)",
        "3-primitives-color-neutral-900":
          "var(--3-primitives-color-neutral-900)",
        "3-primitives-color-neutral-950":
          "var(--3-primitives-color-neutral-950)",
        "3-primitives-color-orange-200": "var(--3-primitives-color-orange-200)",
        "3-primitives-color-orange-500": "var(--3-primitives-color-orange-500)",
        "3-primitives-color-orange-700": "var(--3-primitives-color-orange-700)",
        "3-primitives-color-orange-900": "var(--3-primitives-color-orange-900)",
        "3-primitives-color-pink-100": "var(--3-primitives-color-pink-100)",
        "3-primitives-color-pink-200": "var(--3-primitives-color-pink-200)",
        "3-primitives-color-pink-300": "var(--3-primitives-color-pink-300)",
        "3-primitives-color-pink-400": "var(--3-primitives-color-pink-400)",
        "3-primitives-color-pink-50": "var(--3-primitives-color-pink-50)",
        "3-primitives-color-pink-500": "var(--3-primitives-color-pink-500)",
        "3-primitives-color-pink-600": "var(--3-primitives-color-pink-600)",
        "3-primitives-color-pink-700": "var(--3-primitives-color-pink-700)",
        "3-primitives-color-pink-800": "var(--3-primitives-color-pink-800)",
        "3-primitives-color-pink-900": "var(--3-primitives-color-pink-900)",
        "3-primitives-color-pink-950": "var(--3-primitives-color-pink-950)",
        "3-primitives-color-purple-200": "var(--3-primitives-color-purple-200)",
        "3-primitives-color-purple-500": "var(--3-primitives-color-purple-500)",
        "3-primitives-color-purple-700": "var(--3-primitives-color-purple-700)",
        "3-primitives-color-purple-900": "var(--3-primitives-color-purple-900)",
        "3-primitives-color-red-200": "var(--3-primitives-color-red-200)",
        "3-primitives-color-red-500": "var(--3-primitives-color-red-500)",
        "3-primitives-color-red-700": "var(--3-primitives-color-red-700)",
        "3-primitives-color-red-900": "var(--3-primitives-color-red-900)",
        "3-primitives-color-rose-100": "var(--3-primitives-color-rose-100)",
        "3-primitives-color-rose-200": "var(--3-primitives-color-rose-200)",
        "3-primitives-color-rose-300": "var(--3-primitives-color-rose-300)",
        "3-primitives-color-rose-400": "var(--3-primitives-color-rose-400)",
        "3-primitives-color-rose-50": "var(--3-primitives-color-rose-50)",
        "3-primitives-color-rose-500": "var(--3-primitives-color-rose-500)",
        "3-primitives-color-rose-600": "var(--3-primitives-color-rose-600)",
        "3-primitives-color-rose-700": "var(--3-primitives-color-rose-700)",
        "3-primitives-color-rose-800": "var(--3-primitives-color-rose-800)",
        "3-primitives-color-rose-900": "var(--3-primitives-color-rose-900)",
        "3-primitives-color-rose-950": "var(--3-primitives-color-rose-950)",
        "3-primitives-color-sky-100": "var(--3-primitives-color-sky-100)",
        "3-primitives-color-sky-200": "var(--3-primitives-color-sky-200)",
        "3-primitives-color-sky-300": "var(--3-primitives-color-sky-300)",
        "3-primitives-color-sky-400": "var(--3-primitives-color-sky-400)",
        "3-primitives-color-sky-50": "var(--3-primitives-color-sky-50)",
        "3-primitives-color-sky-500": "var(--3-primitives-color-sky-500)",
        "3-primitives-color-sky-600": "var(--3-primitives-color-sky-600)",
        "3-primitives-color-sky-700": "var(--3-primitives-color-sky-700)",
        "3-primitives-color-sky-800": "var(--3-primitives-color-sky-800)",
        "3-primitives-color-sky-900": "var(--3-primitives-color-sky-900)",
        "3-primitives-color-sky-950": "var(--3-primitives-color-sky-950)",
        "3-primitives-color-slate-200": "var(--3-primitives-color-slate-200)",
        "3-primitives-color-slate-400": "var(--3-primitives-color-slate-400)",
        "3-primitives-color-slate-50": "var(--3-primitives-color-slate-50)",
        "3-primitives-color-slate-700": "var(--3-primitives-color-slate-700)",
        "3-primitives-color-slate-950": "var(--3-primitives-color-slate-950)",
        "3-primitives-color-stone-100": "var(--3-primitives-color-stone-100)",
        "3-primitives-color-stone-200": "var(--3-primitives-color-stone-200)",
        "3-primitives-color-stone-300": "var(--3-primitives-color-stone-300)",
        "3-primitives-color-stone-400": "var(--3-primitives-color-stone-400)",
        "3-primitives-color-stone-50": "var(--3-primitives-color-stone-50)",
        "3-primitives-color-stone-500": "var(--3-primitives-color-stone-500)",
        "3-primitives-color-stone-600": "var(--3-primitives-color-stone-600)",
        "3-primitives-color-stone-700": "var(--3-primitives-color-stone-700)",
        "3-primitives-color-stone-800": "var(--3-primitives-color-stone-800)",
        "3-primitives-color-stone-900": "var(--3-primitives-color-stone-900)",
        "3-primitives-color-stone-950": "var(--3-primitives-color-stone-950)",
        "3-primitives-color-teal-100": "var(--3-primitives-color-teal-100)",
        "3-primitives-color-teal-200": "var(--3-primitives-color-teal-200)",
        "3-primitives-color-teal-300": "var(--3-primitives-color-teal-300)",
        "3-primitives-color-teal-400": "var(--3-primitives-color-teal-400)",
        "3-primitives-color-teal-50": "var(--3-primitives-color-teal-50)",
        "3-primitives-color-teal-500": "var(--3-primitives-color-teal-500)",
        "3-primitives-color-teal-600": "var(--3-primitives-color-teal-600)",
        "3-primitives-color-teal-700": "var(--3-primitives-color-teal-700)",
        "3-primitives-color-teal-800": "var(--3-primitives-color-teal-800)",
        "3-primitives-color-teal-900": "var(--3-primitives-color-teal-900)",
        "3-primitives-color-teal-950": "var(--3-primitives-color-teal-950)",
        "3-primitives-color-violet-100": "var(--3-primitives-color-violet-100)",
        "3-primitives-color-violet-200": "var(--3-primitives-color-violet-200)",
        "3-primitives-color-violet-300": "var(--3-primitives-color-violet-300)",
        "3-primitives-color-violet-400": "var(--3-primitives-color-violet-400)",
        "3-primitives-color-violet-50": "var(--3-primitives-color-violet-50)",
        "3-primitives-color-violet-500": "var(--3-primitives-color-violet-500)",
        "3-primitives-color-violet-600": "var(--3-primitives-color-violet-600)",
        "3-primitives-color-violet-700": "var(--3-primitives-color-violet-700)",
        "3-primitives-color-violet-800": "var(--3-primitives-color-violet-800)",
        "3-primitives-color-violet-900": "var(--3-primitives-color-violet-900)",
        "3-primitives-color-violet-950": "var(--3-primitives-color-violet-950)",
        "3-primitives-color-yellow-100": "var(--3-primitives-color-yellow-100)",
        "3-primitives-color-yellow-200": "var(--3-primitives-color-yellow-200)",
        "3-primitives-color-yellow-300": "var(--3-primitives-color-yellow-300)",
        "3-primitives-color-yellow-400": "var(--3-primitives-color-yellow-400)",
        "3-primitives-color-yellow-50": "var(--3-primitives-color-yellow-50)",
        "3-primitives-color-yellow-500": "var(--3-primitives-color-yellow-500)",
        "3-primitives-color-yellow-600": "var(--3-primitives-color-yellow-600)",
        "3-primitives-color-yellow-700": "var(--3-primitives-color-yellow-700)",
        "3-primitives-color-yellow-800": "var(--3-primitives-color-yellow-800)",
        "3-primitives-color-yellow-900": "var(--3-primitives-color-yellow-900)",
        "3-primitives-color-yellow-950": "var(--3-primitives-color-yellow-950)",
        "3-primitives-color-zinc-100": "var(--3-primitives-color-zinc-100)",
        "3-primitives-color-zinc-200": "var(--3-primitives-color-zinc-200)",
        "3-primitives-color-zinc-300": "var(--3-primitives-color-zinc-300)",
        "3-primitives-color-zinc-400": "var(--3-primitives-color-zinc-400)",
        "3-primitives-color-zinc-50": "var(--3-primitives-color-zinc-50)",
        "3-primitives-color-zinc-500": "var(--3-primitives-color-zinc-500)",
        "3-primitives-color-zinc-600": "var(--3-primitives-color-zinc-600)",
        "3-primitives-color-zinc-700": "var(--3-primitives-color-zinc-700)",
        "3-primitives-color-zinc-800": "var(--3-primitives-color-zinc-800)",
        "3-primitives-color-zinc-900": "var(--3-primitives-color-zinc-900)",
        "3-primitives-color-zinc-950": "var(--3-primitives-color-zinc-950)",
        "colourgrey-100": "var(--colourgrey-100)",
        defaultalert: "var(--defaultalert)",
        defaultwhite: "var(--defaultwhite)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica"],
        display: ["Inter", "Helvetica"],
        text: ["Inter", "Helvetica"],
      },
      fontSize: {
        "display-h1": ["2.5rem", { lineHeight: "3rem", fontWeight: "700" }],
        "display-h2": ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "display-h3": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "600" }],
        "display-h4": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "display-h5": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "display-h6": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],

        "text-xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "text-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "text-base": ["1rem", { lineHeight: "1.5rem" }],
        "text-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "text-xs": ["0.75rem", { lineHeight: "1rem" }],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      boxShadow: {
        shadow: "var(--shadow)",
        "shadow-2xl": "var(--shadow-2xl)",
        "shadow-lg": "var(--shadow-lg)",
        "shadow-md": "var(--shadow-md)",
        "shadow-sm": "var(--shadow-sm)",
        "shadow-xl": "var(--shadow-xl)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
