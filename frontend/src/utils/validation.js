export const validateNotEmpty = (value) => value?.trim().length > 0;
export const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
export const validatePassword = (value) => value?.length >= 6;
export const validateUsername = (value) => value?.length >= 4;